<script>
	/**
	 * ProjectCard Component - Display project details
	 * @prop {Object} project - Project data object
	 */
	
	let { 
		project
	} = $props();
	
	const { 
		name, 
		description, 
		technologies = [], 
		links = {},
		image = null,
		status = 'completed',
		highlights = []
	} = project;
	
	const statusColors = {
		completed: '#00fff0',
		'in-progress': '#b900ff',
		archived: '#888888'
	};
	
	const statusLabels = {
		completed: 'Completed',
		'in-progress': 'In Progress',
		archived: 'Archived'
	};
</script>

<article class="project-card" style="--project-color: {statusColors[status] || statusColors.completed}">
	{#if image}
		<div class="project-image">
			<img src={image} alt={name} />
			<div class="image-overlay"></div>
		</div>
	{/if}
	
	<div class="project-content">
		<div class="project-header">
			<h3 class="project-name">{name}</h3>
			<span class="status-badge">{statusLabels[status]}</span>
		</div>
		
		<p class="project-description">{description}</p>
		
		{#if highlights.length > 0}
			<ul class="highlights-list">
				{#each highlights as highlight}
					<li class="highlight-item">{highlight}</li>
				{/each}
			</ul>
		{/if}
		
		{#if technologies.length > 0}
			<div class="technologies">
				<h4 class="tech-label">Tech Stack</h4>
				<div class="tech-tags">
					{#each technologies as tech}
						<span class="tech-tag">{tech}</span>
					{/each}
				</div>
			</div>
		{/if}
		
		{#if links && (links.github || links.demo || links.website)}
			<div class="project-links">
				{#if links.github}
					<a 
						href={links.github} 
						target="_blank" 
						rel="noopener noreferrer"
						class="project-link github"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
							<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
						</svg>
						<span>GitHub</span>
					</a>
				{/if}
				{#if links.demo}
					<a 
						href={links.demo} 
						target="_blank" 
						rel="noopener noreferrer"
						class="project-link demo"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<circle cx="12" cy="12" r="10"></circle>
							<polygon points="10 8 16 12 10 16 10 8"></polygon>
						</svg>
						<span>Live Demo</span>
					</a>
				{/if}
				{#if links.website}
					<a 
						href={links.website} 
						target="_blank" 
						rel="noopener noreferrer"
						class="project-link website"
					>
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
							<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
							<polyline points="15 3 21 3 21 9"></polyline>
							<line x1="10" y1="14" x2="21" y2="3"></line>
						</svg>
						<span>Website</span>
					</a>
				{/if}
			</div>
		{/if}
	</div>
</article>

<style>
	.project-card {
		background: rgba(26, 29, 63, 0.6);
		border: 2px solid var(--project-color);
		border-radius: 8px;
		overflow: hidden;
		transition: all var(--transition-normal);
		box-shadow: 
			0 0 20px rgba(0, 255, 240, 0.1),
			inset 0 0 40px rgba(0, 255, 240, 0.02);
		display: flex;
		flex-direction: column;
	}
	
	.project-card:hover {
		box-shadow: 
			0 0 30px var(--project-color),
			0 0 50px rgba(0, 255, 240, 0.2),
			inset 0 0 60px rgba(0, 255, 240, 0.05);
		transform: translateY(-4px);
		border-color: var(--project-color);
	}
	
	.project-image {
		position: relative;
		width: 100%;
		height: 200px;
		overflow: hidden;
		background: rgba(10, 14, 39, 0.8);
	}
	
	.project-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform var(--transition-slow);
	}
	
	.project-card:hover .project-image img {
		transform: scale(1.05);
	}
	
	.image-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			180deg,
			transparent 0%,
			rgba(26, 29, 63, 0.6) 100%
		);
		pointer-events: none;
	}
	
	.project-content {
		padding: 1.5rem;
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.project-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;
	}
	
	.project-name {
		margin: 0;
		font-family: 'Orbitron', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--project-color);
		text-transform: uppercase;
		letter-spacing: 1px;
		text-shadow: 0 0 10px var(--project-color);
		flex: 1;
	}
	
	.status-badge {
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		background: rgba(0, 255, 240, 0.1);
		border: 1px solid var(--project-color);
		border-radius: 3px;
		color: var(--project-color);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		white-space: nowrap;
	}
	
	.project-description {
		margin: 0;
		font-family: 'Rajdhani', sans-serif;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-text);
	}
	
	.highlights-list {
		margin: 0;
		padding-left: 1.5rem;
		list-style: none;
	}
	
	.highlight-item {
		position: relative;
		margin-bottom: 0.5rem;
		font-family: 'Rajdhani', sans-serif;
		font-size: 0.938rem;
		line-height: 1.5;
		color: var(--color-text-secondary);
	}
	
	.highlight-item:last-child {
		margin-bottom: 0;
	}
	
	.highlight-item::before {
		content: '▹';
		position: absolute;
		left: -1.5rem;
		color: var(--project-color);
		font-weight: bold;
	}
	
	.technologies {
		margin-top: auto;
	}
	
	.tech-label {
		margin: 0 0 0.5rem 0;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.875rem;
		font-weight: 600;
		color: var(--color-text-secondary);
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	.tech-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	
	.tech-tag {
		padding: 0.25rem 0.625rem;
		background: rgba(0, 255, 240, 0.05);
		border: 1px solid rgba(0, 255, 240, 0.3);
		border-radius: 4px;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.813rem;
		color: var(--color-neon-cyan);
		transition: all var(--transition-fast);
	}
	
	.tech-tag:hover {
		background: rgba(0, 255, 240, 0.15);
		border-color: var(--color-neon-cyan);
		box-shadow: 0 0 8px rgba(0, 255, 240, 0.3);
	}
	
	.project-links {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
		padding-top: 0.5rem;
		border-top: 1px solid rgba(0, 255, 240, 0.2);
	}
	
	.project-link {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 1rem;
		background: rgba(0, 255, 240, 0.05);
		border: 1px solid var(--project-color);
		border-radius: 4px;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.875rem;
		color: var(--project-color);
		text-decoration: none;
		transition: all var(--transition-fast);
	}
	
	.project-link:hover {
		background: rgba(0, 255, 240, 0.15);
		box-shadow: 0 0 15px var(--project-color);
		transform: translateY(-2px);
	}
	
	.project-link svg {
		flex-shrink: 0;
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.project-content {
			padding: 1.25rem;
		}
		
		.project-header {
			flex-direction: column;
			gap: 0.5rem;
		}
		
		.project-name {
			font-size: 1.25rem;
		}
		
		.project-image {
			height: 160px;
		}
		
		.project-links {
			flex-direction: column;
		}
		
		.project-link {
			justify-content: center;
		}
	}
</style>
