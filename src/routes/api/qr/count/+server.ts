import { redis } from '$lib/server/redis';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
    try {
        const count = await redis.get('notracer:qr:generated') || '0';
        return new Response(count.toString(), {
            headers: { 'Content-Type': 'text/plain' }
        });
    } catch {
        return new Response('0', { status: 500 });
    }
};

export const POST: RequestHandler = async () => {
    try {
        await redis.incr('notracer:qr:generated');
        return new Response('ok');
    } catch {
        return new Response('error', { status: 500 });
    }
};