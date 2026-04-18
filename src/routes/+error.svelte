<script lang="ts">
    import { page } from '$app/stores';
    import { i18n } from '$lib/i18n';
    import { onMount } from 'svelte';
    import { Terminal, AlertTriangle, Wifi, WifiOff } from 'lucide-svelte';
    
    let t = $derived((path: string) => i18n.t(path));
    let is404 = $derived($page.status === 404);
    
    let glitchActive = $state(false);
    let currentTime = $state('');
    
    onMount(() => {
        const updateTime = () => {
            const now = new Date();
            currentTime = now.toISOString().replace('T', ' ').substring(0, 23) + ' UTC';
        };
        updateTime();
        
        glitchActive = true;
        setTimeout(() => glitchActive = false, 500);
        
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    });
</script>

<svelte:head>
    <title>{is404 ? '404' : $page.status} | NoTracer</title>
</svelte:head>

<div class="w-full min-h-[80vh] flex flex-col items-center justify-center font-mono text-gray-500 py-12 px-4">
    
    <!-- Terminal Container -->
    <div class="relative w-full max-w-3xl">
        
        <!-- Header Bar -->
        <div class="flex items-center justify-between border border-gray-800 border-b-0 bg-black px-4 py-2 text-[10px] tracking-widest">
            <div class="flex items-center gap-4">
                <span class="text-red-500">●</span>
                <span class="text-gray-600">notracer@edge</span>
                <span class="text-gray-800">|</span>
                <span class="text-neon/60">{currentTime}</span>
            </div>
            <div class="flex items-center gap-2">
                <span class="{is404 ? 'text-red-400' : 'text-yellow-400'} uppercase">
                    {is404 ? 'NODE_NOT_FOUND' : 'SYSTEM_ERROR'}
                </span>
            </div>
        </div>
        
        <!-- Main Error Box -->
        <div class="border border-gray-800 bg-[#050505] relative overflow-hidden">
            
            <!-- Scanline Effect -->
            <div class="absolute inset-0 pointer-events-none">
                <div class="absolute inset-0 bg-gradient-to-b from-transparent via-neon/[0.02] to-transparent h-20 w-full animate-[scanDown_3s_linear_infinite]"></div>
            </div>
            
            <!-- Glitch Effect on 404 -->
            {#if glitchActive && is404}
                <div class="absolute inset-0 bg-red-500/20 mix-blend-screen animate-pulse"></div>
            {/if}
            
            <div class="relative z-10 p-8 md:p-12">
                
                <!-- Error Code Display -->
                <div class="text-center mb-8">
                    <div class="inline-block relative">
                        {#if is404}
                            <h1 class="text-8xl md:text-[10rem] font-black text-neon tracking-tighter leading-none animate-pulse" 
                                style="text-shadow: 0 0 40px rgba(0, 255, 65, 0.4), 0 0 80px rgba(0, 255, 65, 0.2);">
                                404
                            </h1>
                            <div class="absolute -inset-4 border border-neon/30 animate-ping"></div>
                        {:else}
                            <h1 class="text-8xl md:text-[10rem] font-black text-red-500 tracking-tighter" 
                                style="text-shadow: 0 0 40px rgba(255, 0, 0, 0.4);">
                                {$page.status}
                            </h1>
                        {/if}
                    </div>
                    
                    <h2 class="text-sm md:text-base text-gray-300 font-bold uppercase tracking-[0.3em] mt-6">
                        [ {is404 ? t('error_page.404_title') : $page.error?.message || 'SYSTEM_FAILURE'} ]<span class="animate-pulse">_</span>
                    </h2>
                </div>
                
                <!-- Error Message -->
                <div class="text-center mb-8">
                    {#if is404}
                        <p class="text-gray-500 text-sm md:text-base leading-relaxed">
                            // {t('error_page.404_subtitle')}
                        </p>
                        <p class="text-gray-600 text-xs mt-3">
                            {t('error_page.404_suggestion')}
                        </p>
                    {:else}
                        <p class="text-gray-500 text-sm md:text-base leading-relaxed">
                            // {t('error_page.subtitle_generic')}
                        </p>
                    {/if}
                </div>
                
                <!-- Network Stats (404 specific) -->
                {#if is404}
                    <div class="border border-gray-900 bg-black/50 p-4 mb-8 text-[10px] md:text-xs tracking-widest">
                        <div class="flex items-center gap-2 text-neon mb-3">
                            <Terminal size={12} />
                            <span>{t('error_page.404_stats_title')}</span>
                        </div>
                        
                        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-gray-500">
                            <div class="flex flex-col gap-1">
                                <span class="text-gray-600">{t('error_page.404_latency')}</span>
                                <span class="text-red-400 font-mono">∞ MS</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="text-gray-600">{t('error_page.404_hops')}</span>
                                <span class="text-red-400 font-mono">DROP</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="text-gray-600">{t('error_page.404_packet_loss')}</span>
                                <span class="text-red-400 font-mono">100%</span>
                            </div>
                            <div class="flex flex-col gap-1">
                                <span class="text-gray-600">{t('error_page.404_status')}</span>
                                <span class="text-red-400 font-mono flex items-center gap-1">
                                    <WifiOff size={10} />
                                    {t('error_page.404_reachable')}
                                </span>
                            </div>
                        </div>
                    </div>
                {/if}
                
                <!-- Action Button -->
                <div class="flex justify-center">
                    <a href="/" class="group relative {is404 ? 'border-neon/50 text-neon hover:bg-neon hover:text-black' : 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-black'} transition-all px-8 md:px-12 py-4 text-xs md:text-sm tracking-widest font-bold uppercase overflow-hidden">
                        <span class="relative z-10 flex items-center gap-2">
                            <span>></span>
                            <span>{t('error_page.btn_abort')}</span>
                        </span>
                        <div class="absolute inset-0 {is404 ? 'bg-neon' : 'bg-red-500'} translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </a>
                </div>
            </div>
            
            <!-- Bottom Terminal Line -->
            <div class="border-t border-gray-900 px-4 py-2 text-[10px] text-gray-700 flex items-center gap-2">
                <span class="text-neon">></span>
                <span class="text-gray-500">{t('error_page.target_uri')}</span>
                <span class="text-gray-400">{$page.url.pathname}</span>
                <span class="text-gray-800 mx-2">|</span>
                <span class="{is404 ? 'text-red-500' : 'text-yellow-500'} animate-pulse">
                    {is404 ? t('error_page.404_glitch') : t('error_page.fatal')}
                </span>
            </div>
        </div>
        
        <!-- Quick Links -->
        <div class="mt-6 text-center text-[10px] md:text-xs text-gray-600 tracking-widest flex flex-wrap justify-center gap-4 md:gap-8">
            <a href="/" class="hover:text-neon transition-colors">[ HOME ]</a>
            <a href="/link" class="hover:text-neon transition-colors">[ LINK_PURGER ]</a>
            <a href="/about" class="hover:text-neon transition-colors">[ ABOUT ]</a>
            <a href="/blog" class="hover:text-neon transition-colors">[ BULLETINS ]</a>
        </div>
    </div>
</div>

<style>
    @keyframes scanDown {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(calc(100vh + 100%)); }
    }
    
    :global(.text-neon) {
        color: #00FF41;
    }
</style>
