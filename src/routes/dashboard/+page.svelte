<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData, ActionData } from './$types';

	let { data, form } = $props<{ data: PageData; form: ActionData }>();
	
	let loading = $state(false);
	
	// Copy to clipboard helper
	function copyLink(link: string | { slug: string }) {
		const textToCopy = typeof link === 'string' 
			? link 
			: `${window.location.origin}/${link.slug}`;
		
		navigator.clipboard.writeText(textToCopy);
	}
	
	// Format Date
	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			month: 'short', day: 'numeric', year: 'numeric'
		}).format(new Date(date));
	}
</script>

<svelte:head>
	<title>Dashboard | NoTracer</title>
</svelte:head>

<div class="w-full max-w-5xl mx-auto space-y-12">
	
	<!-- Header Section -->
	<header class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-gray-800 pb-6">
		<div>
			<h2 class="text-3xl font-bold text-neon flex items-center gap-3">
				<span class="w-3 h-3 bg-neon rounded-full animate-pulse hidden sm:block"></span>
				[ COMMAND CENTER ]
			</h2>
			<p class="text-gray-500 font-mono mt-2 text-sm">
				> Authenticated as: <span class="text-gray-300">{data?.user?.email || 'Unknown User'}</span>
			</p>
		</div>
		
		<div class="flex gap-4 font-mono text-sm">
			<div class="bg-gray-900 border border-gray-800 px-4 py-2 text-center rounded-sm">
				<div class="text-gray-500 uppercase text-xs mb-1">Active Relays</div>
				<div class="text-neon font-bold">{data?.links?.length || 0}</div>
			</div>
			
			<form action="/logout" method="POST">
				<button type="submit" class="border border-red-900/50 bg-red-950/20 text-red-500 hover:bg-red-900/40 hover:text-white px-4 py-2 transition-colors rounded-sm h-full flex flex-col justify-center items-center">
					<span class="uppercase text-xs tracking-widest">[ DISCONNECT ]</span>
				</button>
			</form>
		</div>
	</header>

	<!-- Create New Link Form -->
	<section class="border border-neon/30 bg-black p-6 md:p-8 rounded-sm shadow-[0_0_15px_rgba(0,255,65,0.05)]">
		<h3 class="text-neon uppercase mb-6 font-bold tracking-widest text-sm flex items-center gap-2">
			<span class="text-gray-600">></span> Execute New Sanitization
		</h3>
		
		<form 
			method="POST" 
			action="?/create"
			class="space-y-6"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			<div class="space-y-4">
				<!-- Target URL -->
				<div>
					<label for="url" class="block text-xs uppercase tracking-widest text-gray-500 mb-2">Target Payload (URL)</label>
					<div class="relative flex items-center border border-gray-800 bg-gray-900 focus-within:border-neon transition-colors rounded-sm overflow-hidden">
						<span class="pl-3 text-neon font-bold">></span>
						<input type="url" id="url" name="url" required placeholder="https://contaminated-site.com/item?utm_source=fb" class="w-full bg-transparent text-gray-200 px-3 py-3 outline-none font-mono text-sm" />
					</div>
				</div>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<!-- Custom Alias -->
					<div>
						<label for="customSlug" class="block text-xs uppercase tracking-widest text-gray-500 mb-2">Custom Alias (Optional)</label>
						<div class="relative flex items-center border border-gray-800 bg-gray-900 focus-within:border-neon transition-colors rounded-sm overflow-hidden">
							<span class="px-3 text-gray-500 border-r border-gray-800 font-mono text-sm bg-black">/</span>
							<input type="text" id="customSlug" name="customSlug" placeholder="my-secure-link" pattern="[a-zA-Z0-9_-]+" class="w-full bg-transparent text-gray-200 px-3 py-3 outline-none font-mono text-sm" />
						</div>
					</div>
					
					<!-- Expiration -->
					<div>
						<label for="expiration" class="block text-xs uppercase tracking-widest text-gray-500 mb-2">Time To Live (TTL)</label>
						<select id="expiration" name="expiration" class="w-full border border-gray-800 bg-gray-900 text-gray-200 px-3 py-3 outline-none font-mono text-sm rounded-sm focus:border-neon transition-colors appearance-none cursor-pointer">
							<option value="never">Persistent (Never Expire)</option>
							<option value="1">1 Day</option>
							<option value="7">7 Days</option>
							<option value="30">30 Days</option>
						</select>
					</div>
				</div>
			</div>

			{#if form?.error}
				<div class="text-red-500 border border-red-900 bg-red-950/30 px-4 py-3 rounded-sm font-mono text-sm">
					[SYSTEM ERROR] {form.error}
				</div>
			{/if}

			{#if form?.success}
				<div class="text-neon border border-neon/50 bg-neon/10 px-4 py-3 rounded-sm font-mono flex items-center justify-between text-sm break-all gap-4">
					<div>
						<span class="font-bold mr-2">[SUCCESS]</span> 
						Link generated: <a href={form.shortlink} target="_blank" class="underline hover:text-white transition-colors">{form.shortlink}</a>
					</div>
					<button type="button" onclick={() => copyLink(form.newLink?.slug || '')} class="bg-neon text-black px-2 py-1 font-bold text-xs hover:bg-white uppercase whitespace-nowrap">
						Copy
					</button>
				</div>
			{/if}

			<button type="submit" disabled={loading} class="w-full bg-neon text-black hover:bg-white font-bold px-6 py-4 transition-colors rounded-sm flex items-center justify-center gap-2">
				{#if loading}
					<span class="animate-spin font-mono text-lg leading-none">|</span> EXECUTING...
				{:else}
					GENERATE SECURE LINK
				{/if}
			</button>
		</form>
	</section>

	<!-- Links Data Table -->
	<section>
		<h3 class="text-neon uppercase mb-6 font-bold tracking-widest text-sm flex items-center gap-2">
			<span class="text-gray-600">></span> System Logs & Relays
		</h3>
		
		{#if !data?.links || data.links.length === 0}
			<div class="border border-dashed border-gray-800 p-12 text-center text-gray-500 font-mono text-sm">
				[ NO RELAYS DETECTED IN DATABASE ]<br>
				Initiate a sanitization request above to begin tracking.
			</div>
		{:else}
			<div class="overflow-x-auto border border-gray-800 rounded-sm bg-black">
				<table class="w-full text-left font-mono text-sm whitespace-nowrap">
					<thead class="bg-gray-900 text-gray-400 text-xs uppercase tracking-widest border-b border-gray-800">
						<tr>
							<th class="px-6 py-4 font-normal">Alias</th>
							<th class="px-6 py-4 font-normal">Destination (Sanitized)</th>
							<th class="px-6 py-4 font-normal text-right">Clicks</th>
							<th class="px-6 py-4 font-normal text-right">Created</th>
							<th class="px-6 py-4 font-normal text-center">Action</th>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-800/50">
						{#each data.links as link}
							<tr class="hover:bg-gray-900/30 transition-colors group">
								<td class="px-6 py-4 text-neon font-bold">/{link.slug}</td>
								<td class="px-6 py-4 text-gray-300 max-w-xs truncate" title={link.cleanedUrl}>
									{link.cleanedUrl}
								</td>
								<td class="px-6 py-4 text-right text-gray-400 font-bold">
									{(link.clicks || 0).toLocaleString()}
								</td>
								<td class="px-6 py-4 text-right text-gray-500 text-xs">
									{formatDate(link.createdAt)}
								</td>
								<td class="px-6 py-4 text-center">
									<button 
										onclick={() => copyLink(link.slug)}
										class="text-gray-500 hover:text-neon text-xs border border-gray-700 hover:border-neon px-2 py-1 rounded-sm transition-colors opacity-0 group-hover:opacity-100"
									>
										COPY
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</section>
</div>
