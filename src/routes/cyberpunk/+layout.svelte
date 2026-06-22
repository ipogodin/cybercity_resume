<script lang="ts">
	import '../../app.css';
	import '../../styles/cyberpunk.css';
	import '../../styles/animations.css';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import AudioToggle from '$lib/components/AudioToggle.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	let isLoading = $state(true);
	let contentReady = $state(false);

	onMount(() => {
		// Check if user has seen the loading screen in this session
		const hasSeenLoading = sessionStorage.getItem('hasSeenLoading');
		
		if (hasSeenLoading) {
			// Skip loading screen - show content immediately
			isLoading = false;
			contentReady = true;
			return;
		}
		
		// First time visit - show loading screen
		sessionStorage.setItem('hasSeenLoading', 'true');
		
		// Simulate initial load time to show loading screen
		const minLoadTime = 2000; // Minimum 2 seconds to appreciate the loading screen
		const startTime = Date.now();

		// Wait for DOM to be ready
		const checkReady = () => {
			const elapsed = Date.now() - startTime;
			const remainingTime = minLoadTime - elapsed;

			if (remainingTime > 0) {
				setTimeout(() => {
					isLoading = false;
					setTimeout(() => {
						contentReady = true;
					}, 500);
				}, remainingTime);
			} else {
				isLoading = false;
				setTimeout(() => {
					contentReady = true;
				}, 500);
			}
		};

		// Check if document is ready
		if (document.readyState === 'complete') {
			checkReady();
		} else {
			window.addEventListener('load', checkReady);
		}
	});
</script>

<svelte:head>
	<!-- Favicon - organized in /static/icons/ -->
	<link rel="icon" type="image/png" href="/images/icons/favicon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png" />
	<link rel="icon" type="image/png" sizes="192x192" href="/images/icons/android-chrome-192x192.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon.png" />
	
	<!-- Google Fonts - Cyberpunk Typography -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&family=Orbitron:wght@400;500;600;700;800;900&display=swap"
		rel="stylesheet"
	/>
	<title>CyberCity Resume</title>
	<meta name="description" content="Interactive cyberpunk-themed resume portfolio" />
</svelte:head>

<div class="cyber-root">
	<LoadingScreen {isLoading} />

	{#if contentReady}
		<AudioToggle />
		{@render children?.()}
	{/if}
</div>

<style>
	/* Cyberpunk CSS variables — injected only when this layout is mounted (/cyberpunk/* routes) */
	:global(:root) {
		--color-bg-primary: #0a0e27;
		--color-bg-secondary: #1a1d3f;
		--color-bg-overlay: rgba(10, 14, 39, 0.95);
		--color-neon-cyan: #00fff0;
		--color-neon-pink: #ff006e;
		--color-neon-purple: #b900ff;
		--color-neon-blue: #00d4ff;
		--color-neon-green: #00ff88;
		--color-text-primary: #ffffff;
		--color-text-secondary: #b0b8cc;
		--color-text-cyan: #00fff0;
		--color-text-muted: #6a7489;
		--color-rain: rgba(173, 216, 230, 0.3);
		--color-glow-cyan: rgba(0, 255, 240, 0.5);
		--color-glow-pink: rgba(255, 0, 110, 0.5);
		--color-glow-purple: rgba(185, 0, 255, 0.5);
		--shadow-neon-cyan: 0 0 10px #00fff0, 0 0 20px rgba(0,255,240,0.5);
		--shadow-neon-pink: 0 0 10px #ff006e, 0 0 20px rgba(255,0,110,0.5);
		--shadow-neon-purple: 0 0 10px #b900ff, 0 0 20px rgba(185,0,255,0.5);
		--spacing-xs: 0.25rem; --spacing-sm: 0.5rem; --spacing-md: 1rem;
		--spacing-lg: 1.5rem; --spacing-xl: 2rem; --spacing-2xl: 3rem; --spacing-3xl: 4rem;
		--transition-fast: 0.15s ease; --transition-normal: 0.3s ease;
		--transition-slow: 0.6s ease; --transition-scene: 1s ease-in-out;
		--z-background: 0; --z-scene: 10; --z-character: 20;
		--z-rain: 30; --z-ui: 40; --z-modal: 50; --z-overlay: 60;
	}

	/*
	 * IMPORTANT: Do NOT put overflow:hidden or position:fixed on :global(body/html) here.
	 * Those rules bleed onto other routes when SvelteKit preloads this layout's CSS chunk
	 * on hover (data-sveltekit-preload-data="hover" is set on the root body in app.html).
	 * Instead, the .cyber-root container handles full-screen lock for cyberpunk routes.
	 */
	.cyber-root {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background-color: var(--color-bg-primary);
		color: var(--color-text-primary);
		font-family: 'Rajdhani', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	}

	/* Cyberpunk link + scrollbar + selection styles — scoped inside cyber-root */
	.cyber-root :global(a) { color: var(--color-neon-cyan); text-decoration: none; transition: all 0.15s ease; }
	.cyber-root :global(a:hover) { color: var(--color-neon-pink); text-shadow: var(--shadow-neon-pink); }
	.cyber-root :global(button:focus-visible), .cyber-root :global(a:focus-visible) { outline: 2px solid var(--color-neon-cyan); outline-offset: 2px; }
	.cyber-root :global(::-webkit-scrollbar) { width: 10px; height: 10px; }
	.cyber-root :global(::-webkit-scrollbar-track) { background: var(--color-bg-secondary); }
	.cyber-root :global(::-webkit-scrollbar-thumb) { background: var(--color-neon-cyan); border-radius: 5px; }
	.cyber-root :global(::-webkit-scrollbar-thumb:hover) { background: var(--color-neon-purple); }
	.cyber-root :global(::selection) { background-color: var(--color-neon-cyan); color: var(--color-bg-primary); }
</style>
