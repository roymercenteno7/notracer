import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { PUBLIC_BETA, PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
import { env as secretEnv } from '$env/dynamic/private';
import { redis } from '$lib/server/redis';
import { sendOTPEmail } from '$lib/server/email';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ locals }) => {
    if (locals.user) {
        throw redirect(302, '/');
    }

    // Using a safe fallback if the site key isn't public yet
    return {
        isBetaOpen: PUBLIC_BETA === 'true',
        turnstileKey: PUBLIC_TURNSTILE_SITE_KEY
    };
};

export const actions = {
    sendCode: async ({ request }) => {
        const data = await request.formData();
        const email = data.get('email')?.toString()?.trim()?.toLowerCase();
        const turnstileToken = data.get('cf-turnstile-response')?.toString();

        if (PUBLIC_BETA !== 'true') {
            return fail(403, { email, error: 'Public registration is currently offline.' });
        }

        if (!email || !email.includes('@')) {
            return fail(400, { email, error: 'Invalid email address.' });
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

            // Generate 6-digit code
            const code = Math.floor(100000 + Math.random() * 900000).toString();

            // Store in Redis (10 min TTL)
            await redis.set(`notracer:otp:${email}`, code, { ex: 600 });

            // Send Email
            await sendOTPEmail(email, code);

            return { success: true, email, step: 'verify' };
        } catch (error: any) {
            console.error('OTP Request Error:', error);
            return fail(500, { email, error: 'Failed to send access code. Try again later.' });
        }
    },

    verifyCode: async ({ request, cookies }) => {
        const data = await request.formData();
        const email = data.get('email')?.toString()?.trim()?.toLowerCase();
        const code = data.get('code')?.toString()?.trim();

        if (!email || !code) {
            return fail(400, { email, error: 'Missing email or code.', step: 'verify' });
        }

        try {
            console.log(`[AUTH_DEBUG] Attempting verification for: ${email}`);
            const storedCode = await redis.get(`notracer:otp:${email}`);

            console.log(`[AUTH_DEBUG] Stored: "${storedCode}" | Received: "${code}"`);

            if (!storedCode || String(storedCode).trim() !== String(code).trim()) {
                console.warn(`[AUTH_DEBUG] Mismatch or Expired for ${email}`);
                return fail(400, { email, error: 'Invalid or expired access code.', step: 'verify' });
            }

            // Code is valid, remove it
            await redis.del(`notracer:otp:${email}`);

            // Find or Register User
            let user = await db.user.findUnique({ where: { email } });

            if (!user) {
                user = await db.user.create({
                    data: {
                        email,
                        passwordHash: null
                    }
                });
            }

            // Create Session
            const sessionId = nanoid(32);
            await redis.set(`notracer:session:${sessionId}`, user.id, { ex: 60 * 60 * 24 * 7 }); // 7 days

            cookies.set('session', sessionId, {
                path: '/',
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7
            });

            throw redirect(302, '/dashboard');
        } catch (error: any) {
            if (error.status === 302) throw error;
            console.error('OTP Verification Error:', error);
            return fail(500, { email, error: 'Verification failed. Try again.', step: 'verify' });
        }
    }
} satisfies Actions;
