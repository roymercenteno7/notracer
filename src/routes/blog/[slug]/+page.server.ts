import { error } from '@sveltejs/kit';
import { posts } from '$lib/data/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    let requestedLang: 'en' | 'es' = 'en';

    const post = posts.find((p) => {
        if (p.slug.en === params.slug) {
            requestedLang = 'en';
            return true;
        }
        if (p.slug.es === params.slug) {
            requestedLang = 'es';
            return true;
        }
        return false;
    });

    if (!post) {
        throw error(404, 'BULLETIN_NOT_FOUND');
    }

    return { post, requestedLang };
};
