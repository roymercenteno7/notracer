import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { redis } from '$lib/server/redis';
import { db } from '$lib/server/db';
import { cleanUrl } from '$lib/server/cleaner';
import { nanoid } from 'nanoid';

// Provide global counter on initial load
export const load: PageServerLoad = async () => {
    const totalCleaned = await redis.get<number>('notracer:total_cleaned');
    return {
        totalCleaned: totalCleaned || 0
    };
};

export const actions = {
    process: async ({ request, url, locals }) => {
        const data = await request.formData();
        const targetUrl = data.get('url')?.toString();
        const customSlug = data.get('customSlug')?.toString()?.trim();

        if (!targetUrl) {
            return fail(400, { error: 'URL is required', success: false });
        }

        try {
            // 1. Clean the URL
            const { url: cleanedUrl, removed } = cleanUrl(targetUrl);

            // 2. Generate short slug
            let slug = nanoid(7);

            if (locals.user && customSlug) {
                // Ensure valid slug format
                if (!/^[a-zA-Z0-9-_]+$/.test(customSlug)) {
                    return fail(400, { error: 'Invalid custom slug format', success: false });
                }
                const existing = await redis.get(`notracer:link:${customSlug}`);
                if (existing) {
                    return fail(400, { error: 'Custom slug already in use', success: false });
                }
                slug = customSlug;
            }

            // 3. Save to Redis
            if (locals.user) {
                // Persistent links for logged in users
                await redis.set(`notracer:link:${slug}`, cleanedUrl);
            } else {
                // 48 hours expiration for anonymous users
                await redis.set(`notracer:link:${slug}`, cleanedUrl, { ex: 172800 });
            }

            if (locals.user) {
                // Persist link for registered users
                await db.link.create({
                    data: {
                        slug,
                        originalUrl: targetUrl,
                        cleanedUrl,
                        userId: locals.user.id
                    }
                });
            }

            // 4. Increment global counter atomically
            const newTotal = await redis.incr('notracer:total_cleaned');

            // Return the generated slug and the absolute shortlink
            const shortlink = `${url.origin}/${slug}`;

            return {
                success: true,
                original: targetUrl,
                cleaned: cleanedUrl,
                slug,
                shortlink,
                newTotal,
                removed
            };
        } catch (error: any) {
            return fail(400, { error: error.message || 'Failed to process URL', success: false });
        }
    }
} satisfies Actions;
