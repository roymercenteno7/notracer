import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/server/db';
import { cleanUrl } from '$lib/server/cleaner';
import { redis } from '$lib/server/redis';
import { nanoid } from 'nanoid';

export const config = {
    runtime: 'nodejs20.x'
};

export const POST: RequestHandler = async ({ request, locals }) => {
    // 1. Auth Check (The extension must be on the same domain or have session cookies)
    if (!locals.user) {
        return json({ error: 'Unauthorized. Please login to notracer.com' }, { status: 401 });
    }

    try {
        const { url, customSlug } = await request.json();

        if (!url) {
            return json({ error: 'URL is required' }, { status: 400 });
        }

        // 2. Clean Link
        const { url: cleanedUrl } = cleanUrl(url);
        const finalSlug = customSlug || nanoid(6);

        // 3. Save to DB
        const newLink = await db.link.create({
            data: {
                slug: finalSlug,
                originalUrl: url,
                cleanedUrl: cleanedUrl,
                userId: locals.user.id
            }
        });

        // 4. Save to Redis (Unified Keys)
        await redis.set(`notracer:link:${finalSlug}`, cleanedUrl);

        return json({
            success: true,
            slug: finalSlug,
            cleanedUrl,
            shortlink: `${(new URL(request.url)).origin.replace('/api/links/create', '')}/${finalSlug}`
        });

    } catch (err: any) {
        console.error('[API_ERROR] Link creation failed:', err);
        return json({ error: 'Internal server error: ' + err.message }, { status: 500 });
    }
};
