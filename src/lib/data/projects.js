/**
 * Projects Data
 * Notable projects and contributions
 * Can be expanded with personal projects, open source, or public work
 */

export const projects = [
	{
		name: 'Meta Tupperware Rebalancer',
		description: 'Large-scale Tupperware(Kubernetes) infrastructure optimization service for AI training workloads across Meta\'s entire fleet. Handles resource allocation and rebalancing for mission-critical ML infrastructure.',
		technologies: [
			'TUpperware(Kubernetes)',
			'Python',
			'Distributed Systems',
			'AI/ML Infrastructure',
			'Monitoring'
		],
		highlights: [
			'Saves millions in annual operational costs',
			'Optimizes AI training resource allocation',
			'Handles Meta\'s entire fleet infrastructure'
		],
		status: 'in-progress',
		links: {}
	},
	{
		name: 'Google RCS Lawful Intercept Integration',
		description: 'Critical compliance infrastructure for Google Messages serving 1.6 billion users. Designed and implemented lawful intercept capabilities for RCS messaging platform in collaboration with legal teams.',
		technologies: [
			'Java',
			'Distributed Systems',
			'RCS Protocol',
			'Security',
			'Compliance'
		],
		highlights: [
			'Serves 1.6 billion active users',
			'Ensures regulatory compliance',
			'Handles sensitive legal requirements'
		],
		status: 'completed',
		links: {}
	},
	{
		name: 'Salesforce GraphQL Infrastructure',
		description: 'Enterprise-grade GraphQL platform serving major clients including Airbnb and Bank of America. Modular system enabling custom functionality injection and revenue-increasing features.',
		technologies: [
			'GraphQL',
			'Java',
			'Spring',
			'Microservices',
			'API Design'
		],
		highlights: [
			'Serves enterprise clients (Airbnb, Bank of America)',
			'Modular architecture for extensibility',
			'Comprehensive testing and monitoring'
		],
		status: 'completed',
		links: {}
	},
	{
		name: 'Salesforce Anti-Phishing Training System',
		description: 'Company-wide security training platform redesign. Eliminated critical vulnerabilities and improved training effectiveness across the organization.',
		technologies: [
			'Java',
			'Security',
			'Spring',
			'Backend Systems'
		],
		highlights: [
			'Company-wide impact',
			'Eliminated vulnerabilities costing hundreds of hours',
			'Improved security awareness'
		],
		status: 'completed',
		links: {}
	},
	{
		name: 'Wargaming Promotion Engine',
		description: 'Rebuilt promotion and pricing system for one of the world\'s largest gaming platforms. Increased flexibility, configurability, and performance for global player base.',
		technologies: [
			'Java',
			'Spring',
			'PostgreSQL',
			'Redis',
			'Microservices'
		],
		highlights: [
			'Serves millions of players globally',
			'Flexible pricing and promotion system',
			'High-throughput transaction processing'
		],
		status: 'completed',
		links: {}
	},
	{
		name: 'IGT Low-Latency Gaming Platform',
		description: 'High-performance microservices for gaming infrastructure. Achieved 10X latency reduction on critical services through architectural redesign and optimization.',
		technologies: [
			'Scala',
			'Java',
			'Microservices',
			'Low-latency Systems',
			'Performance Optimization'
		],
		highlights: [
			'10X latency reduction on key service',
			'High-throughput transaction processing',
			'Mission-critical gaming infrastructure'
		],
		status: 'completed',
		links: {}
	},
	{
		name: 'Distributed Anti-Fraud System (Belleron)',
		description: 'Apache Storm-based distributed computation solution for banking anti-fraud detection. Included full bank emulator system for load and functional testing.',
		technologies: [
			'Apache Storm',
			'Java',
			'Distributed Systems',
			'Banking',
			'Real-time Processing'
		],
		highlights: [
			'Real-time fraud detection',
			'Custom bank emulator for testing',
			'Distributed stream processing'
		],
		status: 'completed',
		links: {}
	},
	{
		name: 'Deutsche Bank Investment Platform Optimization',
		description: 'Performance optimization for Large Investment Fund Platform. Achieved 20% improvement in calculation execution time and improved DAO layer reliability.',
		technologies: [
			'Java',
			'Spring',
			'PostgreSQL',
			'Performance Optimization',
			'Financial Systems'
		],
		highlights: [
			'20% faster calculation execution',
			'Improved system reliability',
			'Enhanced supportability'
		],
		status: 'completed',
		links: {}
	}
];

/**
 * Get projects by status
 */
export function getProjectsByStatus(status) {
	return projects.filter(project => project.status === status);
}

/**
 * Get all active/in-progress projects
 */
export function getActiveProjects() {
	return getProjectsByStatus('in-progress');
}

/**
 * Get completed projects
 */
export function getCompletedProjects() {
	return getProjectsByStatus('completed');
}

/**
 * Get all projects
 */
export function getAllProjects() {
	return projects;
}
