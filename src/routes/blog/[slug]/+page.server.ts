import { error } from '@sveltejs/kit';
import { posts } from '$lib/data/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const post = posts.find(p => p.slug === params.slug);

    if (!post) {
        throw error(404, 'BULLETIN_NOT_FOUND');
    }

    return {
        post
    };
};
