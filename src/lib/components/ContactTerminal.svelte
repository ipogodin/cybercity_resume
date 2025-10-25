<script>
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	
	/**
	 * ContactTerminal Component - Interactive terminal-style contact interface
	 * @prop {Object} contact - Contact data object
	 * @prop {Function} onFocusChange - Callback when terminal input focus changes
	 */
	
	let { 
		contact = {},
		onFocusChange = null
	} = $props();
	
	const { 
		email = '',
		phone = '',
		location = '',
		resumeUrl = '/resume.pdf',
		social = {}
	} = contact;
	
	// Terminal scenario with computer output (CO) and user input (UI)
	const terminalScenario = [
		{ type: 'system', text: 'CONTACT TERMINAL v2.0.77', speed: 'fast', isUserInput: false, delayAfter: 0 },
		{ type: 'system', text: 'Initializing secure connection...', speed: 'fast', isUserInput: false, delayAfter: 700 },
		{ type: 'success', text: 'Connection established.', speed: 'fast', isUserInput: false, delayAfter: 700 },
		{ type: 'prompt', text: 'get contact data --detailed', speed: 'human', isUserInput: true, delayAfter: 200 },
		{ type: 'error', text: 'Access denied.', speed: 'fast', isUserInput: false, delayAfter: 400 },
		{ type: 'prompt', text: 'sudo get contact data --detailed', speed: 'human', isUserInput: true, delayAfter: 100 },
		{ type: 'success', text: '200 OK', speed: 'fast', isUserInput: false, delayAfter: 300 }
	];
	
	let terminalLines = $state([]);
	let showCopiedMessage = $state(false);
	let terminalReady = $state(false);
	let showContactInfo = $state(false); // Show contact as separate block initially
	let userInput = $state('');
	let commandHistory = $state([]);
	let historyIndex = $state(-1);
	let terminalBodyRef;
	let inputRef;
	let isProcessingCommand = $state(false);
	let isInitialAnimation = $state(true); // Track if we're in initial animation
	let isInputFocused = $state(false); // Track if input is actually focused
	let hasLoadedFromSession = $state(false); // Track if we loaded from session
	
	const TERMINAL_STORAGE_KEY = 'contact-terminal-state';
	const TERMINAL_HISTORY_KEY = 'contact-terminal-history';
	
	// Load terminal state from sessionStorage
	function loadTerminalState() {
		if (typeof window === 'undefined') return null;
		
		try {
			const savedState = sessionStorage.getItem(TERMINAL_STORAGE_KEY);
			const savedHistory = sessionStorage.getItem(TERMINAL_HISTORY_KEY);
			
			return {
				lines: savedState ? JSON.parse(savedState) : null,
				history: savedHistory ? JSON.parse(savedHistory) : null
			};
		} catch (error) {
			console.error('Error loading terminal state:', error);
			return null;
		}
	}
	
	// Save terminal state to sessionStorage
	function saveTerminalState() {
		if (typeof window === 'undefined') return;
		
		try {
			sessionStorage.setItem(TERMINAL_STORAGE_KEY, JSON.stringify(terminalLines));
			sessionStorage.setItem(TERMINAL_HISTORY_KEY, JSON.stringify(commandHistory));
		} catch (error) {
			console.error('Error saving terminal state:', error);
		}
	}
	
	// Clear terminal state from sessionStorage
	function clearTerminalState() {
		if (typeof window === 'undefined') return;
		
		try {
			sessionStorage.removeItem(TERMINAL_STORAGE_KEY);
			sessionStorage.removeItem(TERMINAL_HISTORY_KEY);
		} catch (error) {
			console.error('Error clearing terminal state:', error);
		}
	}
	
	// Typing speeds
	const SPEED = {
		fast: 15,      // Computer output: 15ms per char (very fast, 90s terminal style)
		human: 80      // User input: 80ms per char (fast coder speed)
	};
	
	// Type text character by character
	async function typeText(text, speed = 'fast') {
		const delay = SPEED[speed];
		let result = '';
		for (let i = 0; i < text.length; i++) {
			result += text[i];
			await new Promise(resolve => setTimeout(resolve, delay));
		}
		return result;
	}
	
	// Scroll terminal to bottom
	async function scrollToBottom() {
		await tick();
		if (terminalBodyRef) {
			terminalBodyRef.scrollTop = terminalBodyRef.scrollHeight;
		}
	}
	
	// Execute terminal command via API
	async function executeCommand(command) {
		if (!command.trim()) return;
		
		// Add user command to terminal
		terminalLines = [...terminalLines, {
			type: 'prompt',
			text: command,
			typing: false,
			isUserInput: true
		}];
		
		isProcessingCommand = true;
		await scrollToBottom();
		
		try {
			// Call server-side API
			const response = await fetch('/api/terminal', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ command })
			});
			
			const data = await response.json();
			
			// Handle clear command
			if (data.clear) {
				terminalLines = [];
			} else if (data.response && data.response.length > 0) {
				// Add response lines
				terminalLines = [...terminalLines, ...data.response];
			}
			
			// Handle navigation
			if (data.navigate) {
				setTimeout(() => {
					if (data.external) {
						// Open external link in new tab
						window.open(data.navigate, '_blank', 'noopener,noreferrer');
					} else {
						// Internal navigation
						goto(data.navigate);
					}
				}, 2000);
			}
			
			await scrollToBottom();
		} catch (error) {
			console.error('Command execution error:', error);
			terminalLines = [...terminalLines, {
				type: 'error',
				text: 'Error: Could not execute command',
				typing: false
			}];
		} finally {
			isProcessingCommand = false;
			// Save terminal state after command execution
			saveTerminalState();
			// Restore focus to input after command execution
			await tick();
			if (inputRef) {
				inputRef.focus();
			}
		}
	}
	
	// Handle keyboard input
	function handleKeyDown(event) {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (userInput.trim() && !isProcessingCommand) {
				// Add to history
				commandHistory = [...commandHistory, userInput];
				historyIndex = commandHistory.length;
				
				// Execute command
				executeCommand(userInput);
				userInput = '';
			}
		} else if (event.key === 'ArrowUp') {
			event.preventDefault();
			if (historyIndex > 0) {
				historyIndex--;
				userInput = commandHistory[historyIndex];
			}
		} else if (event.key === 'ArrowDown') {
			event.preventDefault();
			if (historyIndex < commandHistory.length - 1) {
				historyIndex++;
				userInput = commandHistory[historyIndex];
			} else {
				historyIndex = commandHistory.length;
				userInput = '';
			}
		} else if (event.key === 'Tab') {
			event.preventDefault();
			// Could implement tab completion here
		}
	}
	
	// Handle focus change for keyboard navigation
	function handleInputFocus() {
		isInputFocused = true;
		if (onFocusChange) {
			onFocusChange(true); // Terminal is focused
		}
	}
	
	function handleInputBlur() {
		isInputFocused = false;
		if (onFocusChange) {
			onFocusChange(false); // Terminal is not focused
		}
	}
	
	// Focus terminal input when clicking on terminal body
	function handleTerminalClick() {
		if (terminalReady && inputRef) {
			inputRef.focus();
		}
	}
	
	// Main terminal animation sequence
	onMount(async () => {
		// Check if we have saved state from this session
		const savedState = loadTerminalState();
		
		if (savedState && savedState.lines && savedState.lines.length > 0) {
			// Restore saved state
			terminalLines = savedState.lines;
			commandHistory = savedState.history || [];
			historyIndex = commandHistory.length;
			terminalReady = true;
			isInitialAnimation = false;
			hasLoadedFromSession = true;
			
			// Scroll to bottom to show latest content
			await tick();
			await scrollToBottom();
			return;
		}
		
		// No saved state - run initial animation
		// Wait 2 seconds before starting
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		// Execute terminal scenario
		for (let i = 0; i < terminalScenario.length; i++) {
			const line = terminalScenario[i];
			
			// Add empty line with typing state
			terminalLines = [...terminalLines, { 
				type: line.type,
				text: '',
				typing: true,
				isUserInput: line.isUserInput
			}];
			
			const currentLineIndex = terminalLines.length - 1;
			
			// Type the text character by character
			for (let j = 0; j < line.text.length; j++) {
				await new Promise(resolve => setTimeout(resolve, SPEED[line.speed]));
				terminalLines = terminalLines.map((l, idx) => 
					idx === currentLineIndex 
						? { ...l, text: line.text.substring(0, j + 1) }
						: l
				);
			}
			
			// Mark line as complete (stop cursor)
			terminalLines = terminalLines.map((l, idx) => 
				idx === currentLineIndex 
					? { ...l, typing: false }
					: l
			);
			
			// Wait after line completes (if specified)
			if (line.delayAfter > 0) {
				await new Promise(resolve => setTimeout(resolve, line.delayAfter));
			}
		}
		
		// Terminal ready - add contact info as special terminal line type
		await new Promise(resolve => setTimeout(resolve, 300));
		
		// Add a special "contact-info" line type that will render the buttons
		terminalLines = [...terminalLines, { 
			type: 'contact-info', 
			typing: false 
		}];
		
		terminalReady = true;
		
		// Save initial state
		saveTerminalState();
		
		// Unlock scrolling after a brief delay to ensure content is rendered
		await new Promise(resolve => setTimeout(resolve, 100));
		isInitialAnimation = false; // Animation complete, allow scrolling
	});
	
	async function copyToClipboard(text, label) {
		try {
			await navigator.clipboard.writeText(text);
			const newLine = { type: 'success', text: `> ${label} copied to clipboard`, typing: false };
			terminalLines = [...terminalLines, newLine];
			showCopiedMessage = true;
			setTimeout(() => {
				showCopiedMessage = false;
			}, 2000);
			// Save state after adding message
			saveTerminalState();
		} catch (err) {
			const errorLine = { type: 'error', text: `> Failed to copy ${label}`, typing: false };
			terminalLines = [...terminalLines, errorLine];
			// Save state even on error
			saveTerminalState();
		}
	}
	
	async function handleDownloadResume() {
		const infoLine = { type: 'info', text: '> Downloading resume.pdf...', typing: false };
		terminalLines = [...terminalLines, infoLine];
		saveTerminalState();
		
		// Add success message after a short delay
		setTimeout(async () => {
			const successLine = { type: 'success', text: '> Download initiated', typing: false };
			terminalLines = [...terminalLines, successLine];
			saveTerminalState();
		}, 300);
	}
	
	const socialPlatforms = {
		linkedin: { name: 'LinkedIn', icon: 'linkedin' },
		github: { name: 'GitHub', icon: 'github' },
		twitter: { name: 'Twitter', icon: 'twitter' },
		mastodon: { name: 'Mastodon', icon: 'mastodon' },
		website: { name: 'Website', icon: 'globe' }
	};
