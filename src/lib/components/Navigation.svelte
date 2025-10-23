<script>
	/**
	 * Navigation Component - On-screen directional controls
	 * @prop {string} currentLocation - Current location identifier
	 * @prop {Function} [onNavigate] - Callback when direction is clicked
	 */
	
	import { onMount } from 'svelte';
	import { navigationGraph } from '$lib/stores/navigation.js';
	import { goto } from '$app/navigation';
	
	let { currentLocation = 'hub', onNavigate } = $props();
	
	let isMobile = $state(false);
	
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
	
	// Map locations to routes
	const locationRouteMap = {
		'hub': '/',
		'experience': '/experience',
		'skills': '/skills',
		'projects': '/projects',
		'education': '/education',
		'contact': '/contact'
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
</script>

<div class="navigation" class:mobile={isMobile}>
	{#if isMobile}
		<!-- Mobile D-Pad -->
		<div class="dpad">
			<button 
				class="dpad-btn north"
				class:disabled={!isDirectionAvailable('north')}
				disabled={!isDirectionAvailable('north')}
				onclick={() => handleDirectionClick('north')}
				aria-label="Navigate North"
			>
				<span class="arrow">▲</span>
			</button>
			
			<button 
				class="dpad-btn west"
				class:disabled={!isDirectionAvailable('west')}
				disabled={!isDirectionAvailable('west')}
				onclick={() => handleDirectionClick('west')}
				aria-label="Navigate West"
			>
				<span class="arrow">◀</span>
			</button>
			
			<div class="dpad-center">
				<span class="neon-text tech-font">{currentLocation.toUpperCase()}</span>
			</div>
			
			<button 
				class="dpad-btn east"
				class:disabled={!isDirectionAvailable('east')}
				disabled={!isDirectionAvailable('east')}
				onclick={() => handleDirectionClick('east')}
				aria-label="Navigate East"
			>
				<span class="arrow">▶</span>
			</button>
			
			<button 
				class="dpad-btn south"
				class:disabled={!isDirectionAvailable('south')}
				disabled={!isDirectionAvailable('south')}
				onclick={() => handleDirectionClick('south')}
				aria-label="Navigate South"
			>
				<span class="arrow">▼</span>
			</button>
		</div>
	{:else}
		<!-- Desktop Mini-Map -->
		<div class="minimap">
			<p class="minimap-title neon-text tech-font">Navigation</p>
			<div class="minimap-grid">
				<div class="map-cell north" class:active={isDirectionAvailable('north')}>
					{#if isDirectionAvailable('north')}
						<button onclick={() => handleDirectionClick('north')}>
							↑
						</button>
					{/if}
				</div>
				
				<div class="map-cell west" class:active={isDirectionAvailable('west')}>
					{#if isDirectionAvailable('west')}
						<button onclick={() => handleDirectionClick('west')}>
							←
						</button>
					{/if}
				</div>
				
				<div class="map-cell current">
					<span class="pulse">{currentLocation.charAt(0).toUpperCase()}</span>
				</div>
				
				<div class="map-cell east" class:active={isDirectionAvailable('east')}>
					{#if isDirectionAvailable('east')}
						<button onclick={() => handleDirectionClick('east')}>
							→
						</button>
					{/if}
				</div>
				
				<div class="map-cell south" class:active={isDirectionAvailable('south')}>
					{#if isDirectionAvailable('south')}
						<button onclick={() => handleDirectionClick('south')}>
							↓
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	.navigation {
		position: fixed;
		z-index: 200; /* Higher z-index to ensure it's on top */
		pointer-events: auto; /* Ensure it always receives pointer events */
	}
	
	/* Mobile D-Pad */
	.navigation.mobile {
		bottom: 2rem;
		left: 50%;
		transform: translateX(-50%);
	}
	
	.dpad {
		display: grid;
		grid-template-columns: 60px 60px 60px;
		grid-template-rows: 60px 60px 60px;
		gap: 8px;
		position: relative;
	}
	
	.dpad-btn {
		background: rgba(26, 29, 63, 0.9);
		border: 2px solid var(--color-neon-cyan);
		color: var(--color-neon-cyan);
		font-size: 1.5rem;
		cursor: pointer;
		transition: all var(--transition-fast);
		box-shadow: 0 0 10px var(--color-glow-cyan);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.dpad-btn:not(.disabled):hover {
		background: var(--color-neon-cyan);
		color: var(--color-bg-primary);
		box-shadow: 0 0 20px var(--color-glow-cyan);
		transform: scale(1.1);
	}
	
	.dpad-btn:not(.disabled):active {
		transform: scale(0.95);
	}
	
	.dpad-btn.disabled {
		opacity: 0.3;
		border-color: var(--color-text-muted);
		box-shadow: none;
		cursor: not-allowed;
	}
	
	.dpad-btn.north {
		grid-column: 2;
		grid-row: 1;
	}
	
	.dpad-btn.west {
		grid-column: 1;
		grid-row: 2;
	}
	
	.dpad-btn.east {
		grid-column: 3;
		grid-row: 2;
	}
	
	.dpad-btn.south {
		grid-column: 2;
		grid-row: 3;
	}
	
	.dpad-center {
		grid-column: 2;
		grid-row: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 0.7rem;
		background: rgba(10, 14, 39, 0.9);
		border: 2px solid var(--color-neon-purple);
		box-shadow: inset 0 0 10px var(--color-glow-purple);
	}
	
	/* Desktop Mini-Map */
	.navigation:not(.mobile) {
		top: 2rem;
		right: 3rem; /* Moved left from 2rem */
		opacity: 0.5;
		transition: opacity var(--transition-normal);
	}
	
	.navigation:not(.mobile):hover {
		opacity: 1;
	}
	
	.minimap {
		padding: 0.75rem;
		min-width: 140px;
		background: rgba(26, 29, 63, 0.5);
		backdrop-filter: blur(10px);
		border: 2px solid rgba(0, 255, 240, 0.3);
		border-radius: 8px;
		box-shadow: 
			0 0 20px rgba(0, 255, 240, 0.1),
			inset 0 0 40px rgba(0, 255, 240, 0.02);
		transition: all var(--transition-normal);
	}
	
	.navigation:not(.mobile):hover .minimap {
		border-color: rgba(0, 255, 240, 0.6);
		box-shadow: 
			0 0 30px rgba(0, 255, 240, 0.2),
			inset 0 0 60px rgba(0, 255, 240, 0.05);
	}
	
	.minimap-title {
		font-size: 0.75rem;
		margin: 0 0 0.5rem 0;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 1.5px;
	}
	
	.minimap-grid {
		display: grid;
		grid-template-columns: repeat(3, 32px);
		grid-template-rows: repeat(3, 32px);
		gap: 3px;
	}
	
	.map-cell {
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(10, 14, 39, 0.5);
		border: 1px solid rgba(0, 255, 240, 0.2);
	}
	
	.map-cell.active {
		border-color: var(--color-neon-cyan);
	}
	
	.map-cell button {
		width: 100%;
		height: 100%;
		background: transparent;
		border: none;
		color: var(--color-neon-cyan);
		font-size: 1rem;
		cursor: pointer;
		transition: all var(--transition-fast);
	}
	
	.map-cell button:hover {
		background: var(--color-neon-cyan);
		color: var(--color-bg-primary);
		transform: scale(1.1);
	}
	
	.map-cell.current {
		background: var(--color-neon-purple);
		border-color: var(--color-neon-purple);
		box-shadow: 0 0 15px var(--color-glow-purple);
		font-weight: bold;
		color: var(--color-bg-primary);
	}
	
	.map-cell.north { grid-column: 2; grid-row: 1; }
	.map-cell.west { grid-column: 1; grid-row: 2; }
	.map-cell.current { grid-column: 2; grid-row: 2; }
	.map-cell.east { grid-column: 3; grid-row: 2; }
	.map-cell.south { grid-column: 2; grid-row: 3; }
	
	/* Responsive */
	@media (max-width: 768px) {
		.navigation:not(.mobile) {
			display: none;
		}
	}
	
	@media (min-width: 769px) {
		.navigation.mobile {
			display: none;
		}
	}
</style>
