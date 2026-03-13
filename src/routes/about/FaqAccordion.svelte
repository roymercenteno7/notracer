<script lang="ts">
	let faqs = $state([
		{
			q: 'What exactly does NoTracer clean?',
			a: 'We strip commercial tracking strings (like <code>utm_campaign</code>, <code>fbclid</code>, <code>gclid</code>) from URLs without breaking the core destination. The link takes you exactly where you want to go, just without the digital fingerprints attached.',
			open: false
		},
		{
			q: 'Why is it free?',
			a: 'Because a cleaner internet belongs to everyone. This is a community-driven, open beta engineering project. We believe you should share the content, not your data, and nobody should pay a premium for basic privacy.',
			open: false
		},
		{
			q: 'How do I know you aren\'t tracking my clicks?',
			a: 'Our architecture is built on a Zero-Knowledge philosophy. We use SvelteKit and a volatile Redis cache with aggressive TTL (Time to Live) limits. Metadata is incinerated automatically. There are no databases storing your browsing history.',
			open: false
		},
		{
			q: 'Is it safe for banking or private links?',
			a: 'We only sanitize public URL metadata. NoTracer never touches encrypted content, credentials, or secure payloads. However, as an active beta, we recommend using it primarily for sanitizing social media and e-commerce links.',
			open: false
		},
		{
			q: 'What is the future of this Beta?',
			a: 'Aggressive tracking scripts from platforms like TikTok or Instagram evolve daily. We will continually update our Deep-Clean Engine patterns to counter new surveillance techniques, ensuring your links remain pristine.',
			open: false
		}
	]);

	function toggle(index: number) {
		faqs = faqs.map((faq, i) => ({
			...faq,
			open: i === index ? !faq.open : false // Close others, toggle current
		}));
	}
</script>

<div class="mt-12 border-t border-gray-800 pt-8">
	<h3 class="text-neon uppercase mb-6 flex items-center gap-3 font-bold text-lg">
		<span class="w-2 h-4 bg-neon animate-pulse"></span>
		[ FAQ / PROTOCOLS ]
	</h3>

	<div class="space-y-4">
		{#each faqs as faq, i}
			<div class="border border-gray-800/60 bg-black overflow-hidden transition-colors duration-300 hover:border-neon/50">
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div 
					class="w-full px-5 py-4 flex justify-between items-center cursor-pointer select-none"
					onclick={() => toggle(i)}
				>
					<span class="font-bold text-gray-200 {faq.open ? 'text-neon' : ''} text-sm md:text-base pr-4">
						<span class="text-gray-600 mr-2">></span> {faq.q}
					</span>
					<span class="text-neon font-mono text-xl transition-transform duration-300 {faq.open ? 'rotate-45' : ''}">
						+
					</span>
				</div>
				
				{#if faq.open}
					<div 
						class="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800/30 bg-gray-900/20"
					>
						<p class="pt-3">{@html faq.a}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
