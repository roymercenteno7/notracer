import type { Handle } from '@sveltejs/kit';
import { redis } from '$lib/server/redis';
import { db } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('session');

    if (sessionId) {
        try {
            const userId = await redis.get<string>(`notracer:session:${sessionId}`);
            if (userId) {
                // Pass minimal user info to locals, or fetch full user
                event.locals.user = { id: userId };
            } else {
                // Invalid or expired session
                event.cookies.delete('session', { path: '/' });
            }
        } catch (err) {
            console.error('Session validation error:', err);
        }
    }

    return resolve(event);
};
