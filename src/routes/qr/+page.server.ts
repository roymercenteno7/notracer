import { db } from '$lib/server/db';
import { redis } from '$lib/server/redis';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    const userId = locals.user?.id;
    
    const qrCodes = userId 
        ? await db.qrCode.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        })
        : [];

    let totalGenerated = 0;
    try {
        const count = await redis.get('notracer:qr:generated');
        totalGenerated = parseInt(count?.toString() || '0');
    } catch (e) {
        console.error('[QR] Failed to get count', e);
    }

    return { qrCodes, user: locals.user ? { id: locals.user.id } : null, totalGenerated };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        const formData = await request.formData();
        const url = formData.get('url') as string;
        const name = formData.get('name') as string || 'Unnamed QR';

        if (!url) {
            return { error: 'URL is required' };
        }

        const userId = locals.user?.id;

        if (userId) {
            await db.qrCode.create({
                data: { url, name, userId }
            });
        }

        return { success: true };
    },

    delete: async ({ request, locals }) => {
        const formData = await request.formData();
        const id = formData.get('id') as string;
        const userId = locals.user?.id;

        if (userId && id) {
            await db.qrCode.deleteMany({
                where: { id, userId }
            });
        }

        return { success: true };
    }
};