<script>
	/**
	 * Navigation Component - Holographic Radar Style
	 * @prop {string} currentLocation - Current location identifier
	 * @prop {Function} [onNavigate] - Callback when direction is clicked
	 */
	
	import { onMount } from 'svelte';
	import { navigationGraph } from '$lib/stores/navigation.js';
	import { goto } from '$app/navigation';
	
	let { currentLocation = 'hub', onNavigate } = $props();
	
	let isMobile = $state(false);
	let hoveredDirection = $state(null);
	let isInteracting = $state(false); // Track if user has interacted
	
	// Detect if we're on a mobile device
	function checkIfMobile() {
		isMobile = window.innerWidth <= 768;
	}
	
	onMount(() => {
		checkIfMobile();
		window.addEventListener('resize', checkIfMobile);
		
		return () => {
			window.removeEventListener('resize', checkIfMobile);
		};
	});
	
	// Map locations to routes and display names
	const locationRouteMap = {
		'hub': '/',
		'experience': '/experience',
		'skills': '/skills',
		'projects': '/projects',
		'education': '/education',
		'contact': '/contact'
	};
	
	const locationDisplayNames = {
		'hub': 'Main Hub',
		'experience': 'Experience Ave',
		'skills': 'Skills District',
		'projects': 'Projects Alley',
		'education': 'Education Quarter',
		'contact': 'Contact Terminal'
	};
	
	const availableDirections = $derived(Object.keys(navigationGraph[currentLocation] || {}));
	
	function handleDirectionClick(direction) {
		const nextLocation = navigationGraph[currentLocation]?.[direction];
		if (nextLocation && locationRouteMap[nextLocation]) {
			goto(locationRouteMap[nextLocation]);
		}
		
		if (onNavigate) {
			onNavigate(direction);
		}
	}
	
	function isDirectionAvailable(direction) {
		return availableDirections.includes(direction);
	}
	
	function getDestinationName(direction) {
		const nextLocation = navigationGraph[currentLocation]?.[direction];
		return locationDisplayNames[nextLocation] || nextLocation;
	}
	
	// Handle user interaction to make radar more visible
	function handleInteraction() {
		isInteracting = true;
	}
	
	// Reset interaction after a delay
	function resetInteraction() {
		setTimeout(() => {
			isInteracting = false;
		}, 3000); // Stay visible for 3 seconds after interaction
	}

</script>

