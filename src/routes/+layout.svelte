<script lang="ts">
	import '../app.css';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Cookie, Ban } from 'lucide-svelte';
	import type { LayoutData } from './$types';
	let { children, data } = $props<{ children: any, data: LayoutData }>();

	const t = (path: string) => i18n.t(path);

	// Determine if we're on the landing page (which has its own custom terminal layout)
	let isLandingPage = $derived($page.url.pathname === '/');

	let showCookieModal = $state(false);

	onMount(() => {
		if (!localStorage.getItem('cookie_joke_seen')) {
			setTimeout(() => {
				showCookieModal = true;
			}, 1500);
		}
	});

	function closeCookieModal() {
		localStorage.setItem('cookie_joke_seen', 'true');
		showCookieModal = false;
	}
</script>

<svelte:head>
	<title>NoTracer | {t('about.slogan').replace('// ', '')}</title>
	<meta name="description" content={t('about.problem_text').substring(0, 160)} />
	<meta property="og:title" content="NoTracer | {t('about.slogan').replace('// ', '')}" />
	<meta property="og:description" content={t('about.problem_text').substring(0, 160)} />
	<meta name="twitter:title" content="NoTracer | {t('about.slogan').replace('// ', '')}" />
	<meta name="twitter:description" content={t('about.problem_text').substring(0, 160)} />
	<meta property="og:image" content="https://notracer.com/og-image.png" />
	<meta name="twitter:image" content="https://notracer.com/og-image.png" />
	<meta name="twitter:card" content="summary_large_image" />
</svelte:head>

<div class="min-h-screen w-full flex flex-col p-4 selection:bg-neon selection:text-black">
	<div class="w-full max-w-5xl mx-auto flex flex-col gap-8">
		{#if !isLandingPage}
		<header class="text-center space-y-4">
			<div class="flex justify-between items-start">
				<div class="w-10"></div> <!-- Spacer -->
				<div class="flex flex-col items-center">
					<h1 class="text-4xl md:text-6xl font-bold tracking-tighter text-neon uppercase border-b-2 border-neon pb-2 inline-block">
						<a href="/" class="hover:text-white transition-colors">NoTracer</a>
					</h1>
					<p class="text-gray-400 text-sm md:text-base tracking-widest uppercase mt-4">
						// Metadata Cleaner & Private Shortener
					</p>
				</div>
				<!-- Language Switcher -->
				<div class="flex gap-2">
					<button 
						onclick={() => i18n.setLang('en')} 
						class="text-[10px] font-mono {i18n.lang === 'en' ? 'text-neon border-b border-neon' : 'text-gray-600 hover:text-gray-400'} cursor-pointer"
					>EN</button>
					<button 
						onclick={() => i18n.setLang('es')} 
						class="text-[10px] font-mono {i18n.lang === 'es' ? 'text-neon border-b border-neon' : 'text-gray-600 hover:text-gray-400'} cursor-pointer"
					>ES</button>
				</div>
			</div>
			
			<nav class="flex gap-6 justify-center items-center py-4 border-y border-gray-900 mt-4">
				<a href="/" class="hover:text-neon transition-colors text-xs uppercase tracking-widest">Home</a>
				<a href="/blog" class="hover:text-neon transition-colors text-xs uppercase tracking-widest">{t('nav.blog')}</a>
				<a href="/link" class="hover:text-neon transition-colors text-xs uppercase tracking-widest">Link Purger</a>
				<a href="/media" class="hover:text-neon transition-colors text-xs uppercase tracking-widest">Media</a>
				<a href="/speedtest" class="hover:text-neon transition-colors text-xs uppercase tracking-widest">Speed Test</a>
				{#if data.user}
					<a href="/dashboard" class="text-neon hover:underline font-bold text-xs uppercase tracking-widest">{t('nav.dashboard')}</a>
					<form action="/logout" method="POST" class="inline">
						<button type="submit" class="hover:text-red-500 transition-colors text-xs uppercase tracking-widest cursor-pointer">{t('nav.logout')}</button>
					</form>
				{:else}
					<a href="/login" class="hover:text-neon transition-colors text-xs uppercase tracking-widest">{t('nav.login')}</a>
					<a href="/register" class="hover:text-neon transition-colors text-xs uppercase tracking-widest border border-neon px-2 py-1 rounded-sm">{t('nav.register')}</a>
				{/if}
				<a href="/about" class="hover:text-neon transition-colors text-xs uppercase tracking-widest">About</a>
			</nav>
		</header>
		{/if}
		
		<!-- Main Content -->
		<main class="flex-1 w-full flex flex-col items-center">
			{@render children()}
		</main>
		
		{#if !isLandingPage}
		<!-- Footer -->
		<footer class="mt-12 text-center text-xs text-gray-600 tracking-wider">
			<p>&copy; {new Date().getFullYear()} NoTracer.com</p>
			<p class="mt-1">Built for privacy. Zero logs policy.</p>
			<p class="mt-2 text-gray-700 font-mono">System notifications are sent via <span class="text-gray-500">noreply@notracer.com</span></p>
		</footer>
		{/if}
	</div>
</div>

{#if showCookieModal}
	<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-950/80 backdrop-blur-md animate-fade-in-up">
		<div class="relative w-full max-w-sm bg-black border border-neon p-6 shadow-[0_0_40px_rgba(0,255,65,0.15)] flex flex-col items-center text-center">
			
			<div class="relative mt-2 mb-6">
				<Cookie class="text-neon" size={48} />
				<Ban class="text-red-500 absolute -top-2 -right-2 opacity-90" size={56} strokeWidth={2.5} />
			</div>

			<h3 class="font-bold font-mono text-neon text-sm uppercase tracking-[0.2em] border-b border-neon/30 pb-3 mb-4 w-full">
				{t('cookie.title')}
			</h3>
			
			<p class="text-xs text-gray-400 leading-relaxed font-sans mb-8 px-2">
				{t('cookie.text')}
			</p>

			<button onclick={closeCookieModal} class="text-xs text-neon uppercase hover:bg-neon hover:text-black transition-all px-6 py-4 border border-neon w-full tracking-widest cursor-pointer font-bold font-mono">
				{t('cookie.btn')}
			</button>

		</div>
	</div>
{/if}

<style>
	@keyframes fadeInUp {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
	:global(.animate-fade-in-up) {
		animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}
</style>
