<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData, PageData } from './$types';
	import { onMount, tick } from 'svelte';

	let { form, data } = $props<{ form: ActionData, data: PageData }>();
	let loading = $state(false);
	let turnstileContainer: HTMLDivElement | undefined = $state();
	let widgetId: string | undefined = $state();
	
	const PUBLIC_TURNSTILE_SITE_KEY = data.turnstileKey;
    let currentStep = $derived(form?.step || 'request');

	async function renderTurnstile() {
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
					theme: 'dark'
				});
			} catch (e) {
				console.error('Turnstile render error:', e);
			}
		}
	}

	onMount(() => {
		if (currentStep === 'request') renderTurnstile();
	});

	$effect(() => {
		if (currentStep === 'request' && !widgetId) renderTurnstile();
		if (form?.error && currentStep === 'request') renderTurnstile();
	});
</script>

<svelte:head>
	<title>Login | NoTracer</title>
</svelte:head>

<div class="w-full flex-col flex items-center justify-center min-h-[70vh] py-12">
	<div class="w-full max-w-md space-y-8 px-4">
		<div class="text-center space-y-2">
			<h1 class="text-4xl md:text-5xl font-black text-neon tracking-tighter uppercase">ACCESS_SYSTEM</h1>
			<p class="text-gray-500 tracking-widest text-xs uppercase">Welcome back. Enter your neural link.</p>
		</div>

		<div class="bg-gray-950/50 border border-gray-900 p-8 space-y-8 backdrop-blur-sm">
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
                            if (result.type === 'failure') renderTurnstile();
                        };
                    }}
                >
                    <div class="space-y-4 font-mono">
                        <div class="space-y-2">
                            <label for="email" class="text-xs text-gray-500 uppercase tracking-widest block">Neural_Link (Email)</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                required 
                                value={form?.email || ''}
                                class="w-full bg-black border border-gray-800 focus:border-neon focus:ring-1 focus:ring-neon text-gray-200 px-4 py-4 outline-none transition-colors"
                            />
                        </div>

                        <div bind:this={turnstileContainer} class="flex justify-center py-2 min-h-[65px]"></div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            class="w-full bg-gray-900 hover:bg-neon hover:text-black text-neon transition-all font-bold px-6 py-5 border border-gray-800 hover:border-neon uppercase tracking-widest"
                        >
                            {loading ? 'OPENING_PORT...' : 'REQUEST_ACCESS_'}
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
                            Sent to: {form?.email}
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
                                class="w-full bg-black border border-gray-800 focus:border-neon focus:ring-1 focus:ring-neon text-neon px-4 py-4 outline-none text-center text-3xl font-black tracking-[1rem]"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            class="w-full bg-gray-900 hover:bg-neon hover:text-black text-neon transition-all font-bold px-6 py-5 border border-gray-800 hover:border-neon uppercase tracking-widest"
                        >
                            {loading ? 'AUTHENTICATING...' : 'ESTABLISH_SESSION_'}
                        </button>
                        
                        <button 
                            type="button" 
                            onclick={() => window.location.reload()}
                            class="w-full text-gray-600 hover:text-gray-400 text-xs uppercase underline tracking-widest pt-4"
                        >
                            Back_to_Email
                        </button>
                    </div>
                </form>
            {/if}
        </div>

        <p class="text-center font-mono text-xs text-gray-600">
            DON'T HAVE AN ACCESS CODE? <a href="/register" class="text-neon hover:underline">REGISTER_HERE</a>
        </p>
	</div>
</div>
