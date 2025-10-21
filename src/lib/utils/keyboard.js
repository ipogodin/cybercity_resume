// Keyboard Navigation Utility
import { navigation, navigationGraph } from '../stores/navigation.js';
import { goto } from '$app/navigation';

/**
 * Map locations to routes
 */
const locationRouteMap = {
	'hub': '/',
	'experience': '/experience',
	'skills': '/skills',
	'projects': '/projects',
	'education': '/education',
	'contact': '/contact'
};

/**
 * Map keyboard keys to navigation directions
 */
const keyDirectionMap = {
	// Arrow keys
	'ArrowUp': 'north',
	'ArrowDown': 'south',
	'ArrowLeft': 'west',
	'ArrowRight': 'east',
	
	// WASD keys
	'w': 'north',
	'W': 'north',
	's': 'south',
	'S': 'south',
	'a': 'west',
	'A': 'west',
	'd': 'east',
	'D': 'east'
};

/**
 * Get current location from URL pathname
 */
function getCurrentLocationFromURL() {
	const pathname = window.location.pathname;
	
	// Find location by matching route
	for (const [location, route] of Object.entries(locationRouteMap)) {
		if (pathname === route) {
			return location;
		}
	}
	
	// Default to hub if no match
	return 'hub';
}

/**
 * Handle keyboard navigation
 * @param {KeyboardEvent} event 
 */
function handleKeyboardNavigation(event) {
	// Check if a modal is open (modal backdrop exists in DOM)
	const isModalOpen = document.querySelector('.modal-backdrop') !== null;
	
	// If modal is open, don't handle ESC - let the modal handle it
	if (event.key === 'Escape' && isModalOpen) {
		return; // Let modal's own ESC handler work
	}
	
	const direction = keyDirectionMap[event.key];
	
	if (direction) {
		// Prevent default browser behavior (e.g., scrolling)
		event.preventDefault();
		
		// Get current location from URL
		const currentLocation = getCurrentLocationFromURL();
		
		// Get next location from navigation graph
		const nextLocation = navigationGraph[currentLocation]?.[direction];
		
		if (nextLocation && locationRouteMap[nextLocation]) {
			// Navigate to the route
			goto(locationRouteMap[nextLocation]);
		}
	}
	
	// Handle Escape key - reset to hub (only if no modal is open)
	if (event.key === 'Escape' && !isModalOpen) {
		event.preventDefault();
		goto('/');
	}
	
	// Handle Backspace - go back
	if (event.key === 'Backspace') {
		event.preventDefault();
		history.back();
	}
}

/**
 * Initialize keyboard navigation
 * Adds event listener for keyboard navigation
 * @returns {Function} Cleanup function to remove listener
 */
export function initKeyboardNavigation() {
	// Add event listener
	window.addEventListener('keydown', handleKeyboardNavigation);
	
	// Return cleanup function
	return () => {
		window.removeEventListener('keydown', handleKeyboardNavigation);
	};
}

/**
 * Get keyboard controls help text
 */
export function getKeyboardHelp() {
	return {
		navigation: [
			{ keys: ['↑', 'W'], action: 'Move North' },
			{ keys: ['↓', 'S'], action: 'Move South' },
			{ keys: ['←', 'A'], action: 'Move West' },
			{ keys: ['→', 'D'], action: 'Move East' }
		],
		utility: [
			{ keys: ['Backspace'], action: 'Go Back' },
			{ keys: ['Esc'], action: 'Return to Hub' }
		]
	};
}

/**
 * Check if a key is a navigation key
 * @param {string} key 
 * @returns {boolean}
 */
export function isNavigationKey(key) {
	return key in keyDirectionMap;
}
