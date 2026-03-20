<script lang="ts">
    import { page } from '$app/stores';
    import { i18n } from '$lib/i18n';
    
    let t = $derived((path: string) => i18n.t(path));
</script>

<svelte:head>
    <title>Error {$page.status} | NoTracer</title>
</svelte:head>

<div class="w-full flex flex-col items-center justify-center font-mono text-gray-500 py-12 px-4 text-center mt-4">
    
    <div class="border border-red-900 bg-[#050505] p-8 md:p-12 shadow-[0_0_30px_rgba(255,0,0,0.05)] max-w-2xl w-full relative overflow-hidden group">
        <!-- Cyber scanline effect across error box -->
        <div class="absolute -inset-1 bg-gradient-to-b from-transparent via-red-500/10 to-transparent h-full w-full opacity-30 transform -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite]"></div>

        <h1 class="text-7xl md:text-9xl font-black text-red-500 tracking-tighter mb-4 animate-pulse relative z-10" style="text-shadow: 0 0 20px rgba(255, 0, 0, 0.4);">
            {$page.status}
        </h1>
        
        <h2 class="text-xl md:text-2xl text-gray-300 font-bold uppercase tracking-widest mb-6 relative z-10">
            [ {$page.error?.message || 'SYSTEM_FAILURE'} ]_
        </h2>
        
        <p class="text-gray-500 text-sm md:text-base leading-relaxed mb-8 relative z-10">
            // {t('error_page.subtitle')}
        </p>

        <div class="flex justify-center relative z-10">
            <a href="/" class="border border-red-500/50 bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-black transition-colors font-bold uppercase tracking-widest px-8 md:px-12 py-4 text-xs md:text-sm">
                > {t('error_page.btn_abort')}
            </a>
        </div>
    </div>

    <!-- Error Diagnostics (Simulated terminal output) -->
    <div class="mt-8 text-[10px] md:text-xs text-gray-600 text-left max-w-2xl w-full space-y-1">
        <p>> {t('error_page.diagnostics')}</p>
        <p>> {t('error_page.target_uri')} {$page.url.pathname}</p>
        <p>> {t('error_page.error_code')} {$page.status}</p>
        <p class="text-red-500 animate-pulse">> {t('error_page.fatal')}</p>
    </div>
</div>

<style>
    @keyframes scan {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
    }
</style>
