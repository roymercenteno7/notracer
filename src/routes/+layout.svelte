<script lang="ts">
	import '../app.css';
	let { children } = $props();
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
		</footer>
	</div>
</div>
