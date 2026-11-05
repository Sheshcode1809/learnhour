# Learnhour production checklist

**Reviewed:** 2026-11-05
**Decision:** **NOT READY for public launch.** Local-first features, browser journeys, and responsive layouts pass, but legal/operator configuration, repository license, online dependency scan, and live cloud provider setup remain incomplete.

Status: **READY** = verified in this audit; **NEEDS CONFIGURATION** = owner/provider setup required; **BLOCKED** = required implementation or evidence is missing; **NOT APPLICABLE** = not used by the intended release.

## Application and data

- [x] Local-first routes and learning flows are present; records use browser local storage.
- [x] Production initialization initializes empty arrays (`[]`) without seeding demo courses or sessions.
- [x] Storage record shape checks and visible read/write failure feedback are implemented.
- [x] Course progress, streak, timer state, and YouTube URL tests pass in the 22-test unit suite (`npm test`).
- [x] Full browser journeys for course CRUD, timer start/pause/resume/refresh/finish, and JSON export verified in disposable browser profile (`scripts/test-browser-journeys.mjs`).
- [ ] Storage quota/blocked-storage handling in a browser.
- [ ] Cross-midnight active timer attribution decision and test (intervals across midnight).
- [ ] Cloud learning-data synchronization. No application database CRUD exists; mark cloud sync **BLOCKED** if required for launch.
- [ ] Supabase schema compatibility, database connectivity, and user-isolation/RLS tests in staging.

## Authentication and security

- [x] Dedicated `/auth/callback` page created and verified in production build.
- [x] Supabase Auth is off by default and gated by explicit configuration.
- [x] YouTube parsing requires HTTPS and supported hostnames; playlist routes are rejected.
- [x] All 3 curated YouTube presets verified live (HTTP 200); external player fallback link present.
- [x] Security headers and safe error UI are configured in source.
- [x] `npm audit --offline` reported 0 vulnerabilities from the local cache.
- [ ] Live Supabase Google OAuth provider setup (currently returns `400 Unsupported provider`).
- [ ] Current online dependency audit; npm registry DNS was unavailable (`ENOTFOUND`).
- [ ] Release-candidate secret-history scan using the owner's approved workflow.
- [ ] Verify actual HTTPS, headers, and browser policies on the final deployment domain.

## UI, accessibility, and performance

- [x] Existing supplied screenshots reviewed; mobile dashboard timer overlap and player header collision were identified and addressed in source.
- [x] Responsive audit script checked 13 routes at 360, 390, 768, 1024, 1440, and 1920px with 0 errors and 0 horizontal overflows (`scripts/test-responsive.mjs`). All files in `screenshots/` preserved.
- [ ] Keyboard-only, screen-reader, reduced-motion, contrast, and touch-target review.
- [ ] Lighthouse/Core Web Vitals measurement on the final candidate.
- [ ] Decide whether to bundle Plus Jakarta Sans and JetBrains Mono locally. Current system stacks differ from the original design spec.

## Public launch and operations

- [x] Learnhour metadata and generated Open Graph image exist.
- [x] Auth/private routes are noindex; sitemap/robots require a configured origin and exclude draft legal pages.
- [ ] Set and verify the canonical HTTPS `NEXT_PUBLIC_APP_URL`.
- [ ] Set a monitored `NEXT_PUBLIC_SUPPORT_EMAIL`.
- [ ] Complete and approve Privacy Notice and Terms. Current pages are drafts, not legal advice or reviewed policy.
- [ ] Repository owner selects and adds a license; no `LICENSE` file is present.
- [ ] Confirm whether launch is local-only or requires sync; keep claims aligned with the selected scope.
- [ ] Confirm canonical Git remote and release process. No commit, push, or release was performed.
- [ ] Complete final CI and smoke checks on a deployment candidate.

## Commands and results

| Command | Result |
|---|---|
| `npm install --offline --no-audit --no-fund` | PASS, dependencies up to date from cache |
| `npm test` | PASS, 22/22 tests |
| `npx tsc --noEmit` | PASS |
| `npm run lint` | PASS, no warnings/errors |
| `npm run build` | PASS, 15 routes generated (87.3 kB shared JS) |
| `npm audit --offline` | 0 vulnerabilities reported from local cache |
| Online `npm audit` | BLOCKED by registry DNS failure (`ENOTFOUND`) |
| Responsive browser audit | PASS; 13 routes × 6 viewports, 0 errors/overflows (`scripts/test-responsive.mjs`) |
| Browser journeys | PASS; timer, course CRUD, session logging, JSON export (`scripts/test-browser-journeys.mjs`) |
| Video presets | PASS; all 3 presets return HTTP 200 with external fallback link |

No deployment, production data operation, commit, or push was performed.
