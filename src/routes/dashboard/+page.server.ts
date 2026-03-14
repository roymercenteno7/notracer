import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { db } from '$lib/server/db';
import { cleanUrl } from '$lib/server/cleaner';
import { redis } from '$lib/server/redis';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
    // Keep it minimal to isolate the 500
    if (!locals.user) {
        throw redirect(302, '/login');
    }

    return {
        user: locals.user,
        links: []
    };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user) {
            throw redirect(302, '/login');
        }

        const data = await request.formData();
        const originalUrl = data.get('url')?.toString() || '';
        let customSlug = data.get('customSlug')?.toString()?.trim();

        if (!originalUrl) return { error: 'URL required' };

        try {
            const { url: cleanedUrl } = cleanUrl(originalUrl);
            const finalSlug = customSlug || nanoid(6);

            await db.link.create({
                data: {
                    slug: finalSlug,
                    originalUrl,
                    cleanedUrl,
                    userId: locals.user.id
                }
            });

            await redis.set(`slug:${finalSlug}`, cleanedUrl);

            return { success: true, shortlink: `${(new URL(request.url)).origin}/${finalSlug}` };
        } catch (e: any) {
            return { error: 'Creation failed: ' + e.message };
        }
    }
};
