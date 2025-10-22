<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { initKeyboardNavigation } from '$lib/utils/keyboard.js';
	import Scene from '$lib/components/Scene.svelte';
	import Character from '$lib/components/Character.svelte';
	import RainEffect from '$lib/components/RainEffect.svelte';
	import NeonSign from '$lib/components/NeonSign.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	
	let rainEnabled = $state(true);
	let showTutorial = $state(false);
	let isLoaded = $state(false);
	let cleanup;
	
	// Initialize keyboard navigation on mount
	onMount(() => {
		cleanup = initKeyboardNavigation();
		console.log('🎮 Keyboard navigation initialized!');
		console.log('🌆 Welcome to CyberCity Resume');
		
		// Check if tutorial has been shown this session
		const tutorialShown = sessionStorage.getItem('tutorialShown');
		if (!tutorialShown) {
			showTutorial = true;
			sessionStorage.setItem('tutorialShown', 'true');
			
			// Hide tutorial after some time
			setTimeout(() => {
				showTutorial = false;
			}, 8000);
		}
		
		// Intro animation
		setTimeout(() => {
			isLoaded = true;
		}, 100);
	});
	
	// Cleanup on unmount
	onDestroy(() => {
		if (cleanup) cleanup();
	});
	
	// Get neon signs for hub
	function getHubSigns() {
		return [
			{ text: 'Projects Alley', direction: 'north', color: 'cyan', position: 'top', route: '/projects' },
			{ text: 'Contact Terminal', direction: 'east', color: 'purple', position: 'right', route: '/contact' },
			{ text: 'Experience Avenue', direction: 'south', color: 'pink', position: 'bottom', route: '/experience' },
			{ text: 'Skills District', direction: 'west', color: 'cyan', position: 'left', route: '/skills' }
		];
	}
	
	function navigateToSign(route) {
		goto(route);
	}
	
	function dismissTutorial() {
		showTutorial = false;
	}
	
	// Handle any keypress to dismiss tutorial
	function handleKeyPress(event) {
		if (showTutorial) {
			dismissTutorial();
		}
	}
</script>

<svelte:window onkeydown={handleKeyPress} />

<!-- Rain Effect -->
<RainEffect enabled={rainEnabled} intensity={150} speed={2} />

<!-- Intro Fade -->
<div class="intro-fade" class:loaded={isLoaded}></div>

