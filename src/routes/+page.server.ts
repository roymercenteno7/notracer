import { redis } from '$lib/server/redis';
import { posts } from '$lib/data/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    let viewCount = 0;
    try {
        viewCount = await redis.incr('notracer:pageviews:home');
    } catch (e) {
        console.error('[REDIS] Failed to increment view counter', e);
    }

    const recentPosts = posts.slice(0, 3);

    return { viewCount, recentPosts };
};
