import type { Handle } from '@sveltejs/kit';
import { redis } from '$lib/server/redis';
import { db } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('session');

    if (sessionId) {
        try {
            const userId = await redis.get<string>(`notracer:session:${sessionId}`);
            if (userId) {
                console.log(`[SESSION_DEBUG] Valid userId found in Redis: ${userId}`);
                const user = await db.user.findUnique({ where: { id: userId } });
                if (user) {
                    console.log(`[SESSION_DEBUG] User found in DB: ${user.email}`);
                    event.locals.user = { id: user.id, email: user.email };
                } else {
                    console.warn(`[SESSION_DEBUG] UserId ${userId} not found in DB.`);
                    event.cookies.delete('session', { path: '/' });
                }
            } else {
                console.log(`[SESSION_DEBUG] Session ${sessionId} not found in Redis.`);
                event.cookies.delete('session', { path: '/' });
            }
        } catch (err) {
            console.error('[SESSION_DEBUG] Critical error during session validation:', err);
        }
    }

    // CORS Headers for Extension/API
    if (event.url.pathname.startsWith('/api/')) {
        if (event.request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
                    'Access-Control-Max-Age': '86400'
                }
            });
        }
    }

    const response = await resolve(event);

    if (event.url.pathname.startsWith('/api/')) {
        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    }

    return response;
};
