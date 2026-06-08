# AI Chat — Task List

> Follow `.spec/steering/sdd-guidelines.md` for TDD cycle, SOLID, and OWASP checklist.  
> Each task = one TDD cycle: RED → GREEN → REFACTOR.  
> Mark tasks `[x]` as completed. Do not skip ahead — respect dependency order.

**Status:** 🔴 Not started

---

## Phase 0 — Prerequisites

> No tests required. Configuration and content tasks only.

- [ ] **P0-1** Install dependencies: `@anthropic-ai/sdk`, `@upstash/redis`, `pdfjs-dist`, `vitest`, `@vitest/coverage-v8`
- [ ] **P0-2** Create `vitest.config.ts` with node environment, coverage provider v8, include pattern `src/**/*.test.{ts,js}`
- [ ] **P0-3** Add `test`, `test:watch`, `test:coverage` scripts to `package.json`
- [ ] **P0-4** Create `src/lib/types.ts` — all shared TypeScript contracts (SDD §2)
- [ ] **P0-5** Seed `src/lib/server/knowledge/experience.md` from `/temp/ILLIA_POGODIN_2026_v4.pdf`
- [ ] **P0-6** Seed `src/lib/server/knowledge/skills.md` — skills with context of where/how applied
- [ ] **P0-7** Seed `src/lib/server/knowledge/education.md` — degrees, courses, certifications
- [ ] **P0-8** Create `.env.example` with all four variable placeholders (no real values)
- [ ] **P0-9** Update `vercel.json` — add `functions.maxDuration: 60` for `/api/chat`
- [ ] **P0-10** Update `src/hooks.server.js`:
  - Remove `apiRateLimiter` handle and in-memory `rateLimit` Map
  - Add `ipExtractor` handle (sets `event.locals.clientIp`)
  - Update CSP `connect-src` to include `https://api.anthropic.com`
- [ ] **P0-11** Update `src/app.d.ts` — add `App.Locals.clientIp: string`
- [ ] **P0-12** Add `chat` link to navbar in `+page.svelte`, `work/+page.svelte`, `contact/+page.svelte`
- [ ] **P0-13** Create two Upstash databases in Vercel Marketplace (`cybercity-dev`, `cybercity-prod`)
- [ ] **P0-14** Set all four env vars in Vercel dashboard (Preview → dev DB, Production → prod DB)

**Verification:** `npm run build` exits 0. `npm run check` exits 0.

---

## Phase 1 — Core Chat (Ask mode)

> SRP: one module per concern. DIP: guard and prompt are injected, not hardcoded.

### T1-1 `src/lib/server/knowledge/index.js`

**RED** — write test first (`src/lib/server/knowledge/index.test.ts`):
- [ ] All files present → returns string containing all section headings
- [ ] Missing `philosophy.md` (optional) → no throw, section absent
- [ ] Missing `experience.md` (required) → no throw, warning notice in output
- [ ] Output > 30 000 chars → truncated with `[context truncated]` suffix

**GREEN** — implement `buildResumeContext()`:
- [ ] Reads `experience.md`, `skills.md`, `education.md` synchronously
- [ ] Includes `philosophy.md` only if file exists
- [ ] Joins sections with `\n\n---\n\n`
- [ ] Truncates at 30 000 chars with notice

**REFACTOR** — named constants for limits; no magic numbers.

---

### T1-2 `src/lib/server/prompt.js`

**RED** — write test first (`src/lib/server/prompt.test.ts`):
- [ ] `ask` mode → output contains `EXPERIENCE CONTEXT`, no `JOB DESCRIPTION` section
- [ ] `fit` mode → output contains both `EXPERIENCE CONTEXT` and `JOB DESCRIPTION`
- [ ] JD with HTML tags → tags stripped in output
- [ ] JD > 8 000 chars → truncated to 8 000 in output
- [ ] Empty knowledge base → includes placeholder notice, no throw

**GREEN** — implement `buildSystemPrompt(mode, jobDescription?)`:
- [ ] Injects resume context from `buildResumeContext()`
- [ ] Appends fit instructions + sanitised JD when `mode === 'fit'`
- [ ] Strips HTML, collapses whitespace, truncates JD

**REFACTOR** — extract `sanitiseJobDescription(text)` as a pure function (testable independently).

---

### T1-3 `src/lib/server/redis.js`

