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
	/** @type {Array<{ts:string, ip:string, email:string, q:string}>} */
	let leads = $state([]);

	let blockIpInput = $state('');
	let blockError = $state('');
	let activeTab = $state('overview');
	let loading = $state(false);
	let expandedLog = $state(/** @type {number|null} */ (null));
	let expandedSession = $state(/** @type {string|null} */ (null));
	let logSearch = $state('');
	let logDateFrom = $state('');
	let logDateTo = $state('');
	let logGroupBySid = $state(true);

	let filteredLog = $derived(() => {
		let entries = logEntries;

		if (logSearch.trim()) {
			const term = logSearch.toLowerCase();
			entries = entries.filter(e =>
				(e.q ?? '').toLowerCase().includes(term)
				|| (e.a ?? '').toLowerCase().includes(term)
				|| (e.ip ?? '').toLowerCase().includes(term)
				|| (e.sid ?? '').toLowerCase().includes(term)
			);
		}
		if (logDateFrom) {
			const from = new Date(logDateFrom).getTime();
			entries = entries.filter(e => new Date(e.ts).getTime() >= from);
		}
		if (logDateTo) {
			const to = new Date(logDateTo).getTime() + 86400000; // inclusive end of day
			entries = entries.filter(e => new Date(e.ts).getTime() <= to);
		}
		return entries;
	});

	/** Group entries by session ID, sorted by most recent session first */
	let sessionGroups = $derived(() => {
		/** @type {Map<string, typeof logEntries>} */
		const map = new Map();
		for (const e of filteredLog()) {
			const key = e.sid ?? `solo-${e.ts}`;
			if (!map.has(key)) map.set(key, []);
			map.get(key).push(e);
		}
		// Sort sessions by most recent message
		return [...map.entries()]
			.sort((a, b) => new Date(b[1][0].ts).getTime() - new Date(a[1][0].ts).getTime());
	});

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
			const [s, b, e, l, ld] = await Promise.all([
				fetch('/api/admin/stats', { headers: authHeader() }).then(r => r.json()),
				fetch('/api/admin/blocked', { headers: authHeader() }).then(r => r.json()),
				fetch('/api/admin/events', { headers: authHeader() }).then(r => r.json()),
				fetch('/api/admin/log', { headers: authHeader() }).then(r => r.json()),
				fetch('/api/admin/leads', { headers: authHeader() }).then(r => r.json())
			]);
			stats = s;
			blockedList = Array.isArray(b) ? b : [];
			abuseEvents = Array.isArray(e) ? e : [];
			logEntries = Array.isArray(l) ? l : [];
			leads = Array.isArray(ld) ? ld : [];
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
					{#each ['overview', 'leads', 'blocked', 'events', 'log'] as tab}
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

			{:else if activeTab === 'leads'}
				<div class="section">
					<h2>Leads <span class="count-badge">{leads.length}</span></h2>
					{#if leads.length === 0}
						<p class="empty">No leads yet. Contacts left by visitors in advocate mode appear here.</p>
					{:else}
						<div class="leads-list">
							{#each leads as lead}
								<div class="lead-card">
									<div class="lead-email">
										<a href="mailto:{lead.email}?subject=Following up on your interest in Illia Pogodin&body=Hi,%0A%0AThank you for reaching out via Illia's portfolio. I'd love to connect and discuss potential opportunities.%0A%0ABest,%0AIllia">{lead.email}</a>
									</div>
									<div class="lead-meta">
										<span class="mono">{lead.ip}</span>
										<span class="time">{new Date(lead.ts).toLocaleString()}</span>
									</div>
									{#if lead.q}
										<p class="lead-q">{lead.q}</p>
									{/if}
								</div>
							{/each}
						</div>
					{/if}
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
					<div class="log-header">
						<h2>Request Log <span class="count-badge">{filteredLog().length}{(logSearch || logDateFrom || logDateTo) ? ` of ${logEntries.length}` : ''}</span></h2>
						<div class="log-filters">
							<input
								class="log-search"
								type="search"
								bind:value={logSearch}
								placeholder="Search question, response, IP, session…"
								oninput={() => { expandedLog = null; expandedSession = null; }}
							/>
							<input class="log-date" type="date" bind:value={logDateFrom} title="From date" />
							<span class="date-sep">→</span>
							<input class="log-date" type="date" bind:value={logDateTo} title="To date" />
							<label class="group-toggle">
								<input type="checkbox" bind:checked={logGroupBySid} />
								Group by session
							</label>
						</div>
					</div>

					{#if filteredLog().length === 0}
						<p class="empty">{logEntries.length === 0 ? 'No log entries yet. Send a chat message and click Refresh.' : 'No results.'}</p>
					{:else if logGroupBySid}
						<!-- Session grouped view -->
						<div class="log-list">
							{#each sessionGroups() as [sid, entries]}
								{@const isSolo = sid.startsWith('solo-')}
								{@const isExpanded = expandedSession === sid}
								<div class="session-group" class:expanded={isExpanded}>
									<button class="session-header" onclick={() => expandedSession = expandedSession === sid ? null : sid}>
										<div class="session-meta">
											{#if !isSolo}
												<span class="session-id mono">{sid}</span>
											{/if}
											<span class="log-ip mono">{entries[0].ip}</span>
											<span class="tag">{entries.length} msg{entries.length > 1 ? 's' : ''}</span>
											<span class="log-time">{new Date(entries[0].ts).toLocaleString()}</span>
										</div>
										<span class="session-preview">{entries[0].q ?? entries[0].request ?? ''}</span>
										<span class="log-chevron">{isExpanded ? '▲' : '▼'}</span>
									</button>
									{#if isExpanded}
										<div class="session-messages">
											{#each entries as entry, i}
												<div class="session-msg">
													<div class="session-msg-meta">
														<span class="msg-num">#{i + 1}</span>
														<span class="log-time">{new Date(entry.ts).toLocaleString()}</span>
													</div>
													<div class="log-section">
														<span class="log-label">Q</span>
														<p class="log-text">{entry.q ?? entry.request ?? '—'}</p>
													</div>
													<div class="log-section">
														<span class="log-label">A</span>
														<p class="log-text">{entry.a ?? entry.response ?? '—'}</p>
													</div>
												</div>
											{/each}
										</div>
									{/if}
								</div>
							{/each}
						</div>
					{:else}
						<!-- Flat view -->
						<div class="log-list">
							{#each filteredLog() as entry, i}
								<div class="log-row" class:expanded={expandedLog === i}>
									<button class="log-row-header" onclick={() => expandedLog = expandedLog === i ? null : i}>
										<span class="log-time">{new Date(entry.ts).toLocaleString()}</span>
										<span class="log-ip mono">{entry.ip}</span>
										{#if entry.sid}<span class="session-badge mono">{entry.sid.slice(0,10)}</span>{/if}
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

	/* Leads */
	.leads-list { display: flex; flex-direction: column; gap: 10px; }
	.lead-card {
		background: rgba(17,17,19,0.85); border: 1px solid rgba(99,102,241,0.2);
		border-radius: 10px; padding: 14px 16px; display: flex; flex-direction: column; gap: 6px;
	}
	.lead-email a { font-size: 15px; font-weight: 600; color: #818CF8; text-decoration: none; }
	.lead-email a:hover { text-decoration: underline; }
	.lead-meta { display: flex; gap: 12px; align-items: center; }
	.lead-q { margin: 0; font-size: 12px; color: #71717A; font-style: italic; }

	.log-header { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
	.log-header h2 { margin: 0; }
	.log-filters { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
	.log-search {
		flex: 1; min-width: 180px;
		background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
		border-radius: 7px; color: #FAFAFA; font-size: 13px; padding: 7px 12px;
		font-family: inherit; transition: border-color 0.2s;
	}
	.log-search:focus { outline: none; border-color: rgba(99,102,241,0.5); }
	.log-search::placeholder { color: #52525B; }
	.log-date {
		background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
		border-radius: 7px; color: #FAFAFA; font-size: 13px; padding: 7px 10px;
		font-family: inherit; transition: border-color 0.2s; cursor: pointer;
		color-scheme: dark;
	}
	.log-date:focus { outline: none; border-color: rgba(99,102,241,0.5); }
	.date-sep { color: #52525B; font-size: 12px; }
	.group-toggle { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #71717A; cursor: pointer; white-space: nowrap; }
	.group-toggle input { accent-color: #6366F1; cursor: pointer; }

	/* Session groups */
	.session-group { border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; overflow: hidden; margin-bottom: 4px; transition: border-color 0.2s; }
	.session-group:hover, .session-group.expanded { border-color: rgba(99,102,241,0.3); }
	.session-header {
		width: 100%; display: flex; flex-direction: column; gap: 4px;
		padding: 10px 14px; background: rgba(17,17,19,0.6);
		border: none; color: inherit; cursor: pointer; text-align: left; transition: background 0.15s;
	}
	.session-header:hover { background: rgba(99,102,241,0.06); }
	.session-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
	.session-id { font-size: 11px; color: #6366F1; }
	.session-preview { font-size: 13px; color: #A1A1AA; text-overflow: ellipsis; overflow: hidden; white-space: nowrap; max-width: 100%; }
	.session-badge { font-size: 10px; color: #6366F1; background: rgba(99,102,241,0.12); padding: 1px 6px; border-radius: 4px; }
	.session-messages { display: flex; flex-direction: column; gap: 0; border-top: 1px solid rgba(255,255,255,0.05); }
	.session-msg { padding: 12px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); display: flex; flex-direction: column; gap: 8px; }
	.session-msg:last-child { border-bottom: none; }
	.session-msg-meta { display: flex; gap: 10px; align-items: center; }
	.msg-num { font-size: 11px; color: #52525B; font-weight: 600; }

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
