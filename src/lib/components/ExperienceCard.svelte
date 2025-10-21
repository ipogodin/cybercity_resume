<script>
	/**
	 * ExperienceCard Component - Display work experience details
	 * @prop {Object} experience - Experience data object
	 * @prop {boolean} [expanded=false] - Card expansion state
	 */
	
	let { 
		experience,
		expanded = $bindable(false)
	} = $props();
	
	function toggleExpanded() {
		expanded = !expanded;
	}
	
	const { 
		company, 
		role, 
		period, 
		location = null,
		description, 
		technologies = [], 
		achievements = [],
		neonColor = '#00fff0'
	} = experience;
</script>

<article class="experience-card" style="--card-color: {neonColor}">
	<button 
		class="card-header" 
		onclick={toggleExpanded}
		aria-expanded={expanded}
		type="button"
	>
		<div class="card-title">
			<h3 class="company-name">{company}</h3>
			<p class="role">{role}</p>
		</div>
		<div class="card-meta">
			<span class="period">{period}</span>
			{#if location}
				<span class="location">{location}</span>
			{/if}
		</div>
		<div class="expand-icon" class:expanded>
			<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2">
				<polyline points="6 8 10 12 14 8"></polyline>
			</svg>
		</div>
	</button>
	
	{#if expanded}
		<div class="card-body">
			<p class="description">{description}</p>
			
			{#if technologies.length > 0}
				<div class="technologies">
					<h4 class="section-title">Technologies</h4>
					<div class="tech-tags">
						{#each technologies as tech}
							<span class="tech-tag">{tech}</span>
						{/each}
					</div>
				</div>
			{/if}
			
			{#if achievements.length > 0}
				<div class="achievements">
					<h4 class="section-title">Key Achievements</h4>
					<ul class="achievement-list">
						{#each achievements as achievement}
							<li class="achievement-item">{achievement}</li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	{/if}
</article>

<style>
	.experience-card {
		background: rgba(26, 29, 63, 0.6);
		border: 2px solid var(--card-color);
		border-radius: 8px;
		margin-bottom: 1.5rem;
		overflow: hidden;
		transition: all var(--transition-normal);
		box-shadow: 
			0 0 20px rgba(0, 255, 240, 0.1),
			inset 0 0 40px rgba(0, 255, 240, 0.02);
	}
	
	.experience-card:hover {
		box-shadow: 
			0 0 30px var(--card-color),
			0 0 50px rgba(0, 255, 240, 0.2),
			inset 0 0 60px rgba(0, 255, 240, 0.05);
		transform: translateY(-2px);
	}
	
	.card-header {
		width: 100%;
		padding: 1.5rem;
		background: transparent;
		border: none;
		display: grid;
		grid-template-columns: 1fr auto auto;
		gap: 1rem;
		align-items: center;
		cursor: pointer;
		text-align: left;
		color: inherit;
		transition: background var(--transition-normal);
	}
	
	.card-header:hover {
		background: rgba(0, 255, 240, 0.05);
	}
	
	.card-title {
		grid-column: 1;
	}
	
	.company-name {
		margin: 0 0 0.5rem 0;
		font-family: 'Orbitron', sans-serif;
		font-size: 1.5rem;
		font-weight: 700;
		color: var(--card-color);
		text-transform: uppercase;
		letter-spacing: 1px;
		text-shadow: 0 0 10px var(--card-color);
	}
	
	.role {
		margin: 0;
		font-family: 'Rajdhani', sans-serif;
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--color-text-secondary);
	}
	
	.card-meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.25rem;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.875rem;
		color: var(--color-text-secondary);
	}
	
	.period {
		color: var(--card-color);
		font-weight: 600;
	}
	
	.expand-icon {
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--card-color);
		transition: transform var(--transition-normal);
	}
	
	.expand-icon.expanded {
		transform: rotate(180deg);
	}
	
	.card-body {
		padding: 0 1.5rem 1.5rem 1.5rem;
		animation: slideDown 0.3s ease-out;
	}
	
	@keyframes slideDown {
		from {
			opacity: 0;
			transform: translateY(-10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	
	.description {
		margin: 0 0 1.5rem 0;
		font-family: 'Rajdhani', sans-serif;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--color-text);
	}
	
	.section-title {
		margin: 0 0 0.75rem 0;
		font-family: 'Orbitron', sans-serif;
		font-size: 1rem;
		font-weight: 600;
		color: var(--card-color);
		text-transform: uppercase;
		letter-spacing: 1px;
	}
	
	.technologies {
		margin-bottom: 1.5rem;
	}
	
	.tech-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	
	.tech-tag {
		padding: 0.375rem 0.75rem;
		background: rgba(0, 255, 240, 0.1);
		border: 1px solid var(--card-color);
		border-radius: 4px;
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.875rem;
		color: var(--card-color);
		text-shadow: 0 0 5px var(--card-color);
		transition: all var(--transition-fast);
	}
	
	.tech-tag:hover {
		background: rgba(0, 255, 240, 0.2);
		box-shadow: 0 0 10px var(--card-color);
		transform: translateY(-1px);
	}
	
	.achievements {
		margin-bottom: 0;
	}
	
	.achievement-list {
		margin: 0;
		padding-left: 1.5rem;
		list-style: none;
	}
	
	.achievement-item {
		position: relative;
		margin-bottom: 0.75rem;
		font-family: 'Rajdhani', sans-serif;
		font-size: 1rem;
		line-height: 1.5;
		color: var(--color-text);
	}
	
	.achievement-item:last-child {
		margin-bottom: 0;
	}
	
	.achievement-item::before {
		content: '▹';
		position: absolute;
		left: -1.5rem;
		color: var(--card-color);
		font-weight: bold;
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.card-header {
			grid-template-columns: 1fr;
			gap: 0.75rem;
		}
		
		.card-meta {
			grid-column: 1;
			align-items: flex-start;
			flex-direction: row;
			gap: 1rem;
		}
		
		.expand-icon {
			position: absolute;
			top: 1.5rem;
			right: 1.5rem;
		}
		
		.company-name {
			font-size: 1.25rem;
		}
		
		.role {
			font-size: 1rem;
		}
		
		.card-body {
			padding: 0 1rem 1rem 1rem;
		}
	}
</style>