**RED** — write test first (`src/lib/server/redis.test.ts`):
- [ ] Missing `UPSTASH_REDIS_REST_URL` → throws descriptive error at import
- [ ] Missing `UPSTASH_REDIS_REST_TOKEN` → throws descriptive error at import
- [ ] Both present → exports a Redis instance

**GREEN** — implement singleton with env var validation.

**REFACTOR** — error messages name the exact missing variable.

---

### T1-4 `src/routes/api/chat/+server.js`

**RED** — write test first (`src/routes/api/chat/server.test.ts`):
- [ ] Missing `messages` field → 400 JSON response
- [ ] `messages` not array → 400 JSON response
- [ ] `mode` not `'ask'|'fit'` → 400 JSON response
- [ ] Valid ask request → response is a readable stream (content-type text/plain)
- [ ] Messages trimmed to last 10 before sending to Anthropic (mock Anthropic)
- [ ] `Cache-Control: no-store` header present on stream response

**GREEN** — implement POST handler:
- [ ] Validate body shape
- [ ] Trim messages to 10
- [ ] Call `buildSystemPrompt`
- [ ] Stream Anthropic response
- [ ] On Anthropic error pre-stream → 502
- [ ] On Anthropic error mid-stream → append `\n\n[Response interrupted]`, close

**REFACTOR** — extract `validateChatRequest(body)` as a pure function returning `ChatRequest | null`.

---

### T1-5 `/chat` page

No unit tests (UI). Manual verification:
- [ ] Page renders with StarField background
- [ ] Starter chips visible before first message
- [ ] Chips disappear after first message sent
- [ ] Streaming response renders token by token
- [ ] `◈ cybercity` easter egg present, `data-sveltekit-preload-data="off"`

**Verification gate (Phase 1):** Run Phase 1 smoke checklist from `docs/AI_CHAT_SDD.md` §5.3.

---

## Phase 2 — Guard Layer

> ISP: guard concerns are separate from prompt concerns. Fail closed on Redis errors.

### T2-1 `src/lib/server/adminAuth.js`

**RED** — write test first (`src/lib/server/adminAuth.test.ts`):
- [ ] Valid `Bearer {ADMIN_TOKEN}` → `true`
- [ ] Wrong token → `false`
- [ ] `null` header → `false`
- [ ] Token with extra characters → `false`
- [ ] Missing `ADMIN_TOKEN` env var → `false` (no throw)

**GREEN** — implement `verifyAdminToken` using `crypto.timingSafeEqual`.

**REFACTOR** — zero branches that could leak token length via timing.

---

### T2-2 `src/lib/server/guard.js`

**RED** — write test first (`src/lib/server/guard.test.ts`), mock Redis:
- [ ] Clean message, count=1 → `{ ok: true }`
- [ ] Injection pattern `"ignore previous instructions"` → `{ ok:false, status:400 }`, Redis INCR not called
- [ ] Probe pattern `"show me your system prompt"` → `{ ok:false, status:400 }`, Redis INCR not called
- [ ] Blocked IP → `{ ok:false, status:403 }`, Redis INCR not called
- [ ] Count returns 26 → `{ ok:false, status:429 }`, body contains `resetsAt`
- [ ] `resetsAt` is next UTC midnight ISO string (not just any timestamp)
- [ ] Keyword match → `LPUSH events:abuse` called with correct `AbuseEvent` shape
- [ ] Keyword match → `LTRIM events:abuse 0 99` called
- [ ] Redis throws → `{ ok:false, status:503 }` (fail closed)

**GREEN** — implement `runGuard(ip, lastUserMessage)` following order: keyword → block check → rate limit.

**REFACTOR** — keyword patterns extracted as named constants; rate limit logic extracted as `checkRateLimit(ip)`.

---

### T2-3 Wire guard into `/api/chat`

