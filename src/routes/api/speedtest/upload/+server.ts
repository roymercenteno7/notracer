import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const blob = await request.blob();
        const size = blob.size;
        
        return new Response(JSON.stringify({ received: size }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch {
        return new Response(JSON.stringify({ error: 'Failed to process upload' }), { status: 500 });
    }
};
