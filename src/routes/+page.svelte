<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { onMount } from 'svelte';
	import { Activity } from 'lucide-svelte';
	const t = (path: string) => i18n.t(path);

    let { data } = $props();
    let viewCount = $derived(data.viewCount || 0);
    let recentPosts = $derived(data.recentPosts || []);

    let currentTime = $state("");

    onMount(() => {
        const updateTime = () => {
            const now = new Date();
            currentTime = now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    });
</script>

<svelte:head>
	<title>NoTracer | {t('about.slogan').replace('// ', '')}</title>
	<meta name="description" content="{t('landing.subtitle').replace('// ', '')} {t('landing.m1_desc')}" />
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "NoTracer Suite",
			"url": "https://notracer.com",
			"description": "Herramientas de privacidad técnica. Elimina rastreadores de URLs, metadata de imágenes y asegura tus comunicaciones.",
			"applicationCategory": "UtilitiesApplication",
			"operatingSystem": "All",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			}
		}
	</script>
</svelte:head>

<!-- Outer Terminal Container -->
<div class="w-full h-full font-mono text-gray-500 bg-[#050505] min-h-screen text-sm -m-4">
    <div class="max-w-[1400px] mx-auto p-4 md:p-8 flex flex-col gap-12 pt-8">
        <!-- Top Status Bar -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center text-[10px] tracking-widest uppercase mb-4">
            <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-neon animate-pulse"></span>
                <span>{t('landing.sys_status')}</span>
            </div>
            <div class="flex items-center gap-6 mt-4 md:mt-0">
                <div class="flex items-center gap-4">
                    <a href="/login" class="hover:text-neon transition-colors">> {t('nav.login').toUpperCase()}</a>
                    <a href="/register" class="hover:text-neon transition-colors">> {t('nav.register').toUpperCase()}</a>
                </div>
                <span>{currentTime}</span>
                <button 
                    onclick={() => i18n.setLang(i18n.lang === 'en' ? 'es' : 'en')}
                    class="border border-gray-800 px-2 py-1 hover:text-white"
                >
                    [{i18n.lang.toUpperCase()}]
                </button>
            </div>
        </div>

        <!-- Huge Title Section -->
        <div class="mt-8 space-y-6">
            <h1 class="text-4xl sm:text-5xl md:text-8xl font-black text-neon tracking-tighter" style="text-shadow: 0 0 40px rgba(0, 255, 65, 0.5), 0 0 10px rgba(0,255,65, 0.3);">
                [ SYSTEM: NOTRACER_SUITE ]<span class="animate-pulse">_</span>
            </h1>
            <a href="https://github.com/ariroy/notracer" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 text-gray-600 hover:text-neon transition-colors mt-2">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.483A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
                </svg>
                <span class="text-sm tracking-widest">{t('landing.view_source')}</span>
            </a>
            <p class="text-gray-600 text-sm md:text-lg tracking-widest">
                {t('landing.subtitle')}
            </p>
        </div>

        <!-- System Stats Bar -->
        <div class="flex flex-col md:flex-row items-start md:items-center text-[10px] md:text-xs tracking-widest uppercase border-y border-gray-900 py-4 gap-4 md:gap-0 mt-8">
            <div class="bg-neon text-black font-bold px-4 py-1 mr-6 flex-shrink-0">
                {t('landing.feed')}
            </div>
            <div class="flex flex-wrap items-center gap-y-2 text-gray-600">
                <span class="mr-2">{t('landing.threats_neutralized')}</span>
                <span class="text-neon mr-4">{t('landing.sys_initialized')}</span>
                <span class="hidden md:inline mr-4 text-gray-800">|</span>
                
                <span class="mr-2">{t('landing.state')}</span>
                <span class="text-neon mr-4">{t('landing.operational')}</span>
                <span class="hidden md:inline mr-4 text-gray-800">|</span>
                
                <span class="mr-2">{t('landing.protocol')}</span>
                <span class="text-neon mr-4">{t('landing.zero_log')}</span>
                <span class="hidden md:inline mr-4 text-gray-800">|</span>
                
                <span class="mr-2">{t('landing.encryption')}</span>
                <span class="text-neon">AES-256</span>
            </div>
        </div>

        <!-- Modules Section -->
        <div class="mt-8">
            <div class="text-gray-600 text-[10px] md:text-xs tracking-widest uppercase mb-8">
                {t('landing.select_module')}
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <!-- CARD 1: LINK_PURGER -->
                <div class="border border-gray-800 border-t-neon bg-[#080808] p-6 flex flex-col hover:border-neon/50 transition-colors group">
                    <div class="flex justify-between items-center text-xs tracking-widest mb-6 text-gray-600">
                        <div class="flex items-center gap-2">
                            <span class="text-lg leading-none">⬡</span> M-01
                        </div>
                        <div class="flex items-center gap-2 text-neon">
                            <span class="w-1.5 h-1.5 rounded-full bg-neon"></span> {t('landing.operational')}
                        </div>
                    </div>
                    
                    <h2 class="text-xl md:text-2xl font-bold text-gray-100 tracking-wider mb-4 group-hover:text-white transition-colors">{t('landing.m1_title')}</h2>
                    
                    <p class="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                        {t('landing.m1_desc')}
                    </p>

                    <div class="flex justify-between items-center text-[10px] tracking-widest mb-6">
                        <div class="flex gap-2">
                            <span class="text-yellow-600 border border-yellow-900/50 px-2 py-0.5">{t('landing.active')}</span>
                            <span class="text-gray-300 border border-gray-600 px-2 py-0.5">{t('landing.easy')}</span>
                        </div>
                        <span class="text-gray-600">+100 XP</span>
                    </div>

                    <a href="/link" class="block w-full border border-neon/50 bg-neon/10 hover:border-neon hover:bg-neon/20 text-neon hover:text-neon text-center py-3 font-bold uppercase tracking-widest transition-all text-xs">
                        {t('landing.deploy_now')}
                    </a>
                </div>

                <!-- CARD 2: MEDIA_SHIFTER -->
                <div class="border border-gray-800 border-t-neon bg-[#080808] p-6 flex flex-col hover:border-neon/50 transition-colors group">
                    <div class="flex justify-between items-center text-xs tracking-widest mb-6 text-gray-600">
                        <div class="flex items-center gap-2">
                            <span class="text-lg leading-none">◈</span> M-02
                        </div>
                        <div class="flex items-center gap-2 text-neon">
                            <span class="w-1.5 h-1.5 rounded-full bg-neon"></span> {t('landing.operational')}
                        </div>
                    </div>
                    
                    <h2 class="text-xl md:text-2xl font-bold text-gray-100 tracking-wider mb-4 group-hover:text-white transition-colors">{t('landing.m2_title')}</h2>
                    
                    <p class="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                        {t('landing.m2_desc')}
                    </p>

                    <div class="flex justify-between items-center text-[10px] tracking-widest mb-6">
                        <div class="flex gap-2">
                            <span class="text-neon border border-green-900/50 px-2 py-0.5">{t('landing.active')}</span>
                            <span class="text-gray-300 border border-gray-600 px-2 py-0.5">{t('landing.medium')}</span>
                        </div>
                        <span class="text-gray-600">+250 XP</span>
                    </div>

                    <a href="/media" class="block w-full border border-neon/50 bg-neon/10 hover:border-neon hover:bg-neon/20 text-neon hover:text-neon text-center py-3 font-bold uppercase tracking-widest transition-all text-xs">
                        {t('landing.deploy_now')}
                    </a>
                </div>

