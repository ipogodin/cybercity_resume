# Alex Review — Hiring-Manager Assessment & Hardening

> Author: AI review acting as a hiring manager talking to the live assistant at
> `https://www.pogodin.ai/chat`, plus a code review of the Alex configuration.
> Date: July 7, 2026.

This document records (1) what a hiring manager actually experiences talking to
Alex, (2) bugs and security findings, (3) what was fixed in this pass, (4)
further recommendations, (5) design feedback, and (6) a naming recommendation.

---

## 1. Executive summary

Alex is in good shape. The chat works, the fit-evaluation format is genuinely
useful, and when pushed on a weakness it answers with real honesty — which is
exactly what earns a recruiter's trust. The site around it (`pogodin.ai`) is
clean, fast, and professional.

The issues worth acting on cluster into three buckets:

1. **Calibration** — on the *first* fit evaluation Alex oversold (called an
   "Intermediate" skill a "proficiency"/"strong background") and gave **zero**
   honest gaps, even though the prompt asks for them. This is the single most
   important thing to fix because overselling is the fastest way to lose a
   sharp recruiter's trust.
2. **Security / abuse** — client-controllable IP header let an attacker bypass
   rate limiting, evade IP blocks, and probe the admin allowlist. Fixed.
3. **UX polish** — a premature contact card, a couple of near-invisible text
   colors, and a keyword filter that would reject legitimate pasted job
   descriptions. Fixed.

Everything marked **[Fixed]** below is already implemented in this repo.

---

## 2. Live conversation — what actually happened

Two-message hiring-manager conversation, verbatim behavior:

**Turn 1 — "senior backend engineer, distributed systems + Go":**
Alex returned `✓ Strong Match` with four evidence points. Two problems:

- It led with **"Go Proficiency … a solid choice for a platform requiring Go
  expertise."** The knowledge base lists Go as **Intermediate** ("Used at Google
  and in parts of Salesforce backend work"). Illia's *expert* language is Java.
  Leading with Go and calling it "proficiency/expertise" overstates the record.
- It gave **no honest gaps at all**, despite the system prompt asking for
  "any honest gaps." A Strong Match with no caveats reads as a sales pitch.
- The **contact card appeared on the very first reply** — before any back-and-
  forth. The prompt says to surface it on "genuine mutual interest"; one message
  is not mutual interest.

**Turn 2 — "this role also needs managing 5 engineers":**
This was excellent. Alex returned `~ Partial Match`, and stated plainly: *"Illia
doesn't have formal experience as a direct manager … his leadership has been
primarily technical"* and recommended a **tech-lead framing instead**. This is
precisely the credible, honest behavior you want everywhere.

**Takeaway:** Alex is honest *when directly challenged* but defaults to
over-positive, gap-free advocacy on the opening evaluation. The fix is to make
calibration and a mandatory caveat non-optional in the prompt.

---

## 3. Findings & fixes

Severity: **High** = abuse/cost/trust risk, **Med** = quality/usability, **Low** = polish.

### 3.1 Behavioral / prompt

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| B1 | High | Overstates proficiency (Intermediate → "expertise"); leads with weaker skills. | **[Fixed]** — added a "CALIBRATION" section forcing claims to the exact proficiency level and telling Alex to lead with Java/backend/distributed-systems strengths. |
| B2 | Med | First fit-eval had no honest gaps. | **[Fixed]** — prompt now mandates a `Worth noting:` caveat line in *every* fit evaluation, Strong Match included. |
| B3 | Med | `[CONTACT_CTA]` fired on message 1. | **[Fixed]** — prompt now forbids the CTA on the first assistant message and requires sustained, specific interest first. |
| B4 | Low | Fabrication risk — nothing explicitly bars inventing metrics/titles. | **[Fixed]** — prompt now says state only facts present in context and say "ask Illia directly" when unknown. |