<!-- Main Scene -->
<Scene background="/images/scenes/main_hub_scene.png" location="hub" enableParallax={true}>
	<!-- Character - dynamic position and size per scene, fades in smoothly -->
    <div class="character-wrapper">
		<Character position="right" scale={1} entrance="right" />
	</div>
	
	<!-- Hub Neon Signs (only show at hub) -->
	<div class="neon-signs">
			{#each getHubSigns() as sign}
				<div 
					class="sign-container sign-{sign.position}"
				>
					<NeonSign 
						text={sign.text}
						direction={sign.direction}
						color={sign.color}
						onclick={() => navigateToSign(sign.route)}
					/>
				</div>
			{/each}
		</div>
	
	<!-- UI Overlay -->
	<div class="ui-overlay">
		<!-- Location Display -->
		<div class="location-display glass-card">
			<h2 class="neon-text">CyberCity Hub</h2>
			<p class="tech-font">Select your destination</p>
		</div>
		
		<!-- Tutorial Hint -->
		{#if showTutorial}
			<div class="tutorial-overlay">
				<div class="tutorial-box glass-card">
					<h3 class="neon-text-cyan">Welcome to CyberCity Resume</h3>
					<p class="tech-font">Navigate using:</p>
					<div class="tutorial-keys">
						<div class="key-group">
							<kbd>↑</kbd> <kbd>W</kbd> <span>North - Projects</span>
						</div>
						<div class="key-group">
							<kbd>→</kbd> <kbd>D</kbd> <span>East - Contact</span>
						</div>
						<div class="key-group">
							<kbd>↓</kbd> <kbd>S</kbd> <span>South - Experience</span>
						</div>
						<div class="key-group">
							<kbd>←</kbd> <kbd>A</kbd> <span>West - Skills</span>
						</div>
					</div>
					<p class="tech-font" style="margin-top: 1rem; font-size: 0.875rem;">
						Press <kbd>ESC</kbd> to return to hub • <kbd>Backspace</kbd> to go back
					</p>
					<button class="btn-neon" onclick={dismissTutorial}>
						Got it!
					</button>
				</div>
			</div>
		{/if}
		
		<!-- Settings & Controls -->
		<div class="settings">
			<button 
				class="btn-neon" 
				onclick={() => rainEnabled = !rainEnabled}
			>
				Rain: {rainEnabled ? 'ON' : 'OFF'}
			</button>
		</div>
		
		<!-- Navigation Component (Mobile D-pad / Desktop Minimap) -->
		<Navigation />
		
		<!-- Stage Info -->
		<div class="stage-info">
			<p class="tech-font neon-text-purple">Stage 12: Character Animations ✅</p>
			<p class="tech-font neon-text-cyan" style="font-size: 0.75rem; margin-top: 0.25rem;">75% Complete • Next: Education & Contact</p>
		</div>
	</div>
</Scene>

<style>
	:global(body) {
		overflow: hidden;
		margin: 0;
		padding: 0;
	}
	
	:global(html) {
		overflow: hidden;
		width: 100vw;
		height: 100vh;
	}
	
	/* Intro fade animation */
	.intro-fade {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: var(--color-bg);
		z-index: 9999;
		opacity: 1;
		transition: opacity 1.5s ease-out;
		pointer-events: none;
	}
	
	.intro-fade.loaded {
		opacity: 0;
	}
	
	/* Neon Signs Positioning */
	.neon-signs {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 25; /* Above character (20), below UI (40) */
	}
	
	.neon-signs > * {
		pointer-events: auto;
	}
	
	.sign-container {
		position: absolute;
		animation: fadeIn 1s ease-out backwards;
	}
	
	.sign-top {
		top: 15%;
		left: 50%;
		transform: translateX(-50%);
		animation-delay: 0.5s;
	}
	
	.sign-right {
		top: 50%;
		right: 10%;
		transform: translateY(-50%);
		animation-delay: 0.7s;
	}
	
	.sign-bottom {
		bottom: 20%;
		left: 50%;
		transform: translateX(-50%);
		animation-delay: 0.9s;
	}
	
	.sign-left {
		top: 50%;
		left: 10%;
		transform: translateY(-50%);
		animation-delay: 1.1s;
	}
	
	/* UI Overlay */
	.ui-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: var(--z-ui);
	}
	
	.ui-overlay > * {
		pointer-events: auto;
	}
	
	.location-display {
		position: fixed;
		top: 1.5rem;
		left: 3rem; /* Moved right from 1.5rem */
		padding: 1.5rem 2rem;
		animation: fadeInDown 0.6s ease-out;
		z-index: 100;
	}
	
	.location-display h2 {
		font-size: 2rem;
		margin: 0;
		text-transform: uppercase;
		letter-spacing: 3px;
	}
	
	.location-display p {
		margin: 0.5rem 0 0 0;
		font-size: 0.9rem;
		color: var(--color-text-secondary);
	}
	
	.transitioning {
		color: var(--color-neon-pink) !important;
		animation: pulse 0.5s ease-in-out infinite;
	}
	
	/* Tutorial Overlay */
	.tutorial-overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(10, 14, 39, 0.9);
		backdrop-filter: blur(8px);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		animation: fadeIn 0.6s ease-out;
		padding: 1rem;
	}
	
	.tutorial-box {
		max-width: 600px;
		width: 100%;
		padding: 2.5rem;
		text-align: center;
		animation: slideIn 0.6s ease-out 0.3s backwards;
	}
	
	.tutorial-box h3 {
		font-size: 2rem;
		margin: 0 0 1.5rem 0;
		font-family: 'Orbitron', sans-serif;
		text-transform: uppercase;
		letter-spacing: 2px;
	}
	
	.tutorial-box p {
		margin: 0 0 1rem 0;
		font-size: 1rem;
		color: var(--color-text-secondary);
	}
	
	.tutorial-keys {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		margin: 1.5rem 0;
	}
	
	.key-group {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.75rem;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.938rem;
	}
	
	kbd {
		display: inline-block;
		padding: 0.5rem 0.75rem;
		background: rgba(0, 255, 240, 0.1);
		border: 2px solid var(--color-neon-cyan);
		border-radius: 4px;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.875rem;
		color: var(--color-neon-cyan);
		text-shadow: 0 0 5px var(--color-glow-cyan);
		min-width: 2.5rem;
		text-align: center;
	}
	
	.tutorial-box button {
		margin-top: 1.5rem;
		padding: 0.75rem 2rem;
		font-size: 1rem;
	}
	
	/* Settings */
	.settings {
		position: fixed;
		bottom: 1.5rem;
		right: 3rem; /* Moved left from 1.5rem */
		animation: fadeInUp 0.6s ease-out 0.3s backwards;
		z-index: 100;
	}
	
	.settings button {
		padding: 0.625rem 1.25rem;
		font-size: 0.875rem;
	}
	
	/* Stage Info */
	.stage-info {
		position: fixed;
		bottom: 1.5rem;
		left: 1.5rem;
		animation: fadeInUp 0.6s ease-out 0.4s backwards;
		z-index: 100;
	}
	
	.stage-info p {
		margin: 0;
		font-size: 0.875rem;
	}

    .character-wrapper {
		position: absolute;
		bottom: 15%; /* Lower than default 15% */
		right: 15rem;
		z-index: 2;
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.sign-top {
			top: 12%;
			font-size: 0.875rem;
		}
		
		.sign-right {
			right: 5%;
			font-size: 0.875rem;
		}
		
		.sign-bottom {
			bottom: 25%;
			font-size: 0.875rem;
		}
		
		.sign-left {
			left: 5%;
			font-size: 0.875rem;
		}
		
		.location-display {
			top: 1rem;
			left: 1rem;
			padding: 1rem 1.5rem;
		}
		
		.location-display h2 {
			font-size: 1.5rem;
		}
		
		.tutorial-box {
			padding: 1.5rem;
		}
		
		.tutorial-box h3 {
			font-size: 1.5rem;
		}
		
		.tutorial-keys {
			gap: 0.5rem;
		}
		
		.key-group {
			font-size: 0.813rem;
			flex-wrap: wrap;
		}
		
		kbd {
			padding: 0.375rem 0.625rem;
			font-size: 0.75rem;
			min-width: 2rem;
		}
		
		.settings {
			bottom: 1rem;
			right: 1rem;
		}
		
		.stage-info {
			bottom: 1rem;
			left: 1rem;
		}
	}
</style>