<!-- CARD 3: GHOST_SEND -->
                <div class="border border-gray-900 bg-[#080808] p-6 flex flex-col opacity-60 pointer-events-none">
                    <div class="flex justify-between items-center text-xs tracking-widest mb-6 text-gray-700">
                        <div class="flex items-center gap-2">
                            <span class="text-lg leading-none">◉</span> M-03
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="w-1.5 h-1.5 rounded-full bg-gray-700"></span> {t('landing.blocked')}
                        </div>
                    </div>
                    
                    <h2 class="text-xl md:text-2xl font-bold text-gray-400 tracking-wider mb-4">{t('landing.m3_title')}</h2>
                    
                    <p class="text-gray-600 text-sm leading-relaxed mb-8 flex-1">
                        {t('landing.m3_desc')}
                    </p>

                    <div class="flex justify-between items-center text-[10px] tracking-widest mb-6">
                        <div class="flex gap-2">
                            <span class="text-yellow-700/50 border border-yellow-900/30 px-2 py-0.5">{t('landing.wip')}</span>
                            <span class="text-gray-600 border border-gray-800 px-2 py-0.5">{t('landing.hard')}</span>
                        </div>
                        <span class="text-gray-700">+500 XP</span>
                    </div>
                    
                    <div class="w-full border border-gray-900 bg-black text-gray-800 text-center py-3 font-bold uppercase tracking-widest text-xs">
                        {t('landing.access_denied')}
                    </div>
                </div>
            </div>
        </div>

