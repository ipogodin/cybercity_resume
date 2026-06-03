<script>
	import '../app.css';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" type="image/png" href="/images/icons/favicon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png" />
	<link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon.png" />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
	<title>Illia Pogodin — Software Engineer</title>
	<meta name="description" content="Principal / Staff Software Engineer. 15+ years building distributed, mission-critical platforms at Meta, Google, and enterprise scale." />
	<meta property="og:title" content="Illia Pogodin — Software Engineer" />
	<meta property="og:description" content="15+ years at Meta, Google, Salesforce. Seattle, WA." />
</svelte:head>

{@render children()}
