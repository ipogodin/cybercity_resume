// Custom Svelte Transitions for Scene Changes

/**
 * Cyberpunk scene fade transition with blur effect
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function sceneTransition(node, { delay = 0, duration = 1000 } = {}) {
	return {
		delay,
		duration,
		css: (t) => {
			const opacity = t;
			const blur = (1 - t) * 10;
			return `
				opacity: ${opacity};
				filter: blur(${blur}px);
			`;
		}
	};
}

/**
 * Slide and fade transition for character movement
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function characterSlide(node, { delay = 0, duration = 800, direction = 'left' } = {}) {
	const directionMultiplier = direction === 'left' ? -1 : 1;
	
	return {
		delay,
		duration,
		css: (t) => {
			const opacity = t;
			const transform = (1 - t) * 100 * directionMultiplier;
			return `
				opacity: ${opacity};
				transform: translateX(${transform}px);
			`;
		}
	};
}

/**
 * Neon glow fade in/out
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function neonGlow(node, { delay = 0, duration = 600, color = 'cyan' } = {}) {
	const glowColors = {
		cyan: '0, 255, 240',
		pink: '255, 0, 110',
		purple: '185, 0, 255'
	};
	
	const rgb = glowColors[color] || glowColors.cyan;
	
	return {
		delay,
		duration,
		css: (t) => {
			const opacity = t;
			const glowIntensity = t * 20;
			return `
				opacity: ${opacity};
				box-shadow: 
					0 0 ${glowIntensity}px rgba(${rgb}, ${t * 0.5}),
					0 0 ${glowIntensity * 2}px rgba(${rgb}, ${t * 0.3});
			`;
		}
	};
}

/**
 * Scale and fade transition
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function scaleTransition(node, { delay = 0, duration = 500, start = 0.9 } = {}) {
	return {
		delay,
		duration,
		css: (t) => {
			const scale = start + (t * (1 - start));
			return `
				opacity: ${t};
				transform: scale(${scale});
			`;
		}
	};
}

/**
 * Glitch transition effect
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function glitchTransition(node, { delay = 0, duration = 600 } = {}) {
	return {
		delay,
		duration,
		css: (t, u) => {
			// Use u (1 - t) for exit transitions
			const glitchAmount = u * 5;
			const opacity = t;
			
			return `
				opacity: ${opacity};
				transform: translate(${Math.random() * glitchAmount - glitchAmount / 2}px, ${Math.random() * glitchAmount - glitchAmount / 2}px);
				filter: hue-rotate(${u * 360}deg);
			`;
		}
	};
}

/**
 * Typing effect transition (for text)
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function typewriterTransition(node, { delay = 0, speed = 50 } = {}) {
	const text = node.textContent;
	const duration = text.length * speed;
	
	return {
		delay,
		duration,
		tick: (t) => {
			const i = Math.trunc(text.length * t);
			node.textContent = text.slice(0, i);
		}
	};
}

/**
 * Simple fade transition
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function fade(node, { delay = 0, duration = 300 } = {}) {
	return {
		delay,
		duration,
		css: (t) => `opacity: ${t}`
	};
}

/**
 * Slide in from bottom with fade
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function slideIn(node, { delay = 0, duration = 400 } = {}) {
	return {
		delay,
		duration,
		css: (t) => {
			const translateY = (1 - t) * 50;
			return `
				opacity: ${t};
				transform: translateY(${translateY}px);
			`;
		}
	};
}

/**
 * Page transition - slide and fade with direction
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function pageTransition(node, { delay = 0, duration = 600, direction = 'in' } = {}) {
	return {
		delay,
		duration,
		css: (t, u) => {
			const progress = direction === 'out' ? u : t;
			const translateX = direction === 'out' ? t * -100 : (1 - t) * 100;
			const opacity = progress;
			
			return `
				opacity: ${opacity};
				transform: translateX(${translateX}px);
			`;
		}
	};
}

/**
 * Cyberspace warp transition
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function warpTransition(node, { delay = 0, duration = 800 } = {}) {
	return {
		delay,
		duration,
		css: (t) => {
			const scale = 0.5 + (t * 0.5);
			const blur = (1 - t) * 20;
			const brightness = 0.5 + (t * 0.5);
			
			return `
				opacity: ${t};
				transform: scale(${scale}) perspective(1000px) rotateX(${(1 - t) * 20}deg);
				filter: blur(${blur}px) brightness(${brightness});
			`;
		}
	};
}

/**
 * Digital dissolve transition
 * @param {HTMLElement} node 
 * @param {Object} params 
 * @returns {Object} Transition configuration
 */
export function digitalDissolve(node, { delay = 0, duration = 700 } = {}) {
	return {
		delay,
		duration,
		css: (t) => {
			const pixelSize = (1 - t) * 10;
			const opacity = t;
			
			return `
				opacity: ${opacity};
				filter: blur(${(1 - t) * 5}px);
				image-rendering: ${pixelSize > 5 ? 'pixelated' : 'auto'};
			`;
		}
	};
}
