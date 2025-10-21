<script>
	/**
	 * Scene Component - Displays background images with parallax layers
	 * @prop {string} background - Path to the background image
	 * @prop {string} location - Current location identifier
	 * @prop {boolean} [enableParallax=false] - Enable parallax effect on mouse move
	 */
	
	let { background, location, enableParallax = false, children } = $props();
	
	let mouseX = $state(0);
	let mouseY = $state(0);
	
	// Handle mouse move for parallax effect
	function handleMouseMove(event) {
		if (!enableParallax) return;
		
		const { clientX, clientY } = event;
		const { innerWidth, innerHeight } = window;
		
		// Normalize to -1 to 1 range
		mouseX = (clientX / innerWidth - 0.5) * 2;
		mouseY = (clientY / innerHeight - 0.5) * 2;
	}
	
	// Calculate parallax transform
	const parallaxTransform = $derived(() => {
		if (!enableParallax) return 'translate(0, 0)';
		
		const moveX = mouseX * 10; // Reduced intensity for smaller overflow
		const moveY = mouseY * 10;
		return `translate(${moveX}px, ${moveY}px)`;
	});
</script>

<svelte:window onmousemove={handleMouseMove} />

<div class="scene" data-location={location}>
	<div class="scene-background" style="transform: {parallaxTransform()}">
		{#if background}
			<img src={background} alt="{location} scene" class="scene-image" />
		{:else}
			<div class="scene-placeholder">
				<p class="neon-text">{location}</p>
			</div>
		{/if}
		
		<!-- Content slot for scene-specific elements (moves with parallax) -->
		<div class="scene-content-parallax">
			{@render children?.()}
		</div>
	</div>
	
	<!-- Vignette overlay -->
	<div class="vignette"></div>
	
	<!-- Scanlines effect -->
	<div class="scanlines"></div>
	
	<!-- UI overlay (does not move with parallax) -->
	<div class="scene-content-ui">
		<!-- UI elements will be placed here from parent -->
	</div>
</div>

<style>
	.scene {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		background-color: var(--color-bg-primary);
	}
	
	.scene-background {
		position: absolute;
		top: -2%;
		left: -2%;
		width: 104%;
		height: 104%;
		transition: transform 0.3s ease-out;
		z-index: var(--z-background);
	}
	
	.scene-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
	
	.scene-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(
			135deg,
			var(--color-bg-primary),
			var(--color-bg-secondary)
		);
	}
	
	.scene-placeholder p {
		font-size: 3rem;
		text-transform: uppercase;
		letter-spacing: 4px;
	}
	
	.vignette {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: radial-gradient(
			ellipse at center,
			rgba(0, 0, 0, 0) 0%,
			rgba(0, 0, 0, 0.5) 100%
		);
		pointer-events: none;
		z-index: var(--z-overlay);
	}
	
	.scanlines {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: repeating-linear-gradient(
			0deg,
			rgba(0, 0, 0, 0.15),
			rgba(0, 0, 0, 0.15) 1px,
			transparent 1px,
			transparent 2px
		);
		pointer-events: none;
		opacity: 0.3;
		z-index: var(--z-overlay);
		animation: scanline-move 8s linear infinite;
	}
	
	@keyframes scanline-move {
		0% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(10px);
		}
	}
	
	.scene-content-parallax {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	
	.scene-content-parallax > :global(*) {
		pointer-events: auto;
	}
	
	.scene-content-ui {
		position: relative;
		z-index: var(--z-scene);
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	
	.scene-content-ui > :global(*) {
		pointer-events: auto;
	}
	
	/* Responsive adjustments */
	@media (max-width: 768px) {
		.scene-background {
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
		
		.scanlines {
			opacity: 0.2;
		}
	}
</style>