</script>

<div class="contact-terminal">
	<div class="terminal-header">
		<div class="terminal-buttons">
			<span class="button close"></span>
			<span class="button minimize"></span>
			<span class="button maximize"></span>
		</div>
		<div class="terminal-title">contact_terminal.sh</div>
	</div>
	
	<div 
		class="terminal-body {isInitialAnimation ? 'locked' : ''}" 
		bind:this={terminalBodyRef}
		onclick={handleTerminalClick}
		role="button"
		tabindex="-1"
	>
		<!-- 1. Terminal output lines (command history at top) -->
		{#each terminalLines as line}
			{#if line.type === 'contact-info'}
				<!-- Contact info block as part of terminal history -->
				<div class="contact-info-block">
					<div class="contact-options">
						{#if email}
						<div class="contact-option">
							<button 
								class="terminal-button" 
								onclick={() => copyToClipboard(email, 'Email')}
								type="button"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
									<polyline points="22,6 12,13 2,6"></polyline>
								</svg>
								<span class="button-label">Email</span>
							</button>
							<code class="contact-value">{email}</code>
						</div>
					{/if}
				
					
					{#if phone}
						<div class="contact-option">
							<button 
								class="terminal-button" 
								onclick={() => copyToClipboard(phone, 'Phone')}
								type="button"
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
								</svg>
								<span class="button-label">Phone</span>
							</button>
							<code class="contact-value">{phone}</code>
						</div>
					{/if}
					
					{#if location}
						<div class="contact-option">
							<div class="terminal-button static">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
									<circle cx="12" cy="10" r="3"></circle>
								</svg>
								<span class="button-label">Location</span>
							</div>
							<code class="contact-value">{location}</code>
						</div>
					{/if}
					
					{#if resumeUrl}
						<div class="contact-option download">
							<a 
								href={resumeUrl} 
								download 
								class="terminal-button download-button"
								onclick={handleDownloadResume}
							>
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
									<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
									<polyline points="7 10 12 15 17 10"></polyline>
									<line x1="12" y1="15" x2="12" y2="3"></line>
								</svg>
								<span class="button-label">Download Resume</span>
							</a>
						</div>
					{/if}
				</div>
				
				{#if Object.keys(social).length > 0}
					<div class="social-links">
						<div class="terminal-line prompt">
							<span class="prompt-symbol">$</span>
							<span class="line-text">Social networks:</span>
						</div>
						<div class="social-buttons">
							{#each Object.entries(social) as [platform, url]}
								{#if url}
									<a 
										href={url} 
										target="_blank" 
										rel="noopener noreferrer"
										class="social-button"
										title={socialPlatforms[platform]?.name || platform}
									>
										<span class="social-label">{socialPlatforms[platform]?.name || platform}</span>
									</a>
								{/if}
							{/each}
						</div>
					</div>
				{/if}
				</div>
			{:else if line.type === 'donate-button'}
				<!-- Donate button -->
				<div class="donate-button-container">
					<a 
						href={line.url} 
						target="_blank"
						rel="noopener noreferrer"
						class="terminal-donate-button"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
						</svg>
						<span class="button-label">Open Donation Page</span>
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left: 0.5rem;">
							<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
							<polyline points="15 3 21 3 21 9"></polyline>
							<line x1="10" y1="14" x2="21" y2="3"></line>
						</svg>
					</a>
				</div>
			{:else}
				<!-- Regular terminal line -->
				<div class="terminal-line {line.type} {line.isUserInput ? 'user-input' : ''}">
					{#if line.isUserInput}
						<span class="prompt-symbol">$</span>
					{:else if line.type === 'prompt'}
						<span class="prompt-symbol">$</span>
					{:else if line.type === 'system'}
						<span class="system-symbol">[SYS]</span>
					{:else if line.type === 'success'}
						<span class="success-symbol">[OK]</span>
					{:else if line.type === 'error'}
						<span class="error-symbol">[FAIL]</span>
					{:else if line.type === 'info'}
						<span class="info-symbol">[INF]</span>
					{/if}
					<span class="line-text">{line.text}{#if line.typing}<span class="typing-cursor">█</span>{/if}</span>
				</div>
			{/if}
		{/each}		<!-- 3. Interactive input line (ALWAYS at very bottom, like real terminal) -->
		{#if terminalReady}
			<div class="terminal-input-line">
				<input
					bind:this={inputRef}
					bind:value={userInput}
					onkeydown={handleKeyDown}
					onfocus={handleInputFocus}
					onblur={handleInputBlur}
					class="terminal-input"
					type="text"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck="false"
					placeholder=""
					disabled={isProcessingCommand}
				/>
				{#if isInputFocused && !userInput}<span class="terminal-cursor">█</span>{/if}
				<span class="user-text">{userInput}</span>
				{#if isInputFocused && userInput}<span class="terminal-cursor">█</span>{/if}
			</div>
		{/if}
		
		<!-- Copied message (fixed position outside scroll) -->
		{#if showCopiedMessage}
			<div class="copied-message">
				<span class="success-symbol">[OK]</span>
				Copied to clipboard
			</div>
		{/if}
	</div>
</div>

<style>
	.contact-terminal {
		background: rgba(10, 14, 39, 0.95);
		border: 2px solid var(--color-neon-cyan);
		border-radius: 8px;
		box-shadow: 
			0 0 30px var(--color-glow-cyan),
			inset 0 0 60px rgba(0, 255, 240, 0.05);
		overflow: hidden;
		font-family: 'Share Tech Mono', monospace;
		position: relative;
		z-index: 10;
	}
	
	.terminal-header {
		background: rgba(0, 255, 240, 0.1);
		border-bottom: 1px solid var(--color-neon-cyan);
		padding: 0.75rem 1rem;
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	
	.terminal-buttons {
		display: flex;
		gap: 0.5rem;
	}
	
	.button {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 1px solid rgba(0, 255, 240, 0.5);
	}
	
	.button.close {
		background: rgba(255, 0, 110, 0.5);
	}
	
	.button.minimize {
		background: rgba(255, 187, 0, 0.5);
	}
	
	.button.maximize {
		background: rgba(0, 255, 0, 0.5);
	}
	
	.terminal-title {
		font-size: 0.875rem;
		color: var(--color-neon-cyan);
		letter-spacing: 1px;
	}
	
	.terminal-body {
		padding: 1.5rem;
		height: 600px; /* Fixed height instead of max-height */
		position: relative;
		overflow-y: auto;
		overflow-x: hidden;
		cursor: text;
		
		/* Custom scrollbar */
		scrollbar-width: thin;
		scrollbar-color: var(--color-neon-cyan) rgba(0, 0, 0, 0.3);
	}
	
	/* Lock scroll during initial animation */
	.terminal-body.locked {
		overflow-y: hidden;
	}
	
	.terminal-body::-webkit-scrollbar {
		width: 8px;
	}
	
	.terminal-body::-webkit-scrollbar-track {
		background: rgba(0, 0, 0, 0.3);
		border-radius: 4px;
	}
	
	.terminal-body::-webkit-scrollbar-thumb {
		background: var(--color-neon-cyan);
		border-radius: 4px;
		box-shadow: 0 0 10px var(--color-glow-cyan);
	}
	
	.terminal-body::-webkit-scrollbar-thumb:hover {
		background: var(--color-neon-pink);
		box-shadow: 0 0 15px var(--color-glow-pink);
	}
	
	.terminal-line {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 0.938rem;
		line-height: 1.5;
	}
	
	.terminal-line.user-input {
		color: var(--color-text);
	}
	
	.terminal-line.user-input .line-text {
		color: #00ff88; /* Green color for user commands */
		font-weight: 500;
	}
	
	.prompt-symbol,
	.system-symbol,
	.success-symbol,
	.error-symbol,
	.info-symbol {
		flex-shrink: 0;
		font-weight: bold;
	}
	
	.prompt-symbol {
		color: var(--color-neon-cyan);
	}
	
	.system-symbol {
		color: var(--color-neon-purple);
	}
	
	.success-symbol {
		color: #00ff88;
	}
	
	.error-symbol {
		color: var(--color-neon-pink);
	}
	
	.info-symbol {
		color: #ffbb00;
	}
	
	.line-text {
		color: var(--color-text);
	}
	
	.contact-info-block {
		margin: 2rem 0;
		animation: fadeIn 0.5s ease-out;
	}
	
	.contact-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.contact-option {
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	
	.contact-option.download {
		border-top: 1px solid rgba(0, 255, 240, 0.2);
		padding-top: 1rem;
	}
	
	.terminal-button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background: rgba(0, 255, 240, 0.05);
		border: 1px solid var(--color-neon-cyan);
		border-radius: 4px;
		color: var(--color-neon-cyan);
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all var(--transition-fast);
		text-decoration: none;
		white-space: nowrap;
		position: relative;
		z-index: 20;
		pointer-events: auto;
		-webkit-tap-highlight-color: rgba(0, 255, 240, 0.2);
		touch-action: manipulation;
	}
	
	.terminal-button:hover {
		background: rgba(0, 255, 240, 0.15);
		box-shadow: 0 0 15px var(--color-glow-cyan);
		transform: translateX(4px);
	}
	
	.terminal-button.static {
		cursor: default;
		opacity: 0.7;
	}
	
	.terminal-button.static:hover {
		transform: none;
	}
	
	.download-button {
		border-color: var(--color-neon-purple);
		color: var(--color-neon-purple);
	}
	
	.download-button:hover {
		box-shadow: 0 0 15px var(--color-glow-purple);
	}
	
	.donate-button-container {
		margin: 1rem 0;
		display: flex;
		justify-content: center;
	}
	
	.terminal-donate-button {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 1rem 2rem;
		background: rgba(255, 0, 110, 0.1);
		border: 2px solid var(--color-neon-pink);
		border-radius: 6px;
		color: var(--color-neon-pink);
		font-family: 'Share Tech Mono', monospace;
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
		cursor: pointer;
		transition: all var(--transition-fast);
		box-shadow: 0 0 10px var(--color-glow-pink);
		animation: pulse-pink 2s infinite;
	}
	
	.terminal-donate-button:hover {
		background: rgba(255, 0, 110, 0.2);
		box-shadow: 0 0 25px var(--color-glow-pink);
		transform: translateY(-2px) scale(1.05);
	}
	
	@keyframes pulse-pink {
		0%, 100% {
			box-shadow: 0 0 10px var(--color-glow-pink);
		}
		50% {
			box-shadow: 0 0 20px var(--color-glow-pink), 0 0 30px var(--color-glow-pink);
		}
	}
	
	.contact-value {
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		background: rgba(0, 255, 240, 0.05);
		padding: 0.25rem 0.5rem;
		border-radius: 3px;
	}
	
	.social-links {
		margin-top: 1.5rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(0, 255, 240, 0.2);
	}
	
	.social-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		margin-top: 1rem;
	}
	
	.social-button {
		padding: 0.5rem 1rem;
		background: rgba(185, 0, 255, 0.05);
		border: 1px solid var(--color-neon-purple);
		border-radius: 4px;
		color: var(--color-neon-purple);
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.875rem;
		text-decoration: none;
		transition: all var(--transition-fast);
	}
	
	.social-button:hover {
		background: rgba(185, 0, 255, 0.15);
		box-shadow: 0 0 15px var(--color-glow-purple);
		transform: translateY(-2px);
	}
	
	.terminal-input-line {
		display: flex;
		align-items: center;
		gap: 2px;
		margin-top: 1rem;
		padding-top: 0.5rem;
	}
	
	.terminal-input {
		position: absolute;
		left: -9999px;
		opacity: 0;
		pointer-events: none;
		width: 1px;
		height: 1px;
	}
	
	.user-text {
		color: #00ff88;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.938rem;
		font-weight: 500;
		white-space: pre;
	}
	
	.terminal-input::placeholder {
		color: transparent; /* Completely hide placeholder */
	}
	
	.terminal-input:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	
	.terminal-cursor {
		display: inline-block;
		color: var(--color-neon-cyan);
		animation: blink 1s infinite;
		font-size: 1rem;
		line-height: 1;
		flex-shrink: 0;
	}
	
	.typing-cursor {
		display: inline-block;
		color: var(--color-neon-cyan);
		animation: blink 0.5s infinite;
		margin-left: 2px;
	}
	
	@keyframes blink {
		0%, 49% {
			opacity: 1;
		}
		50%, 100% {
			opacity: 0;
		}
	}
	
	@keyframes typeIn {
		from {
			opacity: 0;
			transform: translateX(-10px);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}
	
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	
	.copied-message {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		padding: 1rem 1.5rem;
		background: rgba(10, 14, 39, 0.95);
		border: 2px solid #00ff88;
		border-radius: 6px;
		color: #00ff88;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.875rem;
		box-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
		animation: slideInUp 0.3s ease-out;
		z-index: 1000;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	
	@keyframes slideInUp {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.terminal-body {
			padding: 1rem;
			height: 500px; /* Fixed height on mobile too */
		}
		
		.contact-option {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
		
		.terminal-button {
			width: 100%;
			justify-content: center;
			padding: 1rem 1.5rem; /* Larger touch target */
			font-size: 1rem; /* Bigger text */
			min-height: 48px; /* Minimum touch target size */
		}
		
		.contact-value {
			width: 100%;
			text-align: center;
		}
		
		.social-buttons {
			flex-direction: column;
		}
		
		.social-button {
			width: 100%;
			text-align: center;
			min-height: 48px; /* Minimum touch target size */
			padding: 1rem;
		}
		
		.copied-message {
			bottom: 1rem;
			right: 1rem;
			left: 1rem;
		}
	}
</style>
