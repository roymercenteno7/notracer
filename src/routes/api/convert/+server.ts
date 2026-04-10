import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import type { RequestHandler } from './$types';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];

async function convertImage(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const originalSize = buffer.length;

    const webpBuffer = await sharp(buffer).webp({ quality: 90 }).toBuffer();
    const convertedSize = webpBuffer.length;
    const savings = ((originalSize - convertedSize) / originalSize * 100).toFixed(1);
    const metadata = await sharp(buffer).metadata();

    const base64 = webpBuffer.toString('base64');
    const dataUrl = `data:image/webp;base64,${base64}`;

    return {
        original: {
            size: originalSize,
            width: metadata.width,
            height: metadata.height,
            type: file.type,
            name: file.name
        },
        converted: {
            size: convertedSize,
            dataUrl,
            format: 'webp'
        },
        savings: parseFloat(savings)
    };
}

export const POST: RequestHandler = async ({ request }) => {
    try {
        const formData = await request.formData();
        const files = formData.getAll('images') as File[];

        if (files.length === 0 || (files.length === 1 && !files[0].name)) {
            return json({ error: 'No images provided' }, { status: 400 });
        }

        const validFiles = files.filter(f => f.name && ALLOWED_TYPES.includes(f.type) && f.size <= MAX_FILE_SIZE);

        if (validFiles.length === 0) {
            return json({ error: 'No valid images found. Only JPEG and PNG under 10MB are supported.' }, { status: 400 });
        }

        const isBatch = validFiles.length > 1;
        const results = await Promise.all(validFiles.map(convertImage));

        return json({
            success: true,
            isBatch,
            results: isBatch ? results : results[0]
        });

    } catch (err) {
        console.error('[MEDIA_CONVERT] Error:', err);
        return json({ error: 'Failed to process images' }, { status: 500 });
    }
};
