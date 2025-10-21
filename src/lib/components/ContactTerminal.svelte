<script>
	/**
	 * ContactTerminal Component - Terminal-style contact interface
	 * @prop {Object} contact - Contact data object
	 */
	
	let { 
		contact = {}
	} = $props();
	
	const { 
		email = '',
		phone = '',
		location = '',
		resumeUrl = '/resume.pdf',
		social = {}
	} = contact;
	
	let terminalLines = $state([
		{ type: 'system', text: 'CONTACT TERMINAL v2.0.77' },
		{ type: 'system', text: 'Initializing secure connection...' },
		{ type: 'success', text: 'Connection established.' },
		{ type: 'prompt', text: 'Select communication channel:' }
	]);
	
	let showCopiedMessage = $state(false);
	
	async function copyToClipboard(text, label) {
		try {
			await navigator.clipboard.writeText(text);
			terminalLines = [
				...terminalLines,
				{ type: 'success', text: `> ${label} copied to clipboard` }
			];
			showCopiedMessage = true;
			setTimeout(() => {
				showCopiedMessage = false;
			}, 2000);
		} catch (err) {
			terminalLines = [
				...terminalLines,
				{ type: 'error', text: `> Failed to copy ${label}` }
			];
		}
	}
	
	function handleDownloadResume() {
		terminalLines = [
			...terminalLines,
			{ type: 'info', text: '> Downloading resume.pdf...' },
			{ type: 'success', text: '> Download initiated' }
		];
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
	
	<div class="terminal-body">
		<div class="terminal-output">
			{#each terminalLines as line}
				<div class="terminal-line {line.type}">
					{#if line.type === 'prompt'}
						<span class="prompt-symbol">$</span>
					{:else if line.type === 'system'}
						<span class="system-symbol">[SYS]</span>
					{:else if line.type === 'success'}
						<span class="success-symbol">[OK]</span>
					{:else if line.type === 'error'}
						<span class="error-symbol">[ERR]</span>
					{:else if line.type === 'info'}
						<span class="info-symbol">[INF]</span>
					{/if}
					<span class="line-text">{line.text}</span>
				</div>
			{/each}
		</div>
		
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
		
		{#if showCopiedMessage}
			<div class="copied-message">
				<span class="success-symbol">[OK]</span>
				Copied to clipboard
			</div>
		{/if}
		
		<div class="terminal-cursor">█</div>
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
		min-height: 400px;
		position: relative;
	}
	
	.terminal-output {
		margin-bottom: 2rem;
	}
	
	.terminal-line {
		display: flex;
		align-items: flex-start;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		font-size: 0.938rem;
		line-height: 1.5;
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
	
	.contact-options {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: 2rem;
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
	
	.contact-value {
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
		background: rgba(0, 255, 240, 0.05);
		padding: 0.25rem 0.5rem;
		border-radius: 3px;
	}
	
	.social-links {
		margin-top: 2rem;
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
	
	.terminal-cursor {
		display: inline-block;
		color: var(--color-neon-cyan);
		animation: blink 1s infinite;
		font-size: 1rem;
		line-height: 1;
	}
	
	@keyframes blink {
		0%, 49% {
			opacity: 1;
		}
		50%, 100% {
			opacity: 0;
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
			min-height: 300px;
		}
		
		.contact-option {
			flex-direction: column;
			align-items: flex-start;
			gap: 0.5rem;
		}
		
		.terminal-button {
			width: 100%;
			justify-content: center;
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
		}
		
		.copied-message {
			bottom: 1rem;
			right: 1rem;
			left: 1rem;
		}
	}
</style>
