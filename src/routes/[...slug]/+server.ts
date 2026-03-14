import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { redis } from '$lib/server/redis';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async ({ params }) => {
    const slug = params.slug;

    if (slug) {
        // Unified Prefix
        const redisKey = `notracer:link:${slug}`;
        const clickKey = `notracer:clicks:${slug}`;

        let targetUrl = await redis.get<string>(redisKey);

        if (!targetUrl) {
            // Check Postgres for persistent links
            const dbLink = await db.link.findUnique({ where: { slug } });
            if (dbLink) {
                targetUrl = dbLink.cleanedUrl;
                // Repopulate cache
                await redis.set(redisKey, targetUrl);
            }
        }

        if (targetUrl) {
            // Background Click Counter (Fire and forget)
            redis.incr(clickKey).catch(e => console.error('Stats incr error:', e));

            // Transparent redirection to the clean URL
            throw redirect(301, targetUrl);
        }
    }

    // If no slug or link not found, send back to home
    throw redirect(302, '/');
};
