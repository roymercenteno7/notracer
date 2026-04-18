import { json } from '@sveltejs/kit';
import sharp from 'sharp';
import type { RequestHandler } from './$types';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png'];

function getFileExtension(filename: string): string {
    const lastDot = filename.lastIndexOf('.');
    return lastDot >= 0 ? filename.slice(lastDot).toLowerCase() : '';
}

function isValidImageType(mimeType: string, filename: string): boolean {
    // Verificar por MIME type o por extensión
    if (ALLOWED_TYPES.includes(mimeType)) return true;
    const ext = getFileExtension(filename);
    return ALLOWED_EXTENSIONS.includes(ext);
}

async function convertImage(file: File) {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const originalSize = buffer.length;

        console.log('[CONVERT] Processing:', file.name, 'Size:', originalSize, 'Type:', file.type);

        const webpBuffer = await sharp(buffer)
            .webp({ quality: 90 })
            .toBuffer();

        const convertedSize = webpBuffer.length;
        const savings = ((originalSize - convertedSize) / originalSize * 100).toFixed(1);

        // Obtener metadata
        const metadata = await sharp(buffer).metadata();

        const base64 = webpBuffer.toString('base64');
        const dataUrl = `data:image/webp;base64,${base64}`;

        console.log('[CONVERT] Success:', file.name, 'Original:', originalSize, 'Converted:', convertedSize, 'Savings:', savings + '%');

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
    } catch (err) {
        console.error('[CONVERT] Error processing', file.name, ':', err);
        throw err;
    }
}

// Forzar runtime Node.js (no Edge) porque Sharp requiere binaries nativos
export const config = {
	runtime: 'nodejs20.x'
};

export const POST: RequestHandler = async ({ request }) => {
    console.log('[CONVERT] Request received');

    try {
        const formData = await request.formData();
        const files = formData.getAll('images');

        console.log('[CONVERT] Files received:', files.length);

        // Manejar tanto File como cualquier objeto con name/size
        const validFiles = files.filter((f): f is File => {
            if (!f) return false;
            const file = f as unknown as { name?: string; size?: number; type?: string };
            const name = file.name;
            const size = file.size;
            const type = file.type;
            
            if (!name) return false;
            if (!type || !isValidImageType(type, name)) {
                console.log('[CONVERT] Invalid type:', type, 'for file:', name);
                return false;
            }
            if (!size || size > MAX_FILE_SIZE) {
                console.log('[CONVERT] Invalid size:', size, 'for file:', name);
                return false;
            }
            return true;
        });

        console.log('[CONVERT] Valid files:', validFiles.length);

        if (validFiles.length === 0) {
            return json({ 
                error: 'No valid images found. Only JPEG and PNG under 10MB are supported.' 
            }, { status: 400 });
        }

        const isBatch = validFiles.length > 1;
        
        // Procesar archivos en paralelo
        const results = await Promise.all(validFiles.map(convertImage));

        console.log('[CONVERT] Processing complete, results:', results.length);

        return json({
            success: true,
            isBatch,
            results
        });

    } catch (err) {
        console.error('[CONVERT] Fatal error:', err);
        return json({ error: 'Failed to process images: ' + String(err) }, { status: 500 });
    }
};
