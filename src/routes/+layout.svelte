<script lang="ts">
	import '../app.css';
	import type { LayoutData } from './$types';
	let { children, data } = $props<{ children: any, data: LayoutData }>();
</script>

<div class="min-h-screen w-full flex flex-col items-center justify-center p-4 selection:bg-neon selection:text-black">
	<div class="w-full max-w-2xl mx-auto flex flex-col gap-8">
		<header class="text-center space-y-4">
			<div class="flex flex-col items-center">
				<h1 class="text-4xl md:text-6xl font-bold tracking-tighter text-neon uppercase border-b-2 border-neon pb-2 inline-block">
					<a href="/" class="hover:text-white transition-colors">NoTracer</a>
				</h1>
				<p class="text-gray-400 text-sm md:text-base tracking-widest uppercase mt-4">
					// Metadata Cleaner & Private Shortener
				</p>
			</div>
			
			<nav class="flex gap-6 justify-center items-center py-4 border-y border-gray-900 mt-4">
				<a href="/" class="hover:text-neon transition-colors text-xs uppercase tracking-widest">Home</a>
				{#if data.user}
					<a href="/dashboard" class="text-neon hover:underline font-bold text-xs uppercase tracking-widest">Dashboard</a>
					<form action="/logout" method="POST" class="inline">
						<button type="submit" class="hover:text-red-500 transition-colors text-xs uppercase tracking-widest cursor-pointer">Logout</button>
					</form>
				{:else}
					<a href="/login" class="hover:text-neon transition-colors text-xs uppercase tracking-widest">Login</a>
					<a href="/register" class="hover:text-neon transition-colors text-xs uppercase tracking-widest border border-neon px-2 py-1 rounded-sm">Register</a>
				{/if}
				<a href="/about" class="hover:text-neon transition-colors text-xs uppercase tracking-widest">About</a>
			</nav>
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
		</footer>
	</div>
</div>
