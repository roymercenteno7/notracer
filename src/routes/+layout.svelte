<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	let { children, data } = $props<{ children: any, data: LayoutData }>();
</script>

<div class="min-h-screen w-full flex flex-col items-center justify-center p-4 selection:bg-neon selection:text-black">
	<div class="w-full max-w-2xl mx-auto flex flex-col gap-8">
		<!-- Header -->
		<header class="text-center space-y-2">
			<h1 class="text-4xl md:text-6xl font-bold tracking-tighter text-neon uppercase border-b-2 border-neon pb-2 inline-block">
				NoTracer
			</h1>
			<p class="text-gray-400 text-sm md:text-base tracking-widest uppercase mt-4">
				// Metadata Cleaner & Private Shortener
			</p>
		</header>
		
		<!-- Main Content -->
		<main class="flex-1 w-full flex flex-col items-center">
			{@render children()}
		</main>
		
		<!-- Footer -->
		<footer class="mt-12 text-center text-xs text-gray-600 tracking-wider">
			<p>&copy; {new Date().getFullYear()} NoTracer.com</p>
			<p class="mt-1">Built for privacy. Zero logs policy.</p>
			<p class="mt-2 text-gray-700 font-mono">System notifications are sent via <span class="text-gray-500">noreply@notracer.com</span></p>
			<div class="mt-4 flex gap-4 justify-center items-center">
				{#if data.user}
					<a href="/dashboard" class="text-neon hover:underline font-bold text-xs uppercase tracking-tighter">[ DASHBOARD ]</a>
				{:else}
					<a href="/login" class="hover:text-neon transition-colors underline decoration-gray-800 underline-offset-4">Login</a>
					<a href="/register" class="hover:text-neon transition-colors underline decoration-gray-800 underline-offset-4">Register</a>
				{/if}
				<a href="/about" class="hover:text-neon transition-colors underline decoration-gray-800 underline-offset-4">About</a>
			</div>
		</footer>
	</div>
</div>
