/**
 * Education and Credentials Data
 */

export const education = [
	{
		degree: 'Master of Science in Applied Mathematics',
		institution: 'National University of Ukraine',
		faculty: 'Faculty of Cybernetics',
		location: 'Kyiv, Ukraine',
		period: 'Graduated',
		description: 'Advanced studies in applied mathematics with focus on cybernetics, algorithms, and computational theory.',
		highlights: [
			'Specialized in Applied Mathematics',
			'Focus on Cybernetics and Computational Systems',
			'Advanced Algorithm Theory'
		],
		neonColor: '#00fff0'
	}
];

/**
 * Certifications (can be added as needed)
 */
export const certifications = [
	// Add certifications here as needed
	// Example:
	// {
	//   name: 'AWS Certified Solutions Architect',
	//   issuer: 'Amazon Web Services',
	//   date: '2023',
	//   credentialId: 'ABC123',
	//   credentialUrl: 'https://...'
	// }
];

/**
 * Relevant coursework or training
 */
export const additionalTraining = [
	{
		name: 'Advanced Distributed Systems',
		description: 'Large-scale distributed systems design and implementation'
	},
	{
		name: 'Algorithm Design & Analysis',
		description: 'Advanced algorithms, data structures, and complexity theory'
	},
	{
		name: 'Concurrent Programming',
		description: 'Multi-threaded and parallel programming paradigms'
	}
];

/**
 * Get education summary
 */
export function getEducationSummary() {
	return {
		degree: education[0]?.degree || '',
		institution: education[0]?.institution || '',
		location: education[0]?.location || ''
	};
}

/**
 * Get all education
 */
export function getAllEducation() {
	return education;
}

/**
 * Get all certifications
 */
export function getAllCertifications() {
	return certifications;
}
