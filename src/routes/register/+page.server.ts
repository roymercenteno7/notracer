import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import bcrypt from 'bcrypt';
import { env } from '$env/dynamic/public';
import { env as secretEnv } from '$env/dynamic/private';

export const load: PageServerLoad = async ({ locals }) => {
    // If the user is already logged in, redirect them
    if (locals.user) {
        throw redirect(302, '/');
    }

    return {
        isBetaOpen: env.PUBLIC_BETA_OPEN === 'true',
        turnstileKey: env.PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA'
    };
};

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email')?.toString();
        const password = data.get('password')?.toString();
        const turnstileToken = data.get('cf-turnstile-response')?.toString();

        if (env.PUBLIC_BETA_OPEN !== 'true') {
            return fail(403, { email, error: 'Public registration is currently offline.' });
        }

        if (!email || !password || password.length < 6) {
            return fail(400, { email, error: 'Invalid email or password (min 6 chars)' });
        }

        if (!turnstileToken) {
            return fail(400, { email, error: 'Security challenge failed. Please try again.' });
        }

        try {
            // Validate Turnstile Token
            const verifyReq = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    secret: secretEnv.TURNSTILE_SECRET_KEY || '1x0000000000000000000000000000000AA',
                    response: turnstileToken
                })
            });

            const verifyRes = await verifyReq.json();
            if (!verifyRes.success) {
                return fail(400, { email, error: 'Security challenge failed.' });
            }

            const existingUser = await db.user.findUnique({ where: { email } });
            if (existingUser) {
                return fail(400, { email, error: 'Email already registered' });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            await db.user.create({
                data: { email, passwordHash }
            });

            return { success: true, message: 'Account registered.' };
        } catch (error: any) {
            console.error('Registration Error:', error);
            return fail(500, { email, error: 'Internal server error during registration.' });
        }
    }
} satisfies Actions;
