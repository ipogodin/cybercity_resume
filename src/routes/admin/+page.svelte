<script>
	let token = $state('');
	let authed = $state(false);
	let loginError = $state('');

	/** @type {import('$lib/types').AdminStats | null} */
	let stats = $state(null);
	/** @type {Array<{ip: string, reason: string, ttl: number|null}>} */
	let blockedList = $state([]);
	/** @type {Array<import('$lib/types').AbuseEvent>} */
	let abuseEvents = $state([]);
	/** @type {Array<import('$lib/types').LogEntry>} */
	let logEntries = $state([]);

	let blockIpInput = $state('');
	let blockError = $state('');
	let activeTab = $state('overview');
	let loading = $state(false);
	let expandedLog = $state(/** @type {number|null} */ (null));

	function authHeader() {
		return { Authorization: `Bearer ${token}` };
	}

	/** @param {boolean} [loadData] - whether to load all data after login (default true) */
	async function login(loadData = true) {
		loginError = '';
		try {
			// Ping endpoint: token check only, zero Redis, never hangs
			const res = await fetch('/api/admin/ping', { headers: authHeader() });
			if (res.status === 401) { loginError = 'Invalid token.'; return; }
			if (res.status === 403) { loginError = 'Access denied from this IP address.'; return; }
			if (!res.ok) { loginError = `Server error (${res.status}) — check ADMIN_TOKEN in Vercel env vars.`; return; }
			authed = true;
			sessionStorage.setItem('admin_token', token);
			if (loadData) await loadAll();
		} catch {
			loginError = 'Connection error.';
		}
	}

	async function loadAll() {
		loading = true;
		try {
			const [s, b, e, l] = await Promise.all([
				fetch('/api/admin/stats', { headers: authHeader() }).then(r => r.json()),
				fetch('/api/admin/blocked', { headers: authHeader() }).then(r => r.json()),
				fetch('/api/admin/events', { headers: authHeader() }).then(r => r.json()),
				fetch('/api/admin/log', { headers: authHeader() }).then(r => r.json())
			]);
			stats = s;
			blockedList = Array.isArray(b) ? b : [];
			abuseEvents = Array.isArray(e) ? e : [];
			logEntries = Array.isArray(l) ? l : [];
		} catch {
			/* non-fatal */
		} finally {
			loading = false;
		}
	}

	async function blockIp() {
		blockError = '';
		if (!blockIpInput.trim()) return;
		try {
			const res = await fetch('/api/admin/block', {
				method: 'POST',
				headers: { ...authHeader(), 'Content-Type': 'application/json' },
				body: JSON.stringify({ ip: blockIpInput.trim(), reason: 'manual' })
			});
			if (!res.ok) { blockError = 'Failed to block IP.'; return; }
			blockIpInput = '';
			await loadAll();
		} catch {
			blockError = 'Connection error.';
		}
	}

	/** @param {string} ip */
	async function unblockIp(ip) {
		try {
			await fetch('/api/admin/unblock', {
				method: 'POST',
				headers: { ...authHeader(), 'Content-Type': 'application/json' },
				body: JSON.stringify({ ip })
			});
			await loadAll();
		} catch { /* non-fatal */ }
	}

	// Restore token from session but don't auto-load data — wait for explicit refresh click
	import { onMount } from 'svelte';
	onMount(() => {
		const saved = sessionStorage.getItem('admin_token');
		if (saved) { token = saved; login(false); }
	});
</script>

