<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { onMount, tick } from 'svelte';

	let { form, data } = $props<{ form: ActionData, data: PageData }>();
	let loading = $state(false);
	let turnstileContainer: HTMLDivElement | undefined = $state();
	let widgetId: string | undefined = $state();
	
	let isBetaOpen = $derived(data.isBetaOpen);
	let PUBLIC_TURNSTILE_SITE_KEY = $derived(data.turnstileKey);

    let currentStep = $derived(form?.step || 'request');

	async function renderTurnstile() {
		// Wait for Turnstile script to be available
		let attempts = 0;
		while (typeof window !== 'undefined' && !(window as any).turnstile && attempts < 10) {
			await new Promise(resolve => setTimeout(resolve, 200));
			attempts++;
		}

		if (typeof window !== 'undefined' && (window as any).turnstile && turnstileContainer) {
			try {
				if (widgetId) (window as any).turnstile.remove(widgetId);
				widgetId = (window as any).turnstile.render(turnstileContainer, {
					sitekey: PUBLIC_TURNSTILE_SITE_KEY,
					theme: 'dark',
					callback: function(token: string) {
						console.log('[CLIENT] Security token generated.');
					}
				});
			} catch (e) {
				console.error('Turnstile render error:', e);
			}
		}
	}

	onMount(() => {
		if (currentStep === 'request') {
			renderTurnstile();
		}
	});

	// Re-render when switching steps or if form error occurs
	$effect(() => {
		if (currentStep === 'request' && !widgetId) {
			renderTurnstile();
		}
		if (form?.error && currentStep === 'request') {
			renderTurnstile();
		}
	});
</script>

<div class="w-full flex-col flex items-center justify-center min-h-[80vh] py-12">
	<div class="w-full max-w-xl space-y-12">
        <!-- Privacy Manifesto -->
        <div class="border border-neon bg-black/50 p-6 font-mono text-xs relative overflow-hidden group">
            <div class="absolute top-0 left-0 w-full h-1 bg-neon/30 animate-pulse"></div>
            <div class="flex justify-between items-center mb-4 border-b border-neon/30 pb-2">
                <span class="text-neon font-bold">[ PRIVACY_MANIFESTO ]</span>
                <span class="text-gray-600">v2.0.4-STABLE</span>
            </div>
            <p class="text-gray-300 leading-relaxed italic">
                "We don't sell, track, or store your personal identity. To ensure maximum operational security, all links and activity data in your Dashboard will be automatically purged every 30 days. No logs. No traces."
            </p>
            <div class="mt-4 flex gap-2">
                <span class="px-2 py-0.5 bg-neon/10 text-neon border border-neon/20">ENCRYPTED</span>
                <span class="px-2 py-0.5 bg-neon/10 text-neon border border-neon/20">NON-PERSISTENT</span>
            </div>
        </div>

		<div class="text-center space-y-2">
			<h1 class="text-4xl md:text-5xl font-black text-neon tracking-tighter uppercase">Clearance_Required</h1>
			<p class="text-gray-500 tracking-widest text-xs uppercase">Join the resistance. No passwords. No friction.</p>
		</div>

		<div class="bg-gray-950/50 border border-gray-900 p-8 space-y-8 backdrop-blur-sm">
            {#if !isBetaOpen}
                <div class="text-yellow-500 border border-yellow-900/50 bg-yellow-950/30 px-4 py-8 rounded font-mono text-sm text-center space-y-4">
                    <p class="text-lg font-bold">[SYSTEM_OFFLINE]</p>
                    <p class="text-xs text-gray-500 uppercase tracking-widest">Public registration is currently unavailable.</p>
                    <div class="pt-6">
                        <a href="/login" class="bg-gray-900 border border-gray-800 hover:border-neon text-gray-300 hover:text-neon px-8 py-3 transition-colors uppercase font-bold text-xs inline-block">GO_TO_LOGIN_PAGE →</a>
                    </div>
                </div>
            {:else}
                {#if form?.error}
                    <div class="text-red-500 border border-red-900 bg-red-950/30 px-4 py-3 rounded font-mono text-sm text-center">
                        [FAILURE] {form.error}
                    </div>
                {/if}

                {#if currentStep === 'request'}
                    <form 
                        action="?/sendCode"
                        method="POST" 
                        class="space-y-6"
                        use:enhance={() => {
                            loading = true;
                            return async ({ update, result }) => {
                                loading = false;
                                await update();
								// If there was an error, re-render turnstile
								if (result.type === 'failure') {
									renderTurnstile();
								}
                            };
                        }}
                    >
                        <div class="space-y-4 font-mono">
                            <div class="space-y-2">
                                <label for="email" class="text-xs text-gray-400 uppercase tracking-widest block">Neural_Link (Email)</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email" 
                                    placeholder="yourname@provider.com"
                                    required 
                                    value={form?.email || ''}
                                    class="w-full bg-black border border-gray-800 focus:border-neon focus:ring-1 focus:ring-neon text-gray-200 px-4 py-4 outline-none transition-colors text-lg"
                                />
                            </div>

                            <!-- Cloudflare Turnstile (Explicit container) -->
                            <div bind:this={turnstileContainer} class="flex justify-center py-2 min-h-[65px]"></div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                class="w-full bg-gray-900 hover:bg-neon hover:text-black text-neon transition-all font-bold px-6 py-5 border border-gray-800 hover:border-neon disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                            >
                                {loading ? 'INITIATING_SEQUENCE...' : 'REQUEST_ACCESS_CODE_'}
                            </button>
                        </div>
                    </form>
                {:else if currentStep === 'verify'}
                    <form 
                        action="?/verifyCode"
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
                        <input type="hidden" name="email" value={form?.email} />
                        
                        <div class="space-y-4 font-mono">
                            <div class="text-neon text-center text-xs uppercase tracking-widest mb-4">
                                Code sent to: {form?.email}
                            </div>

                            <div class="space-y-2">
                                <label for="code" class="text-xs text-gray-400 uppercase tracking-widest block">Verification_Code</label>
                                <input 
                                    type="text" 
                                    id="code" 
                                    name="code" 
                                    placeholder="000000"
                                    maxlength="6"
                                    required 
                                    class="w-full bg-black border border-gray-800 focus:border-neon focus:ring-1 focus:ring-neon text-neon px-4 py-4 outline-none transition-colors text-3xl font-black text-center tracking-[1rem]"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                class="w-full bg-gray-900 hover:bg-neon hover:text-black text-neon transition-all font-bold px-6 py-5 border border-gray-800 hover:border-neon disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
                            >
                                {loading ? 'AUTHENTICATING...' : 'ESTABLISH_SESSION_'}
                            </button>

                            <button 
                                type="button" 
                                onclick={() => window.location.reload()}
                                class="w-full text-gray-600 hover:text-gray-400 text-xs uppercase underline tracking-widest pt-4"
                            >
                                Edit_Email / Resend_Code
                            </button>
                        </div>
                    </form>
                {/if}
            {/if}
        </div>

        <p class="text-center font-mono text-xs text-gray-700 uppercase tracking-widest">
            By engaging, you acknowledge the 30-day auto-purge protocol.
        </p>
	</div>
</div>
