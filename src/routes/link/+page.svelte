<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';
	import { onMount } from 'svelte';
	import WelcomeModal from '$lib/components/WelcomeModal.svelte';
	import { i18n } from '$lib/i18n';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();

	let inputEl: HTMLInputElement | undefined = $state();
	let loading = $state(false);

	const t = (path: string) => i18n.t(path);

	// Zero-Friction: Paste auto-submit
	onMount(() => {
		inputEl?.focus();
	});

	function handlePaste(e: ClipboardEvent) {
		const pastedText = e.clipboardData?.getData('text');
		if (pastedText && (pastedText.startsWith('http://') || pastedText.startsWith('https://'))) {
			// Auto-submit after briefly showing the url
			setTimeout(() => {
				if (inputEl?.form) inputEl.form.requestSubmit();
			}, 100);
		}
	}
</script>

<svelte:head>
 	<title>Link Purger | NoTracer - Remove URL Trackers</title>
 	<meta name="description" content="Strip tracking parameters from any URL. Remove UTM, fbclid, gclid, and 50+ trackers. Share clean links with zero metadata leakage." />
 	<meta property="og:title" content="Link Purger | NoTracer" />
 	<meta property="og:description" content="Strip tracking parameters from any URL. Remove UTM, fbclid, gclid, and 50+ trackers." />
 	<meta property="og:url" content="https://notracer.com/link" />
 	<meta name="twitter:title" content="Link Purger | NoTracer" />
 	<meta name="twitter:description" content="Remove URL trackers. Strip UTM, fbclid, gclid." />
 	<meta name="twitter:card" content="summary_large_image" />
 	<link rel="canonical" href="https://notracer.com/link" />
 	<script type="application/ld+json">
 		{
 			"@context": "https://schema.org",
 			"@type": "WebApplication",
 			"name": "NoTracer Link Purger",
 			"url": "https://notracer.com/link",
 			"description": "Strip tracking parameters from any URL. Remove UTM, fbclid, gclid, and 50+ trackers.",
 			"applicationCategory": "UtilitiesApplication",
 			"operatingSystem": "All"
 		}
 	</script>
 </svelte:head>

<div class="absolute top-4 right-4 border border-neon text-neon font-mono text-xs px-3 py-1 bg-black/80 backdrop-blur-sm z-50 shadow-[0_0_10px_rgba(0,255,65,0.2)]">
	[ {t('nav.status_beta')} ]
</div>

<div class="w-full flex-col flex items-center gap-12">
	<div class="text-center space-y-4">
		<div class="text-6xl md:text-8xl font-black text-neon animate-pulse tracking-tighter">
			{form?.newTotal || data.totalCleaned || 0}
		</div>
		<p class="text-gray-500 tracking-widest text-sm uppercase">{t('home.hero_stat')}</p>
	</div>

	<form 
		method="POST" 
		action="?/process"
		class="w-full max-w-xl group relative"
		use:enhance={() => {
			loading = true;
			return async ({ update }) => {
				loading = false;
				await update();
			};
		}}
	>
		<div class="absolute -inset-0.5 bg-neon opacity-20 group-hover:opacity-40 blur transition duration-500 rounded-lg"></div>
		<div class="relative flex items-center border border-gray-800 bg-black rounded-lg overflow-hidden focus-within:border-neon focus-within:ring-1 focus-within:ring-neon transition-colors">
			<span class="pl-4 text-neon font-bold {loading ? 'animate-pulse' : ''}">&gt;</span>
			<input 
				bind:this={inputEl}
				type="url" 
				name="url" 
				required 
				placeholder={t('home.input_placeholder')}
				onpaste={handlePaste}
				value={form?.original || ''}
				class="w-full bg-transparent text-gray-200 placeholder-gray-600 px-4 py-4 md:py-5 outline-none font-mono"
				autocomplete="off"
				spellcheck="false"
			/>
			{#if loading}
				<div class="pr-4 text-neon">
					<span class="animate-spin inline-block font-mono">|</span>
				</div>
			{:else}
				<button type="submit" class="bg-gray-900 hover:bg-neon hover:text-black text-neon transition-colors font-bold px-6 py-4 md:py-5 border-l border-gray-800">
					{t('home.btn_clean')}
				</button>
			{/if}
		</div>
		
		{#if data.user}
		<div class="mt-4 flex items-center bg-gray-900/50 border border-gray-800 rounded px-4 py-2 focus-within:border-neon focus-within:ring-1 focus-within:ring-neon transition-colors">
			<span class="text-gray-500 font-mono text-sm pr-2 border-r border-gray-800">notracer.com/</span>
			<input 
				type="text" 
				name="customSlug" 
				placeholder={t('home.custom_alias')} 
				pattern="[a-zA-Z0-9_-]+"
				class="w-full bg-transparent text-gray-300 placeholder-gray-600 px-3 outline-none font-mono text-sm"
				autocomplete="off"
				spellcheck="false"
			/>
		</div>
		{:else}
		<div class="mt-4 text-center">
			<p class="text-[10px] text-gray-700 font-mono uppercase tracking-widest">
				{t('home.auth_prompt')}
			</p>
		</div>
		{/if}
	</form>

	{#if form?.error}
		<div class="text-red-500 border border-red-900 bg-red-950/30 px-6 py-4 rounded font-mono text-center w-full max-w-xl">
			[ERROR] {form.error}
		</div>
	{/if}

	{#if form?.success}
		<div class="w-full max-w-xl space-y-6">
			<!-- Cleaned URL -->
			<div class="space-y-2">
				<p class="text-xs text-gray-500 uppercase tracking-widest">{t('home.result_dest')}</p>
				<div class="border border-gray-800 bg-gray-900/50 p-4 rounded-lg break-all">
					<a href={form.cleaned} target="_blank" rel="noopener noreferrer" class="text-gray-300 hover:text-neon transition-colors">
						{form.cleaned}
					</a>
				</div>
			</div>

			<!-- Short URL -->
			<div class="space-y-2">
				<p class="text-xs text-neon uppercase tracking-widest flex items-center gap-2">
					<span class="w-2 h-2 rounded-full bg-neon animate-pulse hidden sm:inline-block"></span>
					{t('home.result_short')}
				</p>
				<div class="border border-neon/50 bg-neon/5 p-4 rounded-lg flex items-center justify-between gap-4">
					<a href={form.shortlink} target="_blank" class="text-neon font-bold text-lg hover:underline truncate">
						{form.shortlink}
					</a>
					<!-- svelte-ignore a11y_click_events_have_key_events -->
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div 
						onclick={() => navigator.clipboard.writeText(form?.shortlink || '')}
						class="text-xs bg-neon text-black px-3 py-2 font-bold hover:bg-white transition-colors uppercase rounded-sm whitespace-nowrap cursor-pointer"
					>
						{t('home.copy')}
					</div>
				</div>
			</div>

			<!-- Removed Trackers -->
			{#if form?.removed && form.removed.length > 0}
				<div class="space-y-2 pt-2">
					<p class="text-xs text-red-500 uppercase tracking-widest flex items-center gap-2">
						<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
						{t('home.result_garbage')}
					</p>
					<ul class="flex flex-wrap gap-2">
						{#each form.removed as tracker}
							<li class="bg-red-950/40 text-red-400 border border-red-900/50 px-3 py-1 text-xs rounded-sm font-mono flex items-center gap-1">
								<span class="opacity-50">-</span>
								{tracker}
							</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</div>

<WelcomeModal />
