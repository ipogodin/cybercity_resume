<script lang="ts">
	import '../app.css';
	import '../styles/cyberpunk.css';
	import '../styles/animations.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
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

{@render children?.()}
