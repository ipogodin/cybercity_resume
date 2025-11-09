<script>
	import { onMount, onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { initKeyboardNavigation } from '$lib/utils/keyboard.js';
	import { config } from '$lib/data/config.js';
	import Scene from '$lib/components/Scene.svelte';
	import Character from '$lib/components/Character.svelte';
	import RainEffect from '$lib/components/RainEffect.svelte';
	import NeonSign from '$lib/components/NeonSign.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	
	let rainEnabled = $state(true);
	let showTutorial = $state(false);
	let isLoaded = $state(false);
	let showSigns = $state(false); // Delay signs until after tutorial
	let cleanup;
	
	// Initialize keyboard navigation on mount
	onMount(() => {
		cleanup = initKeyboardNavigation();
		console.log('🎮 Keyboard navigation initialized!');
		console.log('🌆 Welcome to CyberCity Resume');
		
		// Check if user has visited before in this session
		const hasVisited = sessionStorage.getItem('hasVisited');
		const tutorialShown = sessionStorage.getItem('tutorialShown');
		
		// Timing configuration: first visit vs subsequent visits
		const tutorialDuration = hasVisited ? 1600 : 4000; // 5x faster: 8000ms / 5 = 1600ms
		const introDelay = hasVisited ? 20 : 100; // 5x faster
		
		if (!tutorialShown) {
			showTutorial = true;
			sessionStorage.setItem('tutorialShown', 'true');
			
			// Hide tutorial after time (faster on subsequent loads)
			setTimeout(() => {
				showTutorial = false;
				setTimeout(() => {
					showSigns = true;
				}, hasVisited ? 100 : 500); // 5x faster sign appearance
			}, tutorialDuration);
		} else {
			// If tutorial was already shown, show signs immediately
			showSigns = true;
		}
		
		// Mark as visited for future loads
		if (!hasVisited) {
			sessionStorage.setItem('hasVisited', 'true');
		}
		
		// Intro animation (faster on subsequent loads)
		setTimeout(() => {
			isLoaded = true;
		}, introDelay);
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
			{ text: 'Skills District', direction: 'west', color: 'purple', position: 'left', route: '/skills' }
		];
	}
	
	function navigateToSign(route) {
		goto(route);
	}
	
	function dismissTutorial() {
		showTutorial = false;
		// Show signs after dismissing tutorial
		setTimeout(() => {
			showSigns = true;
		}, 500);
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
	
	<!-- Hub Neon Signs (only show at hub, delayed after tutorial) -->
	{#if showSigns}
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
	{/if}
	
	<!-- UI Overlay -->
	<div class="ui-overlay">
		<!-- Location Display -->
		<div class="location-display glass-card">
			<h2 class="neon-text">Illia Pogodin</h2>
			<!-- Download Resume Button -->
			<a 
				href="/resume.pdf" 
				download="Illia_Pogodin_Resume.pdf"
				class="resume-download-btn"
			>
				<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
					<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
					<polyline points="7 10 12 15 17 10"></polyline>
					<line x1="12" y1="15" x2="12" y2="3"></line>
				</svg>
				<span>Download Resume</span>
			</a>
			<p class="tech-font">Or navigate to discover more</p>
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
		
		<!-- Audio and Rain Controls (Unified design in bottom-right) -->
		<!-- Moved to AudioToggle component -->
		
		<!-- Navigation Component (Mobile D-pad / Desktop Minimap) -->
		<Navigation />
		
		<!-- Stage Info -->
		<div class="stage-info">
			<p class="tech-font neon-text-purple">v {config.version}</p>
			<p class="tech-font neon-text-cyan" style="font-size: 0.65rem; margin-top: 0.25rem;">All rights reserved, I guess. Enjoy the sound of a rain, my friend.</p>
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
		z-index: 250; /* Higher than Navigation (200) to ensure signs are clickable on mobile */
	}
	
	.neon-signs > * {
		pointer-events: auto;
	}
	
	.sign-container {
		position: absolute;
		animation: fadeIn 1s ease-out backwards;
		z-index: 250;
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
	
	/* Resume Download Button */
	.resume-download-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.625rem;
		margin-top: 1rem;
		padding: 0.75rem 1.5rem;
		background: rgba(185, 0, 255, 0.1);
		border: 2px solid var(--color-neon-purple);
		border-radius: 6px;
		color: var(--color-neon-purple);
		font-family: 'Orbitron', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 1px;
		cursor: pointer;
		transition: all var(--transition-fast);
		box-shadow: 0 0 15px rgba(185, 0, 255, 0.3);
		animation: fadeIn 0.8s ease-out 0.6s backwards;
	}
	
	.resume-download-btn:hover {
		background: rgba(185, 0, 255, 0.2);
		box-shadow: 0 0 25px rgba(185, 0, 255, 0.6);
		transform: translateY(-2px);
		border-color: var(--color-neon-cyan);
		color: var(--color-neon-cyan);
	}
	
	.resume-download-btn:active {
		transform: translateY(0);
	}
	
	.resume-download-btn svg {
		flex-shrink: 0;
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
	
	/* Stage Info */
	.stage-info {
		position: fixed;
		bottom: 1.5rem;
		left: 3rem;
		animation: fadeInUp 0.6s ease-out 0.4s backwards;
		z-index: 100;
	}
	
	.stage-info p {
		margin: 0;
		font-size: 0.875rem;
	}

    .character-wrapper {
		position: absolute;
		bottom: 10%;
		right: 20%;
		z-index: 2;
		pointer-events: none;
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		/* Stack signs vertically to avoid overlap - explicit positioning */
		.sign-container {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			width: auto;
			height: auto;
			margin: 0;
			padding: 0;
			display: flex;
			align-items: center;
			justify-content: center;
		}
		
		.sign-top {
			top: 18%;
			right: auto;
			bottom: auto;
			left: 50%;
			transform: translateX(-50%) translateY(0);
			font-size: 0.875rem;
		}
		
		.sign-right {
			top: 32%;
			right: auto;
			bottom: auto;
			left: 50%;
			transform: translateX(-50%) translateY(0);
			font-size: 0.875rem;
		}
		
		.sign-bottom {
			top: 46%;
			right: auto;
			bottom: auto;
			left: 50%;
			transform: translateX(-50%) translateY(0);
			font-size: 0.875rem;
		}
		
		.sign-left {
			top: 60%;
			right: auto;
			bottom: auto;
			left: 50%;
			transform: translateX(-50%) translateY(0);
			font-size: 0.875rem;
		}
		
		.character-wrapper {
			right: 8%; 
            bottom: 15%;
		}
		
		.location-display {
			top: 1rem;
			left: 1rem;
			padding: 1rem 1.5rem;
		}
		
		.location-display h2 {
			font-size: 1.5rem;
		}
		
		.resume-download-btn {
			font-size: 0.75rem;
			padding: 0.625rem 1.125rem;
			gap: 0.5rem;
			margin-top: 0.75rem;
			min-height: 44px; /* Touch target */
		}
		
		.resume-download-btn svg {
			width: 16px;
			height: 16px;
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
		
		.stage-info {
			bottom: 1rem;
			left: 1rem;
		}
	}
</style>
