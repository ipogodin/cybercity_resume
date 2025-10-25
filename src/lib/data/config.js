/**
 * Application Configuration
 * Central configuration for app-wide settings
 */

export const config = {
	version: '1.0.7',
	appName: 'CyberCity Resume',
	author: 'Illia Pogodin',
	tagline: 'Walk the streets to know me better',
	
	// Feature flags
	features: {
		rainEffect: true,
		audioToggle: true,
		keyboardNavigation: true,
		tutorial: true
	},
	
	// Timing configurations (in milliseconds)
	timing: {
		tutorialDuration: {
			firstVisit: 4000,
			returnVisit: 1600
		},
		loadingScreen: {
			firstVisit: 2000,
			returnVisit: 400
		},
		signAppearance: {
			firstVisit: 500,
			returnVisit: 100
		}
	}
};

export default config;
