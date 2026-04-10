import type { RequestHandler } from './$types';

const TEST_SIZES = [1024 * 1024, 2 * 1024 * 1024, 5 * 1024 * 1024];

export const GET: RequestHandler = async () => {
    const size = TEST_SIZES[Math.floor(Math.random() * TEST_SIZES.length)];
    const data = Buffer.alloc(size);
    
    return new Response(data, {
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': size.toString(),
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache'
        }
    });
};
