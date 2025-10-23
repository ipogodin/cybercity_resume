/**
 * Contact Information
 * Personal contact details and social links
 */

export const contact = {
	name: 'Illia Pogodin',
	email: 'illia.pogodin@gmail.com',
	phone: '206.484.4931',
	location: 'Seattle, WA',
	resumeUrl: '/resume.pdf',
	
	social: {
		linkedin: 'https://www.linkedin.com/in/ipogodin',
		github: '', // Add if you have a GitHub profile
		twitter: '', // Add if you have Twitter
		website: '' // Add if you have a personal website
	},
	
	tagline: 'Experienced Software Development Engineer and Architect with a 15 years track record of delivering Distributed and Mission-critical Systems in high-agility development environments.',
	
	availability: 'Currently employed at Meta',
	
	preferredContactMethod: 'email'
};

/**
 * Get contact email
 */
export function getEmail() {
	return contact.email;
}

/**
 * Get LinkedIn URL
 */
export function getLinkedIn() {
	return contact.social.linkedin;
}

/**
 * Get all social links (filtered to only those with values)
 */
export function getSocialLinks() {
	return Object.entries(contact.social)
		.filter(([, url]) => url && url.length > 0)
		.reduce((acc, [platform, url]) => {
			acc[platform] = url;
			return acc;
		}, {});
}

/**
 * Get full contact info
 */
export function getContact() {
	return contact;
}
