import nodemailer from 'nodemailer';
import { env } from '$env/dynamic/private';

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: parseInt(env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
    },
});

export async function sendOTPEmail(email: string, code: string) {
    const html = `
        <div style="font-family: monospace; background-color: #000; color: #0f0; padding: 20px; border: 1px solid #0f0;">
            <h1 style="border-bottom: 2px solid #0f0; padding-bottom: 10px;">[ NOTRACER_AUTH ]</h1>
            <p style="letter-spacing: 2px;">YOUR_ACCESS_CODE_IS:</p>
            <div style="font-size: 32px; font-weight: bold; padding: 20px 0; text-align: center; background: #111;">
                ${code}
            </div>
            <p style="font-size: 12px; color: #555;">// THIS CODE EXPIRES IN 10 MINUTES.</p>
            <p style="font-size: 12px; color: #555;">// NO LOGS. NO TRACES. NO WORRIES.</p>
        </div>
    `;

    await transporter.sendMail({
        from: '"NoTracer Security" <' + env.SMTP_USER + '>',
        to: email,
        subject: '[NOTRACER] Access Code: ' + code,
        html,
    });
}
