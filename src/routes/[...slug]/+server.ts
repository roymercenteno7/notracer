import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { redis } from '$lib/server/redis';
import { db } from '$lib/server/db';

export const GET: RequestHandler = async ({ params }) => {
    const slug = params.slug;

    if (slug) {
        let targetUrl = await redis.get<string>(`notracer:link:${slug}`);

        if (!targetUrl) {
            // Check Postgres for persistent links
            const dbLink = await db.link.findUnique({ where: { slug } });
            if (dbLink) {
                targetUrl = dbLink.cleanedUrl;
                // Repopulate cache (persistent link)
                await redis.set(`notracer:link:${slug}`, targetUrl);
            }
        }

        if (targetUrl) {
            // Transparent redirection to the clean URL
            throw redirect(301, targetUrl);
        }
    }

    // If no slug or link not found, send back to home
    throw redirect(302, '/');
};
