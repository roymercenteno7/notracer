<script lang="ts">
	import FaqAccordion from './FaqAccordion.svelte';
</script>

<svelte:head>
	<title>About | NoTracer</title>
</svelte:head>

<div class="w-full max-w-2xl mx-auto border border-neon/30 bg-black p-6 md:p-10 font-mono shadow-[0_0_15px_rgba(0,255,65,0.05)] rounded-sm">
	<h2 class="text-2xl font-bold text-neon mb-8 flex items-center gap-3">
		<span class="w-3 h-3 bg-neon rounded-full animate-pulse"></span>
		[ ABOUT: NOTRACER ]
	</h2>

	<div class="space-y-8 text-gray-300">
		<section>
			<h3 class="text-neon uppercase mb-3 border-b border-gray-800 pb-2 inline-block">The Problem:</h3>
			<p class="leading-relaxed">
				Invisible commercial surveillance is the default state of the internet.
				Every time you copy a link, you are likely carrying digital fingerprints—hidden parameters like <span class="bg-gray-900 border border-red-900/50 text-red-400 px-1 py-0.5 text-xs rounded-sm">utm_source</span>, <span class="bg-gray-900 border border-red-900/50 text-red-400 px-1 py-0.5 text-xs rounded-sm">fbclid</span>, and <span class="bg-gray-900 border border-red-900/50 text-red-400 px-1 py-0.5 text-xs rounded-sm">gclid</span>. These microscopic trackers are engineered by corporations to map your movements, profile your behavior, and auction your attention across the web.
			</p>
		</section>

		<section>
			<h3 class="text-neon uppercase mb-3 border-b border-gray-800 pb-2 inline-block">The Solution:</h3>
			<p class="leading-relaxed">
				We strip them away. NoTracer was constructed as a direct, hostile response to the monetization of metadata. We intercept contaminated URLs, run them through a rigorous deep-clean engine, and return them sanitized.
			</p>
		</section>

		<section>
			<h3 class="text-neon uppercase mb-3 border-b border-gray-800 pb-2 inline-block">Zero-Knowledge Philosophy:</h3>
			<p class="leading-relaxed mb-4">
				We do not care who you are, where you are, or what you share.<br>
				Our technical commitment is absolute:
			</p>
			<ul class="space-y-3 font-bold mb-6 bg-gray-900/30 p-4 border-l-2 border-neon">
				<li class="flex items-center gap-3"><span class="text-neon">></span> NO LOGS.</li>
				<li class="flex items-center gap-3"><span class="text-neon">></span> NO IP TRACKING.</li>
				<li class="flex items-center gap-3"><span class="text-neon">></span> NO EXTENDED ANALYTICS.</li>
			</ul>
			<p class="leading-relaxed text-sm">
				The sanitization process is strictly volatile. Original contaminated URLs are never permanently stored except as ephemeral pointers in Redis. Cache data is automatically incinerated.
			</p>
		</section>

		<section class="border-t border-gray-800 pt-8">
			<h3 class="text-neon uppercase mb-4">System Status:</h3>
			<div class="inline-block bg-neon text-black font-bold px-4 py-2 mb-4 text-sm tracking-widest uppercase">
				[ ENGINEERING BETA ]
			</div>
			<p class="leading-relaxed text-sm text-gray-400">
				This platform serves as an open engineering initiative dedicated to building a cleaner, more ethical web infrastructure.
			</p>
		</section>

		<FaqAccordion />

		<div class="text-center pt-8 border-t border-gray-800/50 mt-12">
			<p class="text-neon uppercase tracking-widest font-bold">
				// SHARE THE CONTENT, NOT YOUR DATA.
			</p>
		</div>
	</div>
</div>

<div class="mt-12 text-center">
	<a href="/" class="text-gray-500 hover:text-neon underline decoration-gray-800 hover:decoration-neon underline-offset-8 transition-colors text-sm uppercase tracking-widest">
		[ Return to Terminal ]
	</a>
</div>
