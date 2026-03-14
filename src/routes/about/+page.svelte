<script lang="ts">
	import FaqAccordion from './FaqAccordion.svelte';
	import { i18n } from '$lib/i18n';

	const t = (path: string) => i18n.t(path);
</script>

<svelte:head>
	<title>About | NoTracer</title>
</svelte:head>

<div class="w-full max-w-2xl mx-auto border border-neon/30 bg-black p-6 md:p-10 font-mono shadow-[0_0_15px_rgba(0,255,65,0.05)] rounded-sm">
	<h2 class="text-2xl font-bold text-neon mb-8 flex items-center gap-3">
		<span class="w-3 h-3 bg-neon rounded-full animate-pulse"></span>
		{t('about.title')}
	</h2>

	<div class="space-y-8 text-gray-300">
		<section>
			<h3 class="text-neon uppercase mb-3 border-b border-gray-800 pb-2 inline-block">{t('about.problem_title')}</h3>
			<p class="leading-relaxed">
				{t('about.problem_text')}
			</p>
		</section>

		<section>
			<h3 class="text-neon uppercase mb-3 border-b border-gray-800 pb-2 inline-block">{t('about.solution_title')}</h3>
			<p class="leading-relaxed">
				{t('about.solution_text')}
			</p>
		</section>

		<section>
			<h3 class="text-neon uppercase mb-3 border-b border-gray-800 pb-2 inline-block">{t('about.philosophy_title')}</h3>
			<p class="leading-relaxed mb-4">
				{t('about.philosophy_subtitle')}
			</p>
			<ul class="space-y-3 font-bold mb-6 bg-gray-900/30 p-4 border-l-2 border-neon">
				<li class="flex items-center gap-3"><span class="text-neon">></span> {t('about.no_logs')}</li>
				<li class="flex items-center gap-3"><span class="text-neon">></span> {t('about.no_ip')}</li>
				<li class="flex items-center gap-3"><span class="text-neon">></span> {t('about.no_analytics')}</li>
			</ul>
			<p class="leading-relaxed text-sm">
				{t('about.philosophy_footer')}
			</p>
		</section>

		<section class="border-t border-gray-800 pt-8">
			<h3 class="text-neon uppercase mb-4">{t('about.status_title')}</h3>
			<div class="inline-block bg-neon text-black font-bold px-4 py-2 mb-4 text-sm tracking-widest uppercase">
				{t('about.status_beta')}
			</div>
			<p class="leading-relaxed text-sm text-gray-400">
				{t('about.status_text')}
			</p>
		</section>

		<section class="border-t border-gray-800 pt-8 mt-8 mb-12">
			<h3 class="text-neon uppercase mb-4">{t('about.contact_title')}</h3>
			<ul class="space-y-4 font-mono text-sm md:text-base">
				<li class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
					<span class="text-gray-500 w-48">{t('about.support')}</span>
					<a href="mailto:hello@notracer.com" class="text-neon inline-block hover:bg-neon hover:text-black px-2 py-0.5 transition-colors">> hello@notracer.com</a>
				</li>
				<li class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
					<span class="text-gray-500 w-48">{t('about.legal')}</span>
					<a href="mailto:admin@notracer.com" class="text-neon inline-block hover:bg-neon hover:text-black px-2 py-0.5 transition-colors">> admin@notracer.com</a>
				</li>
			</ul>
		</section>

		<FaqAccordion />

		<div class="text-center pt-8 border-t border-gray-800/50 mt-12">
			<p class="text-neon uppercase tracking-widest font-bold">
				{t('about.slogan')}
			</p>
		</div>
	</div>
</div>

<div class="mt-12 text-center px-4">
	<a href="/" class="text-gray-500 hover:text-neon underline decoration-gray-800 hover:decoration-neon underline-offset-8 transition-colors text-sm uppercase tracking-widest">
		{t('about.return')}
	</a>
</div>
