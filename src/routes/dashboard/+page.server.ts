import { redirect, error } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { cleanUrl } from '$lib/server/cleaner';
import { redis } from '$lib/server/redis';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    try {
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

        let linksWithStats: any[] = [];

        if (links.length > 0) {
            const pipeline = redis.pipeline();
            for (const link of links) {
                // Unified Key for clicks
                pipeline.get(`notracer:clicks:${link.slug}`);
            }
            const clickCounts = await pipeline.exec();

            linksWithStats = links.map((link, index) => {
                const countValue = clickCounts ? clickCounts[index] : 0;
                let clicks = 0;
                if (typeof countValue === 'string') {
                    clicks = parseInt(countValue, 10) || 0;
                } else if (typeof countValue === 'number') {
                    clicks = countValue;
                }

                return {
                    ...link,
                    clicks
                };
            });
        }

        return {
            user: locals.user,
            links: linksWithStats
        };
    } catch (err: any) {
        console.error('[DASHBOARD_ERROR]', err);
        // Fallback to empty list if something fails during stats mapping
        return {
            user: locals.user,
            links: []
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
        const expirationDays = data.get('expiration')?.toString();

        if (!originalUrl) {
            return { error: 'Destination URL is required.' };
        }

        try {
            new URL(originalUrl);
        } catch (e) {
            return { error: 'Invalid URL format.' };
        }

        const { url: cleanedUrl } = cleanUrl(originalUrl);

        let finalSlug = customSlug;
        if (customSlug) {
            if (!/^[a-zA-Z0-9\-_]+$/.test(customSlug)) {
                return { error: 'Custom alias invalid format.' };
            }
            const existingDb = await db.link.findUnique({ where: { slug: customSlug } });
            if (existingDb) {
                return { error: 'That custom alias is already taken.' };
            }
        } else {
            finalSlug = nanoid(6);
        }

        const newLink = await db.link.create({
            data: {
                slug: finalSlug!,
                originalUrl: originalUrl,
                cleanedUrl: cleanedUrl,
                userId: locals.user.id
            }
        });

        // Unified Redis Keys
        const redisKey = `notracer:link:${finalSlug}`;
        if (expirationDays && expirationDays !== 'never') {
            const ttlSeconds = parseInt(expirationDays, 10) * 24 * 60 * 60;
            await redis.set(redisKey, cleanedUrl, { ex: ttlSeconds });
        } else {
            await redis.set(redisKey, cleanedUrl);
        }

        return {
            success: true,
            newLink: newLink, // Crucial for UI Copy button
            shortlink: `${(new URL(request.url)).origin}/${finalSlug}`
        };
    }
};
