// Navigation Store - Manages current location and navigation state
import { writable } from 'svelte/store';

/**
 * Available locations in the cyberpunk city
 * @typedef {'hub' | 'experience' | 'skills' | 'projects' | 'education' | 'contact'} Location
 * 
 * Navigation directions
 * @typedef {'north' | 'south' | 'east' | 'west'} Direction
 */

// Navigation graph - defines which locations connect to which
export const navigationGraph = {
	hub: {
		north: 'projects',
		east: 'contact',
		south: 'experience',
		west: 'skills'
	},
	experience: {
		north: 'hub'
	},
	skills: {
		east: 'hub',
		south: 'education'
	},
	projects: {
		south: 'hub'
	},
	education: {
		north: 'skills'
	},
	contact: {
		west: 'hub'
	}
};

// Initial navigation state
const initialState = {
	currentLocation: 'hub',
	previousLocation: null,
	isTransitioning: false,
	history: ['hub']
};

// Create the navigation store
function createNavigationStore() {
	const { subscribe, set, update } = writable(initialState);

	return {
		subscribe,
		
		// Navigate to a specific location
		navigateTo: (destination) => {
			update(state => {
				// Don't navigate if already transitioning
				if (state.isTransitioning) return state;
				
				// Don't navigate to same location
				if (state.currentLocation === destination) return state;
				
				return {
					currentLocation: destination,
					previousLocation: state.currentLocation,
					isTransitioning: true,
					history: [...state.history, destination]
				};
			});
		},
		
		// Navigate in a direction (north, south, east, west)
		navigateDirection: (direction) => {
			update(state => {
				// Don't navigate if already transitioning
				if (state.isTransitioning) return state;
				
				// Get possible destination from navigation graph
				const destination = navigationGraph[state.currentLocation]?.[direction];
				
				// If no valid destination, return current state
				if (!destination) {
					console.log(`No location ${direction} of ${state.currentLocation}`);
					return state;
				}
				
				return {
					currentLocation: destination,
					previousLocation: state.currentLocation,
					isTransitioning: true,
					history: [...state.history, destination]
				};
			});
		},
		
		// Complete the transition (call this after animation finishes)
		completeTransition: () => {
			update(state => ({
				...state,
				isTransitioning: false
			}));
		},
		
		// Go back to previous location
		goBack: () => {
			update(state => {
				if (state.history.length <= 1 || state.isTransitioning) return state;
				
				// Remove current location from history
				const newHistory = [...state.history];
				newHistory.pop();
				
				// Get previous location
				const previousLocation = newHistory[newHistory.length - 1];
				
				return {
					currentLocation: previousLocation,
					previousLocation: state.currentLocation,
					isTransitioning: true,
					history: newHistory
				};
			});
		},
		
		// Reset to hub
		resetToHub: () => {
			set({
				...initialState,
				history: ['hub']
			});
		},
		
		// Get available directions from current location
		getAvailableDirections: (location) => {
			return Object.keys(navigationGraph[location] || {});
		},
		
		// Check if a direction is available from current location
		canNavigate: (location, direction) => {
			return !!navigationGraph[location]?.[direction];
		}
	};
}

// Export the store instance
export const navigation = createNavigationStore();

// Helper to get location display name
export function getLocationName(location) {
	const names = {
		hub: 'Main Street',
		experience: 'Experience Avenue',
		skills: 'Skills District',
		projects: 'Projects Alley',
		education: 'Education Quarter',
		contact: 'Contact Terminal'
	};
	return names[location];
}

// Helper to get direction display name
export function getDirectionName(direction) {
	const names = {
		north: 'North',
		south: 'South',
		east: 'East',
		west: 'West'
	};
	return names[direction];
}

// Helper to get opposite direction
export function getOppositeDirection(direction) {
	const opposites = {
		north: 'south',
		south: 'north',
		east: 'west',
		west: 'east'
	};
	return opposites[direction];
}
