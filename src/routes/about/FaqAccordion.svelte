<script lang="ts">
	import { i18n } from '$lib/i18n';

	const t = (path: string) => i18n.t(path);

	let openIndex = $state(-1);

	let faqs = $derived([
		{
			q: t('faq.q1'),
			a: t('faq.a1'),
		},
		{
			q: t('faq.q2'),
			a: t('faq.a2'),
		},
		{
			q: t('faq.q3'),
			a: t('faq.a3'),
		},
		{
			q: t('faq.q4'),
			a: t('faq.a4'),
		},
		{
			q: t('faq.q5'),
			a: t('faq.a5'),
		}
	]);

	function toggle(index: number) {
		openIndex = openIndex === index ? -1 : index;
	}
</script>

<div class="mt-12 border-t border-gray-800 pt-8">
	<h3 class="text-neon uppercase mb-6 flex items-center gap-3 font-bold text-lg">
		<span class="w-2 h-4 bg-neon animate-pulse"></span>
		{t('faq.title')}
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
					<span class="font-bold text-gray-200 {openIndex === i ? 'text-neon' : ''} text-sm md:text-base pr-4">
						<span class="text-gray-600 mr-2">></span> {faq.q}
					</span>
					<span class="text-neon font-mono text-xl transition-transform duration-300 {openIndex === i ? 'rotate-45' : ''}">
						+
					</span>
				</div>
				
				{#if openIndex === i}
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
