/**
 * Work Experience Data
 * Structured data for all professional experience
 * Featured companies (Meta, Google) get detailed treatment
 * Earlier roles are summarized for brevity
 */

export const experience = [
	{
		company: 'Meta',
		role: 'Software Engineer L5',
		period: '2025 - Present',
		location: 'Bellevue, WA',
		description: 'Leading infrastructure optimization for Tupperware allocator - Internal Kubernetes managing Meta\'s entire fleet. Focused on AI training optimization and reliability improvements.',
		technologies: [
			'Kubernetes',
			'Python',
			'Distributed Systems',
			'Infrastructure',
			'Monitoring',
			'AI/ML Infrastructure'
		],
		achievements: [
			'Implemented rebalancer service for AI training optimization, saving several millions in annual operational costs',
			'Established comprehensive metrics for AI training allocation processes, significantly improving system observability',
			'Improved internal debugging tools, accelerating issue resolution and reducing daily operational costs',
			'Founded knowledge transfer group for comprehensive incident data sharing, improving cross-team communication and learning'
		],
		neonColor: '#00fff0', // Cyan - current role
		featured: true
	},
	{
		company: 'Google',
		role: 'Senior Software Engineer (TVC)',
		period: '2024',
		location: 'Bellevue, WA',
		description: 'Backend engineer for Google Messages serving 1.6 billion active users. Led critical infrastructure projects for RCS messaging platform including legal compliance and Apple ecosystem integration.',
		technologies: [
			'Java',
			'Distributed Systems',
			'RCS Protocol',
			'Backend Infrastructure',
			'API Design',
			'High-Scale Systems'
		],
		achievements: [
			'Designed and delivered lawful intercept integration for RCS messages in collaboration with legal teams, ensuring regulatory compliance',
			'Optimized infrastructure for 300 million Apple customers transitioning to Google\'s RCS platform',
			'Identified and resolved critical implementation flaws in edge cases, preventing potential service disruptions',
			'Designed integration flow simplifications, reducing complexity and improving developer experience'
		],
		neonColor: '#b900ff', // Purple
		featured: true
	},
	{
		company: 'Salesforce',
		role: 'Senior Member of Technical Staff',
		period: '2019 - 2023',
		location: 'Bellevue, WA',
		description: 'Senior engineer on Entity API team and Security team. Led GraphQL infrastructure development serving enterprise clients like Airbnb and Bank of America. Security champion overseeing quality for 15-25 engineers.',
		technologies: [
			'GraphQL',
			'Java',
			'REST APIs',
			'Spring',
			'Security',
			'Microservices',
			'Monitoring',
			'Testing'
		],
		achievements: [
			'Delivered GraphQL UI integration into Salesforce infrastructure for enterprise customers including Airbnb and Bank of America',
			'Designed modular GraphQL system enabling custom functionality injection, promoting code reusability and enabling revenue-increasing features',
			'Delivered comprehensive testing and monitoring strategy for REST and GraphQL APIs',
			'Supervised quality across two teams (15-25 engineers) as security champion',
			'Initiated security assessment process improvements, saving ~200 working hours annually',
			'Redesigned company-wide anti-phishing training system, eliminating vulnerabilities costing hundreds of hours yearly',
			'Delivered environment synchronization incident handling, significantly improving efficiency for mission-critical customer teams'
		],
		neonColor: '#ff006e', // Pink
		featured: false
	},
	{
		company: 'Wargaming',
		role: 'Senior Software Development Engineer',
		period: '2018 - 2019',
		location: 'Bellevue, WA',
		description: 'Game platform development team. Led redesign of promotion engine and core business systems for one of the world\'s largest gaming platforms.',
		technologies: [
			'Java',
			'Spring',
			'Microservices',
			'PostgreSQL',
			'Redis',
			'Game Backend'
		],
		achievements: [
			'Rebuilt and delivered Wargaming promotion engine serving millions of players',
			'Delivered business objects validation system engine',
			'Led redesign of pricing system for improved flexibility and configurability',
			'Rebuilt database structure for products definition platform',
			'Improved operation-log storage architecture'
		],
		neonColor: '#00ff88', // Green
		featured: false
	},
	{
		company: 'IGT (International Game Technology)',
		role: 'Software Development Engineer III',
		period: '2016 - 2018',
		location: 'Seattle, WA',
		description: 'Platform engineering team. Built low-latency, high-throughput microservices for gaming infrastructure. Led critical performance optimizations and standardization efforts.',
		technologies: [
			'Scala',
			'Java',
			'Microservices',
			'OSGI',
			'Low-latency Systems',
			'Metrics'
		],
		achievements: [
			'Designed and delivered low-latency, high-throughput microservices for IGT platform',
			'Redesigned key service achieving 10X latency reduction',
			'Code-reviewed, improved, and extended multiple critical services',
			'Migrated all OSGI monolith modules to unified Scala version',
			'Defined and delivered company-wide metrics standard library'
		],
		neonColor: '#ffbb00', // Gold
		featured: false
	},
	{
		company: 'Prior Experience',
		role: 'Software Development Engineer',
		period: '2010 - 2016',
		location: 'Europe',
		description: 'Multi-company experience across fintech, e-commerce, and IoT sectors including Deutsche Bank, Belleron, Alertme, Ocado, and E-Motion. Delivered high-impact solutions in diverse technical environments.',
		technologies: [
			'Java',
			'Spring',
			'Storm',
			'REST APIs',
			'PostgreSQL',
			'MongoDB',
			'Git',
			'Microservices'
		],
		achievements: [
			'Deutsche Bank: Optimized Large Investment Fund Platform - 20% faster calculation execution, improved DAO layer reliability',
			'Deutsche Bank: Led migration from SVN to Git, reducing dev-qa-dev cycle by 10%',
			'Belleron: Designed Storm-based distributed anti-fraud solution for large bank, including bank emulator for load testing',
			'Alertme: Developed high-throughput, low-latency REST API and UI for smart home technology startup',
			'Ocado: Delivered vacation/absence management module for large-scale workforce time management system',
			'E-Motion: Reworked call management UI to reduce backend hits by 60% while doubling test coverage'
		],
		neonColor: '#888888', // Gray - summarized experience
		featured: false
	}
];

/**
 * Get experience by company name
 */
export function getExperienceByCompany(companyName) {
	return experience.find(exp => exp.company === companyName);
}

/**
 * Get featured experiences (detailed)
 */
export function getFeaturedExperience() {
	return experience.filter(exp => exp.featured);
}

/**
 * Get all experiences
 */
export function getAllExperience() {
	return experience;
}
