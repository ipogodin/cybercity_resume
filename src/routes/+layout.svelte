<script lang="ts">
	import '../app.css';
	import '../styles/cyberpunk.css';
	import '../styles/animations.css';
	import favicon from '$lib/assets/favicon.svg';
	import LoadingScreen from '$lib/components/LoadingScreen.svelte';
	import AudioToggle from '$lib/components/AudioToggle.svelte';
	import { onMount } from 'svelte';

	let { children } = $props();
	let isLoading = $state(true);
	let contentReady = $state(false);

	onMount(() => {
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
	<link rel="icon" href={favicon} />
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

<LoadingScreen {isLoading} />

{#if contentReady}
	<AudioToggle />
	{@render children?.()}
{/if}
