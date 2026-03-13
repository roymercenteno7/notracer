import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { redis } from '$lib/server/redis';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, '/');
    }
};

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();

        if (!email || !password) {
            return fail(400, { email, error: 'Email and password are required' });
        }

        try {
            const user = await db.user.findUnique({ where: { email } });
            if (!user) {
                return fail(400, { email, error: 'Access denied: Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                return fail(400, { email, error: 'Access denied: Invalid credentials' });
            }

            // Create Redis Session
            const sessionId = nanoid(32);
            await redis.set(`notracer:session:${sessionId}`, user.id, { ex: 2592000 }); // 30 days

            // Issue cookie
            cookies.set('session', sessionId, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 2592000
            });

            throw redirect(302, '/');
        } catch (error: any) {
            if (error.status === 302) throw error; // Allow redirect to pass
            console.error('Login Error:', error);
            return fail(500, { email, error: 'Internal server error during login' });
        }
    }
} satisfies Actions;