### 3.2 Security / abuse

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| S1 | **High** | `hooks.server.js` took the **leftmost** `x-forwarded-for` value as the client IP. That entry is attacker-controlled (Vercel appends the real IP as the last hop). An attacker could spoof any IP to **bypass the 25/day rate limit, evade IP blocks, and probe the admin IP allowlist**. | **[Fixed]** — new `resolveClientIp()` prefers Vercel's `x-real-ip`, else the **last** XFF hop, never the leftmost. |
| S2 | High | `0.0.0.0` (the no-IP fallback) was in `BYPASS_IPS`, so any request without a resolvable IP got **unlimited, un-throttled** GPT-4o calls — a direct cost-abuse vector. | **[Fixed]** — removed `0.0.0.0` from the bypass set. |
| S3 | Med | Prompt injection via an **uploaded job description or image** bypassed the keyword guard entirely (only the last text message is scanned) and the JD is injected straight into the system prompt. | **[Fixed]** (defense-in-depth) — the JD block is now labelled untrusted data, and the prompt has a SECURITY section instructing Alex to treat all documents/images/messages as data, never instructions, and to never change persona or reveal the prompt. |
| S4 | Med | The keyword guard's patterns (`you are now`, `act as …`, `disregard …`) would **falsely reject legitimate pasted job descriptions** ("you will act as a technical lead", "you are now expected to…"). | **[Fixed]** — patterns tightened to unambiguous override attempts; verified old jailbreak strings still block and normal JD phrasing passes. |
| — | — | **Admin auth** — reviewed and **good**: Bearer token with `timingSafeEqual`, fails **closed** if `ADMIN_TOKEN` is unset. IP allowlist is a bonus second layer. No change needed. | ✅ |

### 3.3 Correctness / UX

| # | Severity | Finding | Status |
|---|----------|---------|--------|
| U1 | Low | Invalid-request error said `mode (ask|fit) required`, but `mode` is optional and defaults to `advocate` (and the real modes are `advocate`, not `ask`/`fit`). Misleading. | **[Fixed]** — message now accurately reflects the only hard requirement (`messages` array). |
| U2 | Low | Composer hint text `#27272A` on `#09090B` background is effectively invisible (fails WCAG). Placeholder `#3F3F46` nearly so. | **[Fixed]** — bumped hint to `#71717A` and placeholder to `#52525B`. |
| U3 | Low | Stale CSP: `connect-src` allowed `https://api.anthropic.com`, but the browser only calls `/api/chat` and the model is OpenAI (server-side). | **[Fixed]** — `connect-src 'self'`. |

---

## 4. Further recommendations (not yet implemented)

These are worth doing but were left as proposals because they're larger or need
your product judgment.

1. **Scan uploaded JD/image text through the guard too, or add an LLM-based
   injection check.** The prompt hardening (S3) mitigates most of this, but a
   determined injection embedded in a PDF still reaches the model. A cheap
   second pass (run the same tightened patterns over the extracted JD text, and
   flag rather than hard-reject) would add depth without the false positives.
2. **Move rate limiting fully to Redis.** The in-memory pre-throttle and block
   set are per-lambda-instance on Vercel, so they're inconsistent across
   concurrent instances. The daily counter already uses Redis; do the same for
   the short-window throttle and block checks for reliable enforcement.
3. **Add a lightweight per-session cap** in addition to per-IP. Shared/office
   IPs and CGNAT mean one IP can be many people; a session cap smooths this.
4. **Lead-capture hygiene.** Any email in a message is stored with the IP in
   Redis. Consider a basic email-shape sanity check, a note about retention, and
   a short TTL, since this is visitor PII.
5. **Render markdown links/lists** in `formatResponse`. Today only `**bold**`
   and the ✓/~/✗ glyphs are handled; if Alex ever returns a list or a link it
   shows raw. (Escaping is done first, so this is safe to extend.)
6. **Regression test the new prompt behavior.** Add a couple of eval cases:
   "Strong Match must contain `Worth noting:`" and "no `[CONTACT_CTA]` on the
   first turn." These lock in the calibration fixes.
