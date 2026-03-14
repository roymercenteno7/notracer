import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { cleanUrl } from '$lib/server/cleaner';
import { redis } from '$lib/server/redis';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
    // Privacy Logic: Must be authenticated
    if (!locals.user) {
        throw redirect(302, '/login');
    }

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

    // Get click counts from Redis for each link
    // Using a pipeline for efficient batch fetching
    const pipeline = redis.pipeline();
    for (const link of links) {
        pipeline.get(`clicks:${link.slug}`);
    }
    const clickCounts = await pipeline.exec();

    // Combine link data with click counts
    try {
        const linksWithStats = links.map((link, index) => {
            const countValue = clickCounts[index];
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

        console.log(`[DASHBOARD_DEBUG] Returning ${linksWithStats.length} links for ${locals.user.email}`);

        return {
            user: locals.user,
            links: linksWithStats
        };
    } catch (e) {
        console.error('[DASHBOARD_DEBUG] Error mapping links:', e);
        return {
            user: locals.user,
            links: links.map(l => ({ ...l, clicks: 0 }))
        };
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