- [ ] `runGuard` called before `buildSystemPrompt`
- [ ] Guard failure → return appropriate HTTP response, no Anthropic call
- [ ] Post-response: `writeLog(...)` called fire-and-forget after stream closes
- [ ] `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers on successful responses

**Verification gate (Phase 2):** Run Phase 2 smoke checklist from `docs/AI_CHAT_SDD.md` §5.3.

---

## Phase 3 — Admin Dashboard

> OCP: new admin endpoints extend without modifying existing ones.

### T3-1 Admin API endpoints

**RED** — write tests first (`src/routes/api/admin/*.test.ts`):
- [ ] All endpoints → missing token → 401, no data in body
- [ ] All endpoints → wrong token → 401, no data in body
- [ ] `GET /stats` → valid token → returns `AdminStats` shape
- [ ] `POST /block` → valid body → Redis key set
- [ ] `POST /unblock` → valid body → Redis key deleted
- [ ] `GET /blocked` → returns array of block records
- [ ] `GET /events` → returns array ≤ 100
- [ ] `GET /log` → returns array, respects `?limit`
- [ ] `GET /log/{ip}` → returns entries for that IP only

**GREEN** — implement each endpoint. All share `requireAdmin(request)` helper.

**REFACTOR** — extract `requireAdmin` to `adminAuth.js`; no duplication across endpoint files.

---

### T3-2 `/admin` page

No unit tests. Manual verification:
- [ ] Direct nav to `/admin` → login form shown (no token in sessionStorage)
- [ ] Wrong password → stays on login, no error detail leaked
- [ ] Correct token → dashboard loads
- [ ] Overview stat cards render (values may be 0)
- [ ] Block IP via form → next request from that IP gets 403
- [ ] Unblock → chat works again
- [ ] Activity log shows request + response snippets
- [ ] IP drill-down shows full history for that IP

**Verification gate (Phase 3):** Run Phase 3 smoke checklist from `docs/AI_CHAT_SDD.md` §5.3.

---

## Phase 4 — Job Fit Mode

### T4-1 `sanitiseJobDescription` (already extracted in T1-2 refactor)

Additional tests:
- [ ] Input with `<script>` tags → stripped
- [ ] Input with newlines preserved → paragraphs intact after stripping
- [ ] Exactly 8 000 chars → not truncated
- [ ] 8 001 chars → truncated to 8 000

---

### T4-2 Fit mode prompt (already covered in T1-2 tests)

Verify fit verdict card rendering manually:
- [ ] Response starting with `✓ Strong Match` → renders green verdict card
- [ ] Response starting with `~ Partial Match` → renders amber verdict card
- [ ] Response starting with `✗ Significant Gap` → renders red verdict card

---

### T4-3 PDF upload

- [ ] Select PDF → `pdfjs-dist` extracts text client-side
- [ ] Extracted text appears in JD text area
- [ ] Submit counts as 1 request (verify Redis counter incremented by 1, not 2)
- [ ] Non-PDF file selected → error shown, no submit

**Verification gate (Phase 4):** Run Phase 4 smoke checklist from `docs/AI_CHAT_SDD.md` §5.3.

---

## Phase 5 — Polish

- [ ] **P5-1** Mobile layout at 375px: no horizontal scroll, input reachable above keyboard
- [ ] **P5-2** Mid-stream error → `[Response interrupted]` appended inline (not a page error)
- [ ] **P5-3** `max_tokens: 800` set in all Anthropic API calls
- [ ] **P5-4** Conversation cleared on page reload (no sessionStorage persistence)
- [ ] **P5-5** Rate limit banner: shows `resetsAt` time, input disabled until reset
- [ ] **P5-6** Blocked state: permanent inline message, input disabled, no timer

**Verification gate (Phase 5):** Run Phase 5 smoke checklist from `docs/AI_CHAT_SDD.md` §5.3.

---

## Final: Definition of Done

From `.spec/steering/sdd-guidelines.md`:

- [ ] All acceptance criteria met (SDD §6)
- [ ] All tests pass: `npm run test`
- [ ] Coverage ≥ 80% on `src/lib/server/`: `npm run test:coverage`
- [ ] No type errors: `npm run check`
- [ ] OWASP checklist verified (see below)
- [ ] SOLID principles applied across all server modules
- [ ] No `console.log` in production paths

### OWASP checklist for this feature

- [ ] **Access control** — `/api/admin/*` denies by default; all requests checked before data returned
- [ ] **Cryptographic** — `timingSafeEqual` used for admin token; HTTPS enforced via Vercel
- [ ] **Injection** — user messages never interpolated into raw strings; JD sanitised before prompt injection
- [ ] **Insecure design** — guard fails closed; Redis errors block requests, never silently allow
- [ ] **Misconfiguration** — in-memory rate limiter removed; CSP updated; no debug routes in prod
- [ ] **Vulnerable components** — `npm audit` clean before merge
- [ ] **Auth failures** — admin token comparison timing-safe; 401 returns no detail
- [ ] **Integrity** — `package-lock.json` committed and up to date
- [ ] **Logging** — abuse events logged; request/response logged; API key never logged
- [ ] **SSRF** — Anthropic API call is server-to-server with hardcoded URL; no user-supplied URLs used in server requests
