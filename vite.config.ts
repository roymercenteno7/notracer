import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({ 
    plugins: [tailwindcss(), sveltekit()],
    ssr: {
        noExternal: ['lucide-svelte'],
        // Exclude Sharp from SSR bundling - use native version
        external: ['sharp']
    },
    optimizeDeps: {
        include: ['lucide-svelte'],
        // Don't pre-bundle sharp - use native binary
        exclude: ['sharp']
    }
});
