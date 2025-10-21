<script>
	/**
	 * SkillGrid Component - Display categorized skills with proficiency
	 * @prop {Array} skillCategories - Array of skill category objects
	 * @prop {boolean} [showProficiency=true] - Show proficiency indicators
	 */
	
	let { 
		skillCategories = [],
		showProficiency = true
	} = $props();
	
	const proficiencyLabels = {
		expert: 'Expert',
		advanced: 'Advanced',
		intermediate: 'Intermediate',
		familiar: 'Familiar'
	};
	
	const proficiencyColors = {
		expert: '#00fff0',
		advanced: '#b900ff',
		intermediate: '#ff006e',
		familiar: '#888888'
	};
</script>

<div class="skill-grid">
	{#each skillCategories as category}
		<div class="skill-category">
			<h3 class="category-title">{category.name}</h3>
			<div class="skills-list">
				{#each category.skills as skill}
					<div class="skill-item" style="--skill-color: {proficiencyColors[skill.proficiency] || proficiencyColors.familiar}">
						<div class="skill-header">
							<span class="skill-name">{skill.name}</span>
							{#if showProficiency && skill.proficiency}
								<span class="proficiency-badge" title={proficiencyLabels[skill.proficiency]}>
									{proficiencyLabels[skill.proficiency]}
								</span>
							{/if}
						</div>
						{#if showProficiency && skill.proficiency}
							<div class="proficiency-bar">
								<div 
									class="proficiency-fill" 
									style="width: {skill.proficiency === 'expert' ? '100%' : skill.proficiency === 'advanced' ? '75%' : skill.proficiency === 'intermediate' ? '50%' : '25%'}"
								></div>
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}
</div>

<style>
	.skill-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		padding: 1rem 0;
	}
	
	.skill-category {
		background: rgba(26, 29, 63, 0.4);
		border: 2px solid rgba(0, 255, 240, 0.3);
		border-radius: 8px;
		padding: 1.5rem;
		transition: all var(--transition-normal);
		box-shadow: 
			0 0 20px rgba(0, 255, 240, 0.1),
			inset 0 0 40px rgba(0, 255, 240, 0.02);
	}
	
	.skill-category:hover {
		border-color: rgba(0, 255, 240, 0.6);
		box-shadow: 
			0 0 30px rgba(0, 255, 240, 0.2),
			inset 0 0 60px rgba(0, 255, 240, 0.05);
		transform: translateY(-2px);
	}
	
	.category-title {
		margin: 0 0 1.25rem 0;
		font-family: 'Orbitron', sans-serif;
		font-size: 1.25rem;
		font-weight: 700;
		color: var(--color-neon-cyan);
		text-transform: uppercase;
		letter-spacing: 2px;
		text-shadow: 0 0 10px var(--color-glow-cyan);
		border-bottom: 2px solid rgba(0, 255, 240, 0.3);
		padding-bottom: 0.75rem;
	}
	
	.skills-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	
	.skill-item {
		background: rgba(10, 14, 39, 0.6);
		border: 1px solid var(--skill-color);
		border-radius: 6px;
		padding: 0.875rem;
		transition: all var(--transition-fast);
	}
	
	.skill-item:hover {
		background: rgba(10, 14, 39, 0.8);
		box-shadow: 
			0 0 15px var(--skill-color),
			inset 0 0 30px rgba(0, 255, 240, 0.05);
		transform: translateX(4px);
	}
	
	.skill-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
	}
	
	.skill-name {
		font-family: 'Rajdhani', sans-serif;
		font-size: 1.125rem;
		font-weight: 600;
		color: var(--color-text);
	}
	
	.proficiency-badge {
		font-family: 'Share Tech Mono', monospace;
		font-size: 0.75rem;
		padding: 0.25rem 0.5rem;
		background: rgba(0, 255, 240, 0.1);
		border: 1px solid var(--skill-color);
		border-radius: 3px;
		color: var(--skill-color);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		text-shadow: 0 0 5px var(--skill-color);
	}
	
	.proficiency-bar {
		width: 100%;
		height: 4px;
		background: rgba(0, 255, 240, 0.1);
		border-radius: 2px;
		overflow: hidden;
		position: relative;
	}
	
	.proficiency-fill {
		height: 100%;
		background: var(--skill-color);
		box-shadow: 0 0 10px var(--skill-color);
		transition: width var(--transition-slow);
		border-radius: 2px;
		position: relative;
		overflow: hidden;
	}
	
	.proficiency-fill::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.3),
			transparent
		);
		animation: shimmer 2s infinite;
	}
	
	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
	
	/* Tablet adjustments */
	@media (max-width: 1024px) {
		.skill-grid {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 1.5rem;
		}
	}
	
	/* Mobile adjustments */
	@media (max-width: 768px) {
		.skill-grid {
			grid-template-columns: 1fr;
			gap: 1.5rem;
		}
		
		.skill-category {
			padding: 1.25rem;
		}
		
		.category-title {
			font-size: 1.125rem;
			letter-spacing: 1px;
		}
		
		.skill-name {
			font-size: 1rem;
		}
		
		.proficiency-badge {
			font-size: 0.688rem;
			padding: 0.188rem 0.375rem;
		}
	}
</style>
