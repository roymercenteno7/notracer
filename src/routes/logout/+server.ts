import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { redis } from '$lib/server/redis';

export const POST: RequestHandler = async ({ cookies }) => {
    const sessionId = cookies.get('session');
    if (sessionId) {
        await redis.del(`notracer:session:${sessionId}`);
        cookies.delete('session', { path: '/' });
    }
    throw redirect(302, '/');
};

export const GET: RequestHandler = async ({ cookies }) => {
    const sessionId = cookies.get('session');
    if (sessionId) {
        await redis.del(`notracer:session:${sessionId}`);
        cookies.delete('session', { path: '/' });
    }
    throw redirect(302, '/');
};
