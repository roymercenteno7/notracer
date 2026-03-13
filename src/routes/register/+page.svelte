<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';

	let { form } = $props<{ form: ActionData }>();
	let loading = $state(false);
</script>

<div class="w-full flex-col flex items-center justify-center min-h-[70vh]">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center space-y-2">
			<h1 class="text-4xl md:text-5xl font-black text-neon tracking-tighter">REGISTER_</h1>
			<p class="text-gray-500 tracking-widest text-xs uppercase">Join the resistance against tracking.</p>
		</div>

		<form 
			method="POST" 
			class="space-y-6"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}
		>
			{#if form?.error}
				<div class="text-red-500 border border-red-900 bg-red-950/30 px-4 py-3 rounded font-mono text-sm text-center">
					[ERROR] {form.error}
				</div>
			{/if}

			{#if form?.success}
				<div class="text-neon border border-neon/50 bg-neon/10 px-4 py-3 rounded font-mono text-sm text-center">
					[SUCCESS] {form.message} <br/> <a href="/login" class="underline hover:bg-neon hover:text-black">PROCEED TO LOGIN_</a>
				</div>
			{:else}
				<div class="space-y-4 font-mono">
					<div class="space-y-2">
						<label for="email" class="text-xs text-gray-500 uppercase tracking-widest block">Email_Address</label>
						<input 
							type="email" 
							id="email" 
							name="email" 
							required 
							value={form?.email || ''}
							class="w-full bg-black border border-gray-800 focus:border-neon focus:ring-1 focus:ring-neon text-gray-200 px-4 py-3 outline-none transition-colors"
						/>
					</div>

					<div class="space-y-2">
						<label for="password" class="text-xs text-gray-500 uppercase tracking-widest block">Access_Key (Password)</label>
						<input 
							type="password" 
							id="password" 
							name="password" 
							required 
							class="w-full bg-black border border-gray-800 focus:border-neon focus:ring-1 focus:ring-neon text-gray-200 px-4 py-3 outline-none transition-colors"
						/>
					</div>

					<!-- Cloudflare Turnstile -->
					<div class="cf-turnstile flex justify-center py-2" data-sitekey={PUBLIC_TURNSTILE_SITE_KEY} data-theme="dark"></div>

					<button 
						type="submit" 
						disabled={loading}
						class="w-full bg-gray-900 hover:bg-neon hover:text-black text-neon transition-colors font-bold px-6 py-4 border border-gray-800 hover:border-neon disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? 'INITIALIZING...' : 'INITIALIZE_ACCOUNT'}
					</button>
				</div>
				
				<p class="text-center font-mono text-xs text-gray-600 pt-4">
					ALREADY HAVE CLEARANCE? <a href="/login" class="text-neon hover:underline">LOGIN_HERE</a>
				</p>
			{/if}
		</form>
	</div>
</div>
