import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { cleanUrl } from '$lib/server/cleaner';
import { redis } from '$lib/server/redis';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
    console.log('[DASHBOARD_TRACE] Entering load function');

    // Privacy Logic: Must be authenticated
    if (!locals.user || !locals.user.id) {
        console.warn('[DASHBOARD_TRACE] No user session found, redirecting to login');
        throw redirect(302, '/login');
    }

    try {
        console.log(`[DASHBOARD_TRACE] Fetching links for user: ${locals.user.id}`);

        // Auto-Purge Logic: Only show links from the last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const links = await db.link.findMany({
            where: {
                userId: locals.user.id,
                createdAt: {
                    gte: thirtyDaysAgo
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log(`[DASHBOARD_TRACE] Found ${links.length} links in DB`);

        let linksWithStats = [];

        if (links.length > 0) {
            console.log('[DASHBOARD_TRACE] Fetching click counts from Redis');
            const pipeline = redis.pipeline();
            for (const link of links) {
                pipeline.get(`clicks:${link.slug}`);
            }
            const clickCounts = await pipeline.exec();

            linksWithStats = links.map((link, index) => {
                const countValue = clickCounts ? clickCounts[index] : 0;
                let clicks = 0;
                if (typeof countValue === 'string') {
                    clicks = parseInt(countValue, 10);
                } else if (typeof countValue === 'number') {
                    clicks = countValue;
                }

                return {
                    ...link,
                    clicks
                };
            });
        } else {
            console.log('[DASHBOARD_TRACE] No links to fetch counts for');
        }

        console.log('[DASHBOARD_TRACE] Load complete, returning data');

        return {
            user: locals.user,
            links: linksWithStats
        };
    } catch (err: any) {
        console.error('[DASHBOARD_TRACE] FATAL ERROR IN DASHBOARD LOAD:', err);
        // We throw a SvelteKit error instead of a generic 500 to see if we can get more info
        throw error(500, {
            message: 'Internal Database or Cache Error',
            code: err.code || 'UNKNOWN'
        });
    }
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user) {
            throw redirect(302, '/login');
        }

        const data = await request.formData();
        const originalUrl = data.get('url')?.toString() || '';
        let customSlug = data.get('customSlug')?.toString()?.trim();
        const expirationDays = data.get('expiration')?.toString(); // Optional: "1", "7", "30", or "never"

        if (!originalUrl) {
            return { error: 'Destination URL is required.' };
        }

        try {
            new URL(originalUrl); // Simple validation
        } catch (e) {
            return { error: 'Invalid URL format.' };
        }

        // Clean the URL
        const { url: cleanedUrl } = cleanUrl(originalUrl);

        // Determine Slug
        let finalSlug = customSlug;
        if (customSlug) {
            if (!/^[a-zA-Z0-9\-_]+$/.test(customSlug)) {
                return { error: 'Custom alias can only contain letters, numbers, hyphens, and underscores.' };
            }
            // Check availability in DB and Redis
            const existingDb = await db.link.findUnique({ where: { slug: customSlug } });
            const existingRedis = await redis.get(`slug:${customSlug}`);

            if (existingDb || existingRedis) {
                return { error: 'That custom alias is already taken. Choose another.' };
            }
        } else {
            finalSlug = nanoid(6);
        }

        // Database Persistence (User Links)
        const newLink = await db.link.create({
            data: {
                slug: finalSlug!,
                originalUrl: originalUrl,
                cleanedUrl: cleanedUrl,
                userId: locals.user.id
            }
        });

        // Redis Persistence
        const redisKey = `slug:${finalSlug}`;
        if (expirationDays && expirationDays !== 'never') {
            const ttlSeconds = parseInt(expirationDays, 10) * 24 * 60 * 60;
            await redis.set(redisKey, cleanedUrl, { ex: ttlSeconds });
        } else {
            // Persistent link for users by default
            await redis.set(redisKey, cleanedUrl);
        }

        return {
            success: true,
            newLink: newLink,
            shortlink: `${(new URL(request.url)).origin}/${finalSlug}`
        };
    }
};