<!-- CARD 4: SECURE_QR -->
                <div class="border border-gray-800 border-t-neon bg-[#080808] p-6 flex flex-col hover:border-neon/50 transition-colors group">
                    <div class="flex justify-between items-center text-xs tracking-widest mb-6 text-gray-600">
                        <div class="flex items-center gap-2">
                            <span class="text-lg leading-none">⬢</span> M-04
                        </div>
                        <div class="flex items-center gap-2 text-neon">
                            <span class="w-1.5 h-1.5 rounded-full bg-neon"></span> {t('landing.operational')}
                        </div>
                    </div>
                    
                    <h2 class="text-xl md:text-2xl font-bold text-gray-100 tracking-wider mb-4 group-hover:text-white transition-colors">{t('landing.m4_title')}</h2>
                    
                    <p class="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                        {t('landing.m4_desc')}
                    </p>
                    
                    <div class="flex justify-between items-center text-[10px] tracking-widest mb-6">
                        <div class="flex gap-2">
                            <span class="text-neon border border-green-900/50 px-2 py-0.5">{t('landing.active')}</span>
                            <span class="text-gray-300 border border-gray-600 px-2 py-0.5">{t('landing.easy')}</span>
                        </div>
                        <span class="text-gray-600">+100 XP</span>
                    </div>
                    
                    <a href="/qr" class="block w-full border border-neon/50 bg-neon/10 hover:border-neon hover:bg-neon/20 text-neon hover:text-neon text-center py-3 font-bold uppercase tracking-widest transition-all text-xs">
                        {t('landing.deploy_now')}
                    </a>
                </div>

                <!-- CARD 5: SPEED_TEST -->
                <div class="border border-gray-800 border-t-neon bg-[#080808] p-6 flex flex-col hover:border-neon/50 transition-colors group">
                    <div class="flex justify-between items-center text-xs tracking-widest mb-6 text-gray-600">
                        <div class="flex items-center gap-2">
                            <span class="text-lg leading-none">◎</span> M-05
                        </div>
                        <div class="flex items-center gap-2 text-neon">
                            <span class="w-1.5 h-1.5 rounded-full bg-neon"></span> {t('landing.operational')}
                        </div>
                    </div>
                    
                    <h2 class="text-xl md:text-2xl font-bold text-gray-100 tracking-wider mb-4 group-hover:text-white transition-colors">{t('landing.m5_title')}</h2>
                    
                    <p class="text-gray-500 text-sm leading-relaxed mb-8 flex-1">
                        {t('landing.m5_desc')}
                    </p>

                    <div class="flex justify-between items-center text-[10px] tracking-widest mb-6">
                        <div class="flex gap-2">
                            <span class="text-neon border border-green-900/50 px-2 py-0.5">{t('landing.active')}</span>
                            <span class="text-gray-300 border border-gray-600 px-2 py-0.5">{t('landing.easy')}</span>
                        </div>
                        <span class="text-gray-600">+150 XP</span>
                    </div>

                    <a href="/speedtest" class="block w-full border border-neon/50 bg-neon/10 hover:border-neon hover:bg-neon/20 text-neon hover:text-neon text-center py-3 font-bold uppercase tracking-widest transition-all text-xs">
                        {t('landing.deploy_now')}
                    </a>
                </div>
            </div>

        {#if recentPosts.length > 0}
        <!-- Latest Bulletins Section -->
        <div class="mt-8 border-t border-gray-900 pt-8">
            <h2 class="text-neon text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
                <span class="animate-pulse">●</span> {t('blog.latest')}
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each recentPosts as post}
                    <article class="border border-gray-900 p-4 hover:border-neon/30 transition-colors group flex flex-col justify-between" style="background: rgba(10, 10, 10, 0.4);">
                        <div>
                            <div class="text-[10px] text-gray-500 tracking-widest mb-2 border-b border-gray-900 pb-2">
                                {post.date}
                            </div>
                            <h3 class="text-gray-200 font-bold uppercase text-sm mb-3 group-hover:text-neon transition-colors">
                                {post.title[i18n.lang] || post.title['en']}
                            </h3>
                            <p class="text-xs text-gray-500 line-clamp-2">
                                {post.excerpt[i18n.lang] || post.excerpt['en']}
                            </p>
                        </div>
                        <a href="/blog/{post.slug[i18n.lang] || post.slug['en']}" class="mt-4 text-[10px] uppercase text-neon tracking-widest font-bold">
                            {t('blog.read')}
                        </a>
                    </article>
                {/each}
            </div>
        </div>
        {/if}

        <!-- Footer Section -->
        <div class="mt-16 border-t border-gray-900/50 pt-16">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <!-- Col 1: SOBRE_LA_RESISTENCIA -->
                <div class="flex flex-col gap-6">
                    <h3 class="text-neon tracking-widest text-xs">{t('landing.about_resistance')}</h3>
                    <p class="text-gray-600 text-[11px] leading-relaxed font-mono">
                        {t('landing.about_p1')}
                    </p>
                    <p class="text-gray-600 text-[11px] leading-relaxed font-mono">
                        {t('landing.about_p2')}
                    </p>
                    <div class="flex flex-wrap gap-4 mt-2 text-[9px] uppercase tracking-widest">
                        <span class="text-neon border border-green-900/40 bg-green-950/20 px-2 py-1">ZERO_LOGS</span>
                        <span class="text-neon border border-green-900/40 bg-green-950/20 px-2 py-1">NO_IP_TRACK</span>
                        <span class="text-neon border border-green-900/40 bg-green-950/20 px-2 py-1">STABLE_DEPLOYMENT</span>
                    </div>
                </div>

                <!-- Col 2: APOYA_LA_RESISTENCIA -->
                <div class="flex flex-col gap-6">
                    <h3 class="text-neon tracking-widest text-xs">{t('landing.support_resistance')}</h3>
                    <p class="text-gray-600 text-[11px] leading-relaxed font-mono">
                        {t('landing.support_p1')}
                    </p>
                </div>

                <!-- Col 3: CANAL_DE_COMUNICACIONES -->
                <div class="flex flex-col gap-6 md:pl-8 border-l-0 md:border-l border-gray-900/30">
                    <h3 class="text-neon tracking-widest text-xs">{t('landing.comms_channel')}</h3>
                    <div class="flex flex-col gap-4 text-[11px] font-mono">
                        <div>
                            <div class="text-gray-600 mb-1">{t('landing.support')}</div>
                            <a href="mailto:hello@notracer.com" class="text-neon hover:underline transition-colors">> hello@notracer.com</a>
                        </div>
                        <div>
                            <div class="text-gray-600 mb-1">{t('landing.legal')}</div>
                            <a href="mailto:admin@notracer.com" class="text-neon hover:underline transition-colors">> admin@notracer.com</a>
                        </div>
                        <div class="flex flex-wrap gap-4 mt-4 text-gray-600 tracking-widest uppercase text-[10px]">
                            <a href="/about" class="hover:text-neon transition-colors">ABOUT</a>
                            <a href="/blog" class="hover:text-neon transition-colors">{t('nav.blog')}</a>
                            <a href="/link" class="hover:text-neon transition-colors">LINK_PURGER</a>
                            <a href="/login" class="hover:text-neon transition-colors">LOGIN</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Absolute Bottom Bar -->
        <div class="mt-8 pt-6 pb-4 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-700 tracking-widest font-mono opacity-80 gap-4">
            <p class="order-2 md:order-1 text-center md:text-left">&copy; 2026 NoTracer.com — {t('about.slogan').replace('// ', '')}</p>
            
            <div class="order-1 md:order-2 flex items-center gap-2 border border-gray-900 bg-black px-3 py-1 text-neon/80" title="Total Protocol Validations">
                <Activity size={12} class="animate-pulse" />
                <span class="font-bold">{viewCount} {t('home.views')}</span>
            </div>

            <p class="order-3 md:order-3 text-center md:text-right">// SHARE THE CONTENT. NOT YOUR DATA.</p>
        </div>
    </div>
