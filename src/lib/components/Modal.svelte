<script>
	/**
	 * Modal Component - Full-screen overlay for content display
	 * @prop {boolean} isOpen - Modal visibility
	 * @prop {Function} onClose - Close handler
	 * @prop {string} [title] - Modal title
	 * @prop {boolean} [showCloseButton=true] - Show close button
	 * @prop {boolean} [closeOnBackdropClick=true] - Close when clicking backdrop
	 */
	
	import { fade, slideIn } from '$lib/utils/transitions.js';
	
	let { 
		isOpen = $bindable(false),
		onClose,
		title = null,
		showCloseButton = true,
		closeOnBackdropClick = true,
		children
	} = $props();
	
	function handleClose() {
		isOpen = false;
		if (onClose) {
			onClose();
		}
	}
	
	function handleBackdropClick(event) {
		if (closeOnBackdropClick && event.target === event.currentTarget) {
			handleClose();
		}
	}
	
	function handleKeydown(event) {
		if (event.key === 'Escape' && isOpen) {
			event.stopPropagation(); // Prevent keyboard navigation from catching this
			handleClose();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

{#if isOpen}
	<div 
		class="modal-backdrop" 
		onclick={handleBackdropClick}
		onkeydown={(e) => e.key === 'Enter' && closeOnBackdropClick && handleBackdropClick(e)}
		transition:fade={{ duration: 300 }}
		role="dialog"
		aria-modal="true"
		aria-labelledby={title ? 'modal-title' : undefined}
		tabindex="-1"
	>
		<div class="modal-content" transition:slideIn={{ duration: 400 }}>
			<div class="modal-header">
				{#if title}
					<h2 id="modal-title" class="modal-title">{title}</h2>
				{/if}
				{#if showCloseButton}
					<button 
						class="modal-close" 
						onclick={handleClose}
						aria-label="Close modal"
						type="button"
					>
						<svg 
							width="24" 
							height="24" 
							viewBox="0 0 24 24" 
							fill="none" 
							stroke="currentColor" 
							stroke-width="2"
						>
							<line x1="18" y1="6" x2="6" y2="18"></line>
							<line x1="6" y1="6" x2="18" y2="18"></line>
						</svg>
					</button>
				{/if}
			</div>
			
			<div class="modal-body">
				{@render children?.()}
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
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
		z-index: 9999;
		padding: 1rem;
		overflow-y: auto;
	}
	
	.modal-content {
		position: relative;
		width: 100%;
		max-width: 800px;
		max-height: 90vh;
		background: var(--color-surface);
		border: 2px solid var(--color-neon-cyan);
		border-radius: 8px;
		box-shadow: 
			0 0 20px var(--color-glow-cyan),
			0 0 40px rgba(0, 255, 240, 0.2),
			inset 0 0 60px rgba(0, 255, 240, 0.05);
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}
	
	.modal-header {
		position: relative;
		padding: 1.5rem;
		border-bottom: 1px solid rgba(0, 255, 240, 0.2);
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(
			135deg,
			rgba(0, 255, 240, 0.05),
			rgba(185, 0, 255, 0.05)
		);
	}
	
	.modal-title {
		margin: 0;
		font-family: 'Orbitron', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--color-neon-cyan);
		text-transform: uppercase;
		letter-spacing: 2px;
		text-shadow: 
			0 0 10px var(--color-glow-cyan),
			0 0 20px var(--color-glow-cyan);
	}
	
	.modal-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 40px;
		height: 40px;
		background: transparent;
		border: 2px solid var(--color-neon-pink);
		border-radius: 4px;
		color: var(--color-neon-pink);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all var(--transition-normal);
	}
	
	.modal-close:hover {
		background: rgba(255, 0, 110, 0.1);
		box-shadow: 
			0 0 10px var(--color-glow-pink),
			inset 0 0 20px rgba(255, 0, 110, 0.1);
		transform: rotate(90deg);
	}
	
	.modal-close:active {
		transform: rotate(90deg) scale(0.9);
	}
	
	.modal-body {
		padding: 2rem 1.5rem;
		overflow-y: auto;
		flex: 1;
	}
	
	.modal-body::-webkit-scrollbar {
		width: 8px;
	}
	
	.modal-body::-webkit-scrollbar-track {
		background: rgba(0, 255, 240, 0.05);
	}
	
	.modal-body::-webkit-scrollbar-thumb {
		background: var(--color-neon-cyan);
		border-radius: 4px;
		box-shadow: 0 0 10px var(--color-glow-cyan);
	}
	
	.modal-body::-webkit-scrollbar-thumb:hover {
		background: var(--color-glow-cyan);
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.modal-backdrop {
			padding: 0.5rem;
		}
		
		.modal-content {
			max-height: 95vh;
		}
		
		.modal-header {
			padding: 1rem;
		}
		
		.modal-title {
			font-size: 1.25rem;
			letter-spacing: 1px;
		}
		
		.modal-close {
			width: 36px;
			height: 36px;
		}
		
		.modal-body {
			padding: 1.5rem 1rem;
		}
	}
</style>