<div class="navigation-radar" class:mobile={isMobile} class:hub={currentLocation === 'hub'} class:interacting={isInteracting}>
	<!-- Radar Container -->
	<div 
		class="radar-container"
		ontouchstart={handleInteraction}
		ontouchend={resetInteraction}
		onmouseenter={handleInteraction}
		onmouseleave={resetInteraction}
	>
		<!-- Animated scan line -->
		<div class="scan-line"></div>
		
		<!-- Radar rings (background) -->
		<div class="radar-ring outer"></div>
		<div class="radar-ring middle"></div>
		<div class="radar-ring inner"></div>
		
		<!-- Center indicator (current location) -->
		<div class="radar-center">
			<span class="location-initial">{currentLocation.charAt(0).toUpperCase()}</span>
		</div>
		
		<!-- Directional segments -->
		<button
			class="radar-segment north"
			class:active={isDirectionAvailable('north')}
			class:hovered={hoveredDirection === 'north'}
			disabled={!isDirectionAvailable('north')}
			onclick={() => handleDirectionClick('north')}
			onmouseenter={() => hoveredDirection = 'north'}
			onmouseleave={() => hoveredDirection = null}
			aria-label="Navigate North"
		>
			<svg class="direction-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="18 15 12 9 6 15"></polyline>
			</svg>
			{#if hoveredDirection === 'north' && isDirectionAvailable('north')}
				<span class="destination-label">{getDestinationName('north')}</span>
			{/if}
		</button>
		
		<button
			class="radar-segment east"
			class:active={isDirectionAvailable('east')}
			class:hovered={hoveredDirection === 'east'}
			disabled={!isDirectionAvailable('east')}
			onclick={() => handleDirectionClick('east')}
			onmouseenter={() => hoveredDirection = 'east'}
			onmouseleave={() => hoveredDirection = null}
			aria-label="Navigate East"
		>
			<svg class="direction-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="9 18 15 12 9 6"></polyline>
			</svg>
			{#if hoveredDirection === 'east' && isDirectionAvailable('east')}
				<span class="destination-label">{getDestinationName('east')}</span>
			{/if}
		</button>
		
		<button
			class="radar-segment south"
			class:active={isDirectionAvailable('south')}
			class:hovered={hoveredDirection === 'south'}
			disabled={!isDirectionAvailable('south')}
			onclick={() => handleDirectionClick('south')}
			onmouseenter={() => hoveredDirection = 'south'}
			onmouseleave={() => hoveredDirection = null}
			aria-label="Navigate South"
		>
			<svg class="direction-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="6 9 12 15 18 9"></polyline>
			</svg>
			{#if hoveredDirection === 'south' && isDirectionAvailable('south')}
				<span class="destination-label">{getDestinationName('south')}</span>
			{/if}
		</button>
		
		<button
			class="radar-segment west"
			class:active={isDirectionAvailable('west')}
			class:hovered={hoveredDirection === 'west'}
			disabled={!isDirectionAvailable('west')}
			onclick={() => handleDirectionClick('west')}
			onmouseenter={() => hoveredDirection = 'west'}
			onmouseleave={() => hoveredDirection = null}
			aria-label="Navigate West"
		>
			<svg class="direction-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="15 18 9 12 15 6"></polyline>
			</svg>
			{#if hoveredDirection === 'west' && isDirectionAvailable('west')}
				<span class="destination-label">{getDestinationName('west')}</span>
			{/if}
		</button>
	</div>
	
	<!-- Location label below radar -->
	<div class="location-label">
		<span class="tech-font neon-text">{currentLocation.toUpperCase()}</span>
	</div>
</div>

<style>
	/* Main Container */
	.navigation-radar {
		position: fixed;
		pointer-events: none; /* Allow clicks to pass through empty space */
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		z-index: 100; /* Higher than terminal (z-index: 10) but lower than modals (1000) */
	}
	
	/* Desktop positioning */
	.navigation-radar:not(.mobile) {
		top: 2rem;
		right: 2rem;
		opacity: 0.7;
		transition: opacity var(--transition-normal);
	}
	
	.navigation-radar:not(.mobile):hover {
		opacity: 1;
	}
	
	/* Mobile positioning - moved to top-left to avoid terminal overlap */
	.navigation-radar.mobile {
		top: 1rem;
		right: 1rem; /* Changed from left to right - keeps it in corner */
		left: auto;
		transform: none;
		opacity: 0.3; /* Less visible by default on mobile (non-hub pages) */
		transition: opacity var(--transition-normal);
	}
	
	/* Keep radar fully visible on hub in mobile */
	.navigation-radar.mobile.hub {
		opacity: 1;
	}
	
	/* Show radar when user interacts with it on mobile (non-hub pages) */
	.navigation-radar.mobile.interacting {
		opacity: 1;
	}
	
	/* Make mobile radar slightly smaller and more compact */
	.navigation-radar.mobile .radar-container {
		width: 120px;
		height: 120px;
	}
	.radar-container {
		position: relative;
		width: 160px;
		height: 160px;
		border-radius: 50%;
		background: radial-gradient(circle, rgba(0, 255, 240, 0.05) 0%, rgba(10, 14, 39, 0.9) 70%);
		border: 2px solid rgba(0, 255, 240, 0.3);
		box-shadow: 
			0 0 30px rgba(0, 255, 240, 0.2),
			inset 0 0 40px rgba(0, 255, 240, 0.05);
		backdrop-filter: blur(10px);
		pointer-events: auto; /* Container itself is clickable for visual feedback */
	}
	
	/* Radar Rings (concentric circles) */
	.radar-ring {
		position: absolute;
		border-radius: 50%;
		border: 1px solid rgba(0, 255, 240, 0.15);
		pointer-events: none;
	}
	
	.radar-ring.outer {
		width: 140px;
		height: 140px;
		top: 10px;
		left: 10px;
	}
	
	.radar-ring.middle {
		width: 100px;
		height: 100px;
		top: 30px;
		left: 30px;
	}
	
	.radar-ring.inner {
		width: 60px;
		height: 60px;
		top: 50px;
		left: 50px;
	}
	
	/* Animated Scan Line */
	.scan-line {
		position: absolute;
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background: conic-gradient(
			from 0deg,
			transparent 0deg,
			transparent 340deg,
			rgba(0, 255, 240, 0.4) 350deg,
			transparent 360deg
		);
		animation: radar-scan 4s linear infinite;
		pointer-events: none;
		opacity: 0.6;
	}
	
	@keyframes radar-scan {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}
	
	/* Center Indicator (current location) */
	.radar-center {
		position: absolute;
		width: 40px;
		height: 40px;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: var(--color-neon-purple);
		border: 2px solid rgba(255, 255, 255, 0.3);
		display: flex;
		align-items: center;
		justify-content: center;
		box-shadow: 
			0 0 20px var(--color-glow-purple),
			inset 0 0 10px rgba(255, 255, 255, 0.2);
		animation: pulse-glow 2s ease-in-out infinite;
		z-index: 10;
	}
	
	.location-initial {
		font-family: 'Orbitron', sans-serif;
		font-size: 1.25rem;
		font-weight: bold;
		color: var(--color-bg-primary);
		text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
	}
	
	@keyframes pulse-glow {
		0%, 100% {
			box-shadow: 
				0 0 20px var(--color-glow-purple),
				inset 0 0 10px rgba(255, 255, 255, 0.2);
		}
		50% {
			box-shadow: 
				0 0 30px var(--color-glow-purple),
				0 0 40px var(--color-glow-purple),
				inset 0 0 15px rgba(255, 255, 255, 0.3);
		}
	}
	
	/* Directional Segments (clickable buttons) */
	.radar-segment {
		position: absolute;
		width: 50px;
		height: 50px;
		background: transparent;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-fast);
		z-index: 5;
		pointer-events: auto; /* Ensure buttons are clickable */
	}
	
	.radar-segment.north {
		top: -5px;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.radar-segment.east {
		top: 50%;
		right: -5px;
		transform: translateY(-50%);
	}
	
	.radar-segment.south {
		bottom: -5px;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.radar-segment.west {
		top: 50%;
		left: -5px;
		transform: translateY(-50%);
	}
	
	/* Direction Icons */
	.direction-icon {
		width: 32px;
		height: 32px;
		color: rgba(255, 255, 255, 0.3);
		filter: drop-shadow(0 0 5px rgba(0, 255, 240, 0.3));
		transition: all var(--transition-fast);
	}
	
	/* Active directions */
	.radar-segment.active .direction-icon {
		color: var(--color-neon-cyan);
		filter: drop-shadow(0 0 10px var(--color-glow-cyan));
	}
	
	/* Hover state */
	.radar-segment.active:hover .direction-icon,
	.radar-segment.hovered .direction-icon {
		color: var(--color-neon-pink);
		filter: drop-shadow(0 0 15px var(--color-glow-pink));
		transform: scale(1.2);
	}
	
	/* Disabled state */
	.radar-segment:disabled {
		cursor: not-allowed;
		opacity: 0.3;
	}
	
	.radar-segment:disabled .direction-icon {
		filter: none;
	}
	
	/* Destination label on hover */
	.destination-label {
		position: absolute;
		white-space: nowrap;
		font-family: 'Rajdhani', sans-serif;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-neon-pink);
		background: rgba(10, 14, 39, 0.95);
		padding: 0.375rem 0.75rem;
		border-radius: 4px;
		border: 1px solid var(--color-neon-pink);
		box-shadow: 0 0 15px var(--color-glow-pink);
		animation: fadeIn 0.2s ease-out;
		z-index: 100;
		pointer-events: none;
	}
	
	.radar-segment.north .destination-label {
		top: -35px;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.radar-segment.east .destination-label {
		right: -10px;
		top: 50%;
		transform: translate(100%, -50%);
	}
	
	.radar-segment.south .destination-label {
		bottom: -35px;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.radar-segment.west .destination-label {
		left: -10px;
		top: 50%;
		transform: translate(-100%, -50%);
	}
	
	/* Location label below radar */
	.location-label {
		font-size: 0.75rem;
		text-align: center;
		letter-spacing: 1.5px;
		text-transform: uppercase;
	}
	
	/* Mobile adjustments - already defined above */
	
	.navigation-radar.mobile .radar-ring.outer {
		width: 100px;
		height: 100px;
		top: 10px;
		left: 10px;
	}
	
	.navigation-radar.mobile .radar-ring.middle {
		width: 70px;
		height: 70px;
		top: 25px;
		left: 25px;
	}
	
	.navigation-radar.mobile .radar-ring.inner {
		width: 40px;
		height: 40px;
		top: 40px;
		left: 40px;
	}
	
	.navigation-radar.mobile .radar-center {
		width: 30px;
		height: 30px;
	}
	
	.navigation-radar.mobile .location-initial {
		font-size: 0.95rem;
	}
	
	.navigation-radar.mobile .radar-segment {
		width: 40px;
		height: 40px;
	}
	
	.navigation-radar.mobile .direction-icon {
		width: 24px;
		height: 24px;
	}
	
	.navigation-radar.mobile .destination-label {
		display: none; /* Hide labels on mobile to save space */
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateX(-50%) translateY(-5px);
		}
		to {
			opacity: 1;
			transform: translateX(-50%) translateY(0);
		}
	}
	
	/* Accessibility */
	@media (prefers-reduced-motion: reduce) {
		.scan-line {
			animation: none;
		}
		.radar-center {
			animation: none;
		}
	}
</style>