<svelte:head>
	<title>Admin — CyberCity</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="page">
	{#if !authed}
		<div class="login-wrap">
			<div class="login-card">
				<h1>Admin</h1>
				<input
					type="password"
					bind:value={token}
					placeholder="Admin token"
					onkeydown={(e) => e.key === 'Enter' && login()}
					autocomplete="current-password"
				/>
				{#if loginError}<div class="error">{loginError}</div>{/if}
				<button onclick={login}>Login</button>
			</div>
		</div>
	{:else}
		<div class="dashboard">
			<header>
				<span class="logo">Admin Dashboard</span>
				<div class="tabs">
					{#each ['overview', 'blocked', 'events', 'log'] as tab}
						<button class:active={activeTab === tab} onclick={() => activeTab = tab}>{tab}</button>
					{/each}
				</div>
				<button class="load-btn" onclick={loadAll} disabled={loading}>
					{loading ? 'Loading…' : stats ? '↻ Refresh' : '↓ Load data'}
				</button>
			</header>

			{#if !stats && !loading}
				<div class="no-data">
					<p>Data not loaded — click <strong>↓ Load data</strong> to read from Redis.</p>
				</div>
			{/if}

			{#if activeTab === 'overview'}
				<div class="section">
					<div class="stat-grid">
						<div class="stat-card">
							<div class="stat-value">{stats?.blockedCount ?? '—'}</div>
							<div class="stat-label">Blocked IPs</div>
						</div>
						<div class="stat-card">
							<div class="stat-value">{stats?.abuseEvents ?? '—'}</div>
							<div class="stat-label">Abuse Events</div>
						</div>
					</div>
					<p class="vercel-note">For request logs and traffic see <a href="https://vercel.com/dashboard" target="_blank" rel="noopener">Vercel dashboard → Functions</a></p>
				</div>

			{:else if activeTab === 'blocked'}
				<div class="section">
					<h2>Block IP</h2>
					<div class="block-row">
						<input bind:value={blockIpInput} placeholder="IP address" onkeydown={(e) => e.key === 'Enter' && blockIp()} />
						<button onclick={blockIp}>Block</button>
					</div>
					{#if blockError}<div class="error">{blockError}</div>{/if}

					<h2>Blocked IPs ({blockedList.length})</h2>
					{#if blockedList.length === 0}
						<p class="empty">No blocked IPs.</p>
					{:else}
						<table>
							<thead><tr><th>IP</th><th>Reason</th><th>TTL (s)</th><th></th></tr></thead>
							<tbody>
								{#each blockedList as row}
									<tr>
										<td>{row.ip}</td>
										<td>{row.reason}</td>
										<td>{row.ttl ?? '∞'}</td>
										<td><button class="unblock-btn" onclick={() => unblockIp(row.ip)}>Unblock</button></td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>

			{:else if activeTab === 'events'}
				<div class="section">
					<h2>Abuse Events ({abuseEvents.length})</h2>
					{#if abuseEvents.length === 0}
						<p class="empty">No abuse events.</p>
					{:else}
						<table>
							<thead><tr><th>Time</th><th>IP</th><th>Rule</th><th>Snippet</th></tr></thead>
							<tbody>
								{#each abuseEvents as ev}
									<tr>
										<td class="mono">{new Date(ev.ts).toLocaleString()}</td>
										<td class="mono">{ev.ip}</td>
										<td class="rule">{ev.rule}</td>
										<td class="snippet">{ev.snippet}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					{/if}
				</div>

			{:else if activeTab === 'log'}
				<div class="section">
					<h2>Request Log <span class="count-badge">{logEntries.length}</span></h2>
					{#if logEntries.length === 0}
						<p class="empty">No log entries yet. Send a chat message and click Refresh.</p>
					{:else}
						<div class="log-list">
							{#each logEntries as entry, i}
								<div class="log-row" class:expanded={expandedLog === i}>
									<button class="log-row-header" onclick={() => expandedLog = expandedLog === i ? null : i}>
										<span class="log-time">{new Date(entry.ts).toLocaleString()}</span>
										<span class="log-ip mono">{entry.ip}</span>
										<span class="tag">{entry.mode ?? 'ask'}</span>
										<span class="log-preview">{entry.q ?? entry.request ?? ''}</span>
										<span class="log-chevron">{expandedLog === i ? '▲' : '▼'}</span>
									</button>
									{#if expandedLog === i}
										<div class="log-detail">
											<div class="log-section">
												<span class="log-label">Question</span>
												<p class="log-text">{entry.q ?? entry.request ?? '—'}</p>
											</div>
											<div class="log-section">
												<span class="log-label">Response</span>
												<p class="log-text">{entry.a ?? entry.response ?? '—'}</p>
											</div>
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	* { box-sizing: border-box; }
	:global(body) { margin: 0; background: #09090B; color: #E4E4E7; font-family: 'DM Sans', system-ui, sans-serif; }

	.page { min-height: 100vh; }

	/* Login */
	.login-wrap { display: flex; align-items: center; justify-content: center; min-height: 100vh; }
	.login-card {
		background: rgba(17,17,19,0.9); border: 1px solid rgba(255,255,255,0.08);
		border-radius: 16px; padding: 40px; width: 320px; display: flex; flex-direction: column; gap: 16px;
	}
	h1 { margin: 0; font-size: 24px; color: #FAFAFA; }
	input[type="password"], input:not([type]) {
		background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
		border-radius: 8px; color: #FAFAFA; font-size: 14px; padding: 10px 12px; width: 100%;
	}
	input:focus { outline: none; border-color: #6366F1; }
	button:not(.load-btn):not(.unblock-btn):not(.tabs button) {
		background: #6366F1; border: none; border-radius: 8px; color: #fff;
		font-size: 14px; font-weight: 600; padding: 10px 20px; cursor: pointer; transition: background 0.2s;
	}
	button:not(.load-btn):not(.unblock-btn):not(.tabs button):hover { background: #4F46E5; }
	.error { color: #f87171; font-size: 13px; }

	/* Dashboard */
	.dashboard { display: flex; flex-direction: column; min-height: 100vh; }
	header {
		display: flex; align-items: center; gap: 16px; padding: 16px 24px;
		background: rgba(17,17,19,0.9); border-bottom: 1px solid rgba(255,255,255,0.06); position: sticky; top: 0; z-index: 10;
	}
	.logo { font-weight: 700; font-size: 16px; color: #FAFAFA; white-space: nowrap; }
	.tabs { display: flex; gap: 4px; flex: 1; }
	.tabs button {
		background: transparent; border: none; color: #71717A;
		font-size: 13px; font-weight: 500; padding: 6px 14px; border-radius: 6px;
		cursor: pointer; transition: all 0.2s;
	}
	.tabs button:hover { color: #FAFAFA; }
	.tabs button.active { background: rgba(99,102,241,0.15); color: #818CF8; }
	.load-btn {
		background: #6366F1; border: none;
		border-radius: 6px; color: #fff; padding: 7px 16px; cursor: pointer;
		font-size: 13px; font-weight: 600; transition: background 0.2s; white-space: nowrap;
	}
	.load-btn:hover:not(:disabled) { background: #4F46E5; }
	.load-btn:disabled { opacity: 0.5; cursor: not-allowed; }
	.no-data {
		padding: 48px 24px; text-align: center; color: #52525B; font-size: 14px;
	}
	.no-data strong { color: #818CF8; }

	.section { padding: 24px; max-width: 1100px; }
	h2 { font-size: 15px; color: #A1A1AA; font-weight: 600; margin: 24px 0 12px; }

	.stat-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
	.stat-card {
		background: rgba(17,17,19,0.85); border: 1px solid rgba(255,255,255,0.08);
		border-radius: 12px; padding: 20px; text-align: center;
	}
	.stat-value { font-size: 32px; font-weight: 700; color: #FAFAFA; }
	.stat-label { font-size: 12px; color: #71717A; margin-top: 4px; }

	table { width: 100%; border-collapse: collapse; font-size: 13px; }
	th { text-align: left; padding: 8px 12px; color: #71717A; font-weight: 600; border-bottom: 1px solid rgba(255,255,255,0.06); }
	td { padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.04); color: #E4E4E7; }
	tr:hover td { background: rgba(255,255,255,0.02); }

	.block-row { display: flex; gap: 10px; align-items: center; }
	.block-row input { max-width: 240px; }
	.unblock-btn {
		background: rgba(239,68,68,0.1) !important; border: 1px solid rgba(239,68,68,0.3) !important;
		color: #f87171 !important; padding: 4px 10px !important; font-size: 12px !important;
	}
	.unblock-btn:hover { background: rgba(239,68,68,0.2) !important; }

	.log-entry {
		background: rgba(17,17,19,0.85); border: 1px solid rgba(255,255,255,0.06);
		border-radius: 10px; padding: 14px; margin-bottom: 10px;
	}
	.log-meta { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; margin-bottom: 8px; }
	.tag { background: rgba(99,102,241,0.15); color: #818CF8; border-radius: 4px; padding: 2px 8px; font-size: 11px; }
	.time, .tokens { color: #52525B; font-size: 11px; }
	.log-req { font-size: 13px; color: #A1A1AA; margin-bottom: 4px; }
	.log-res { font-size: 13px; color: #71717A; }
	.mono { font-family: 'Share Tech Mono', monospace; }
	.rule { font-size: 11px; color: #fbbf24; max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.snippet { font-size: 12px; color: #71717A; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
	.empty { color: #52525B; font-size: 14px; }

	.count-badge { font-size: 12px; color: #52525B; font-weight: 400; margin-left: 6px; }

	/* Log list */
	.log-list { display: flex; flex-direction: column; gap: 4px; }
	.log-row {
		border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; overflow: hidden;
		transition: border-color 0.2s;
	}
	.log-row:hover, .log-row.expanded { border-color: rgba(99,102,241,0.3); }
	.log-row-header {
		width: 100%; display: flex; align-items: center; gap: 12px;
		padding: 10px 14px; background: rgba(17,17,19,0.6);
		border: none; color: inherit; cursor: pointer; text-align: left;
		transition: background 0.15s;
	}
	.log-row-header:hover { background: rgba(99,102,241,0.06); }
	.log-time { font-size: 11px; color: #52525B; white-space: nowrap; flex-shrink: 0; }
	.log-ip { font-size: 12px; color: #71717A; white-space: nowrap; flex-shrink: 0; }
	.log-preview {
		flex: 1; font-size: 13px; color: #A1A1AA;
		overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
	}
	.log-chevron { font-size: 10px; color: #52525B; flex-shrink: 0; }

	.log-detail {
		padding: 14px 16px; display: flex; flex-direction: column; gap: 12px;
		background: rgba(9,9,11,0.6); border-top: 1px solid rgba(255,255,255,0.05);
	}
	.log-section { display: flex; flex-direction: column; gap: 4px; }
	.log-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #52525B; font-weight: 600; }
	.log-text { margin: 0; font-size: 13px; color: #E4E4E7; line-height: 1.6; white-space: pre-wrap; word-break: break-word; }
	.vercel-note { margin: 16px 0 0; font-size: 12px; color: #3F3F46; }
	.vercel-note a { color: #6366F1; text-decoration: none; }
	.vercel-note a:hover { text-decoration: underline; }

	@media (max-width: 768px) {
		.stat-grid { grid-template-columns: repeat(2, 1fr); }
		header { flex-wrap: wrap; }
		.section { padding: 16px; }
	}
</style>
