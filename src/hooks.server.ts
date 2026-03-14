import type { Handle } from '@sveltejs/kit';
import { redis } from '$lib/server/redis';
import { db } from '$lib/server/db';

export const handle: Handle = async ({ event, resolve }) => {
    const sessionId = event.cookies.get('session');

    if (sessionId) {
        try {
            const userId = await redis.get<string>(`notracer:session:${sessionId}`);
            if (userId) {
                const user = await db.user.findUnique({ where: { id: userId } });
                if (user) {
                    event.locals.user = { id: user.id, email: user.email };
                } else {
                    event.cookies.delete('session', { path: '/' });
                }
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
