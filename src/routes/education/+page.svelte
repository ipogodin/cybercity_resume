<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { initKeyboardNavigation } from '$lib/utils/keyboard.js';
	import Scene from '$lib/components/Scene.svelte';
	import Character from '$lib/components/Character.svelte';
	import RainEffect from '$lib/components/RainEffect.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	
	let cleanup;
	
	onMount(() => {
		cleanup = initKeyboardNavigation();
	});
	
	onDestroy(() => {
		if (cleanup) cleanup();
	});
</script>

<RainEffect enabled={true} intensity={100} speed={2} />

<Scene background="/images/scenes/education_quarter.png" location="education" enableParallax={true}>
	<Character position="left" scale={1} delay={900} />
	
	<div class="placeholder-content">
		<div class="placeholder-box glass-card">
			<h1 class="neon-text-purple">Education Quarter</h1>
			<p class="tech-font">Coming Soon...</p>
			<p style="margin-top: 1rem; color: var(--color-text-secondary);">
				This section is under construction. Check out Experience Avenue to see my work history!
			</p>
		</div>
	</div>
	
	<!-- Navigation Map -->
	<Navigation currentLocation="education" />
</Scene>

<style>
	.placeholder-content {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 100;
		animation: fadeIn 1s ease-out;
	}
	
	.placeholder-box {
		padding: 3rem;
		text-align: center;
		max-width: 500px;
	}
	
	.placeholder-box h1 {
		font-size: 3rem;
		margin: 0 0 1rem 0;
		font-family: 'Orbitron', sans-serif;
		text-transform: uppercase;
		letter-spacing: 4px;
	}
	
	@keyframes fadeIn {
		from { opacity: 0; transform: translate(-50%, -40%); }
		to { opacity: 1; transform: translate(-50%, -50%); }
	}
</style>