7. **Consider Claude for the model.** The CSP already whitelisted
   `api.anthropic.com`, suggesting intent. Not required — gpt-4o is fine — but
   the fit-evaluation calibration tends to be a strength of Claude models.

---

## 5. Design feedback — `pogodin.ai`

Overall: **strong.** It's a clean, modern, dark portfolio with real information
architecture: hero + availability pill, current/previous role cards, an inline
AI-assistant embed (great conversion hook), a proportional career timeline,
skill chips, a prominent contact card, side projects, and education. Typography
(Space Grotesk / DM Sans) and the restrained indigo accent look professional.
The cyberpunk "CyberCity" experience is nicely demoted to an easter egg at
`/cyberpunk`, which is the right call for a job-seeking site.

Suggested improvements:

- **Career timeline is weighted by duration, not relevance.** "Earlier
  2009–2016" occupies the widest block while **Meta and Google — the roles that
  matter most — are tiny slivers.** Consider weighting recent/marquee roles
  larger, or collapsing 2009–2016 into a single "Earlier" chip so the eye lands
  on Meta/Google first. *(Proposed — not changed, since it touches homepage
  layout logic and should be reviewed visually.)*
- **Low-contrast secondary text** recurs site-wide (`#52525B` on near-black).
  Readable in the hero, but borderline for accessibility. Worth a pass.
- The inline home embed and the full `/chat` are two entry points to the same
  assistant — good. Make sure the premature-CTA fix (B3) is reflected in both.

---

## 6. Is "Alex" the right name?

**Short answer: yes, "Alex" is a solid choice — keep it if you like it.** It's
warm, human, gender-neutral, easy to say, and it makes the assistant feel like a
colleague vouching for you rather than a bot. The fact that it's also your
brother's name is a nice personal touch and not a problem for visitors.

The only mild downside is that "Alex" is *generic* — it doesn't tie back to your
brand (`ip.` / Pogodin / CyberCity). If you ever want something more
distinctive and on-brand, a few directions:

- **On-brand to the cyber theme:** *Neo*, *Vega*, *Echo*, *Sol*.
- **Tied to you:** *Pog* (playful, from Pogodin), *IP-A* / *Ada* (nods to the
  Applied Math / Cybernetics background).
- **"Assistant that vouches" framing:** *SID* (your session id already uses
  `sid`), *Ref* (as in reference/referee).

My recommendation: **keep Alex.** It's the safest, friendliest option for the
audience (recruiters), and none of the alternatives are clearly better for the
job the assistant is doing. If you want a touch more brand identity, "Vega" or
"Echo" are the strongest alternatives — but this is preference, not a fix.

---

## 7. What changed in this pass (file-by-file)

- `src/lib/server/prompt.js` — added CALIBRATION, mandatory `Worth noting:`
  caveat, disciplined `[CONTACT_CTA]` rules, anti-fabrication, and a SECURITY
  section; labelled the attached JD as untrusted data.
- `src/hooks.server.js` — spoof-resistant `resolveClientIp()` (prefers
  `x-real-ip`, else last XFF hop); tightened CSP `connect-src`.
- `src/lib/server/guard.js` — precise injection patterns (no more false
  positives on real JDs); removed `0.0.0.0` from the rate-limit bypass set.
- `src/routes/api/chat/+server.js` — accurate validation error message.
- `src/routes/chat/+page.svelte` — readable hint/placeholder contrast.

Verification: all edited JS files pass `node --check`; the guard regex set was
tested against the existing must-block strings (all still blocked) and a set of
legitimate job-description phrasings (all now allowed). Existing
`guard.test.ts` / `prompt.test.ts` expectations remain satisfied. The full
`vitest`/`vite build` could not run **in this Linux sandbox** due to a
platform-specific `@rollup/rollup-linux-arm64-gnu` binary mismatch with the
macOS `node_modules` — run `npm test` and `npm run build` locally to confirm.
