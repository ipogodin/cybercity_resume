/**
 * Technical Skills Data
 * Organized by category with proficiency levels
 * Proficiency: expert | advanced | intermediate | familiar
 */

export const skillCategories = [
	{
		name: 'Languages',
		skills: [
			{ name: 'Java', proficiency: 'expert' },
			{ name: 'Python', proficiency: 'expert' },
			{ name: 'Scala', proficiency: 'advanced' },
			{ name: 'JavaScript', proficiency: 'advanced' },
			{ name: 'SQL', proficiency: 'advanced' },
			{ name: 'Bash/Shell', proficiency: 'advanced' }
		]
	},
	{
		name: 'Backend & Frameworks',
		skills: [
			{ name: 'Spring Framework', proficiency: 'expert' },
			{ name: 'Spring Boot', proficiency: 'expert' },
			{ name: 'Microservices', proficiency: 'expert' },
			{ name: 'REST APIs', proficiency: 'expert' },
			{ name: 'GraphQL', proficiency: 'expert' },
			{ name: 'Kafka', proficiency: 'advanced' },
			{ name: 'gRPC', proficiency: 'advanced' },
			{ name: 'JDBC/JPA', proficiency: 'advanced' },
			{ name: 'Hibernate', proficiency: 'advanced' }
		]
	},
	{
		name: 'Databases',
		skills: [
			{ name: 'PostgreSQL', proficiency: 'expert' },
			{ name: 'MySQL', proficiency: 'advanced' },
			{ name: 'Redis', proficiency: 'advanced' },
			{ name: 'MongoDB', proficiency: 'advanced' },
			{ name: 'Liquibase', proficiency: 'advanced' }
		]
	},
	{
		name: 'Infrastructure & Cloud',
		skills: [
			{ name: 'Kubernetes', proficiency: 'expert' },
			{ name: 'Docker', proficiency: 'expert' },
			{ name: 'AWS', proficiency: 'advanced' },
			{ name: 'GCP', proficiency: 'advanced' },
			{ name: 'Distributed Systems', proficiency: 'expert' },
			{ name: 'Apache Storm', proficiency: 'advanced' }
		]
	},
	{
		name: 'DevOps & Tools',
		skills: [
			{ name: 'Git', proficiency: 'expert' },
			{ name: 'CI/CD', proficiency: 'expert' },
			{ name: 'Maven', proficiency: 'advanced' },
			{ name: 'Gradle', proficiency: 'advanced' },
			{ name: 'Jenkins', proficiency: 'advanced' },
			{ name: 'Monitoring & Metrics', proficiency: 'expert' },
			{ name: 'Profiling', proficiency: 'advanced' }
		]
	},
	{
		name: 'Testing',
		skills: [
			{ name: 'JUnit', proficiency: 'expert' },
			{ name: 'Mockito', proficiency: 'expert' },
			{ name: 'TDD', proficiency: 'expert' },
			{ name: 'Integration Testing', proficiency: 'expert' },
			{ name: 'JBehave', proficiency: 'advanced' },
			{ name: 'Load Testing', proficiency: 'advanced' }
		]
	},
	{
		name: 'Architecture & Design',
		skills: [
			{ name: 'System Design', proficiency: 'expert' },
			{ name: 'Design Patterns', proficiency: 'expert' },
			{ name: 'Event-Driven Architecture', proficiency: 'expert' },
			{ name: 'High-Scale Systems', proficiency: 'expert' },
			{ name: 'Low-Latency Systems', proficiency: 'expert' },
			{ name: 'API Design', proficiency: 'expert' },
			{ name: 'Security', proficiency: 'advanced' }
		]
	},
	{
		name: 'Computer Science',
		skills: [
			{ name: 'Algorithms', proficiency: 'expert' },
			{ name: 'Data Structures', proficiency: 'expert' },
			{ name: 'Concurrent Programming', proficiency: 'expert' },
			{ name: 'Performance Optimization', proficiency: 'expert' }
		]
	},
	{
		name: 'Methodologies',
		skills: [
			{ name: 'Agile/Scrum', proficiency: 'expert' },
			{ name: 'Code Reviews', proficiency: 'expert' },
			{ name: 'Mentoring', proficiency: 'advanced' },
			{ name: 'Technical Leadership', proficiency: 'advanced' }
		]
	},
	{
		name: 'Web Technologies',
		skills: [
			{ name: 'HTML/CSS', proficiency: 'intermediate' },
			{ name: 'jQuery', proficiency: 'intermediate' },
			{ name: 'Tomcat', proficiency: 'advanced' },
			{ name: 'Jetty', proficiency: 'advanced' },
			{ name: 'JSP', proficiency: 'intermediate' }
		]
	}
];

/**
 * Get all skills flattened (without categories)
 */
export function getAllSkills() {
	return skillCategories.flatMap(category => 
		category.skills.map(skill => ({
			...skill,
			category: category.name
		}))
	);
}

/**
 * Get skills by proficiency level
 */
export function getSkillsByProficiency(proficiency) {
	return getAllSkills().filter(skill => skill.proficiency === proficiency);
}

/**
 * Get skills by category name
 */
export function getSkillsByCategory(categoryName) {
	const category = skillCategories.find(cat => cat.name === categoryName);
	return category ? category.skills : [];
}

/**
 * Get expert level skills
 */
export function getExpertSkills() {
	return getSkillsByProficiency('expert');
}
