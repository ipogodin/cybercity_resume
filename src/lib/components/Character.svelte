<script>
	import { onMount } from 'svelte';
	
	/**
	 * Character Component - Static character in the scene
	 * @prop {string} [position='left'] - Character position (left, center, right)
	 * @prop {string} [image] - Path to character image
	 * @prop {number} [scale=1] - Scale multiplier for character size (e.g., 0.8 = 80% size, 1.5 = 150% size)
	 * @prop {number} [delay=1000] - Delay in ms before character appears
	 * @prop {string} [entrance='bottom'] - Entrance animation direction (left, right, top, bottom)
	 */
	
	let { 
		position = 'left', 
		image = '/images/character/character_animated.webm',
		scale = 1,
		delay = 1000,
		entrance = 'bottom'
	} = $props();
	
	let visible = $state(false);
	
	// Get CSS class for position
	const positionClass = $derived(`character-${position}`);
	
	// Get CSS class for entrance direction
	const entranceClass = $derived(`entrance-${entrance}`);
	
	// Calculate scaled dimensions
	const scaledWidth = $derived(100 * scale);
	const scaledHeight = $derived(200 * scale);

	// Detect if the source is a video file
	const isVideo = $derived(image?.match(/\.(webm|mp4|ogg)$/i) !== null);
	
	onMount(() => {
		const timer = setTimeout(() => {
			visible = true;
		}, delay);
		
		return () => clearTimeout(timer);
	});
</script>

<div 
	class="character {positionClass} {entranceClass}" 
	class:visible
	style="width: {scaledWidth}px; height: {scaledHeight}px;"
>
	{#if image && isVideo}
		<video
			class="character-image"
			autoplay
			loop
			muted
			playsinline
		>
			<source src={image} type="video/webm" />
		</video>
	{:else if image}
		<img src={image} alt="Character" class="character-image" />
	{:else}
		<div class="character-placeholder">
			<div class="character-silhouette"></div>
		</div>
	{/if}
</div>

<style>
	.character {
		position: absolute;
		bottom: 15%;
		/* Width and height set via inline style for dynamic scaling */
		z-index: 2; /* Lower than neon signs (20), below UI (40) */
		filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.7));
		opacity: 0;
		transition: opacity 1s ease-out, transform 1s ease-out;
	}
	
	/* Entrance animations - initial positions */
	.character.entrance-bottom {
		transform: translateY(20px);
	}
	
	.character.entrance-top {
		transform: translateY(-20px);
	}
	
	.character.entrance-left {
		transform: translateX(-20px);
	}
	
	.character.entrance-right {
		transform: translateX(20px);
	}
	
	/* Visible state - reset transform */
	.character.visible {
		opacity: 1;
		transform: translateY(0) translateX(0);
	}
	
	/* Position variants */
	.character-left {
		left: 10%;
		transform-origin: left bottom;
	}
	
	.character-center {
		left: 75%; 
		transform-origin: center bottom;
	}
	
	.character-center.entrance-bottom {
		transform: translateX(-50%) translateY(20px);
	}
	
	.character-center.entrance-top {
		transform: translateX(-50%) translateY(-20px);
	}
	
	.character-center.entrance-left {
		transform: translateX(-50%) translateX(-20px);
	}
	
	.character-center.entrance-right {
		transform: translateX(-50%) translateX(20px);
	}
	
	.character-center.visible {
		transform: translateX(-50%) translateY(0);
	}
	
	.character-right {
		right: 10%;
		transform-origin: right bottom;
	}
	
	.character-image {
		width: 100%;
		height: 100%;
		object-fit: contain;
		object-position: bottom;
	}

	video.character-image {
		background: transparent;
	}
	
	/* Placeholder styling */
	.character-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: flex-end;
		justify-content: center;
	}
	
	.character-silhouette {
		width: 80px;
		height: 200px;
		background: linear-gradient(
			180deg,
			rgba(0, 255, 240, 0.3) 0%,
			rgba(0, 255, 240, 0.1) 50%,
			transparent 100%
		);
		clip-path: polygon(
			40% 0%,   /* Hat top */
			60% 0%,
			70% 10%,  /* Hat brim */
			30% 10%,
			35% 15%,  /* Head */
			65% 15%,
			65% 25%,  /* Shoulders */
			70% 30%,
			70% 90%,  /* Coat */
			30% 90%,
			30% 30%,
			35% 25%
		);
		box-shadow: 0 0 20px rgba(0, 255, 240, 0.5);
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.character {
			bottom: 10%;
		}
		
		.character-left {
			left: 5%;
		}
		
		.character-right {
			right: 5%;
		}
	}
</style>
