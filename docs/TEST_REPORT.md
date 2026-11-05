# Learnhour verification report

**Run date:** 2026-11-05  
**Scope:** Local automated checks, browser viewport testing via Puppeteer/Chrome, disposable-profile user journeys, and source code review. No production deployment, production database migration, or live online session was used.

## Automated checks

| Check | Result | Evidence and limits |
|---|---|---|
| `npm install --offline --no-audit --no-fund` | PASS | Dependencies verified up to date from local cache. |
| `npm test` | PASS | 1 Vitest file, 22/22 tests passed (`src/tests/calculations.test.ts`). Covers duration calculations, streak tracking, YouTube URL/host validation, and timer-state helpers. |
| `npx tsc --noEmit` | PASS | Exit code 0; zero type errors. |
| `npm run lint` | PASS | “✔ No ESLint warnings or errors”. |
| `npm run build` | PASS | Next.js 14.2.35 compiled and generated 15 routes (13 static, 2 dynamic). Shared first-load JS is 87.3 kB. |
| `npm audit --offline` | PASS, cached only | Reported 0 vulnerabilities from the local advisory cache. |
| `npm audit --omit=dev` online | BLOCKED | npm registry DNS lookup returned `ENOTFOUND registry.npmjs.org`; current online advisories could not be retrieved due to environment sandbox network restrictions. |
| Responsive browser audit | PASS | `scripts/test-responsive.mjs` executed via Chrome across 13 routes (`/`, `/auth/login`, `/auth/signup`, `/dashboard`, `/courses`, `/courses/new`, `/courses/python-2026`, `/sessions`, `/settings`, `/about`, `/privacy`, `/terms`, `/contact`) at 360, 390, 768, 1024, 1440, and 1920px. 0 route errors, 0 page errors, 0 horizontal overflows detected. No screenshots written or modified. |
| Disposable browser journey | PASS | `scripts/test-browser-journeys.mjs` executed in disposable profile (`Temp\learnhour-journeys-...`). Verified: timer start, refresh persistence, pause, resume, finish; course creation, lesson toggle, course deletion; and JSON export schema. |
| Preset YouTube availability | PASS | Live HTTP check for all 3 curated video URLs (`kL2gQWjmLc0`, `VMj-3S1tku0`, `m8Icp_Cid5o`) returned HTTP 200. Player external fallback link verified in source. |

## Verified source behaviors

- Guest learning data remains strictly local to the browser (`localStorage`).
- Production storage initializes empty (`process.env.NODE_ENV === 'production' ? [] : ...`); development fixtures are retained for local testing.
- Timer state helpers prevent target reassignment, preserve elapsed time across reloads, and use deterministic session IDs to prevent duplicate record creation.
- Strict YouTube URL parsing requires HTTPS and valid hostnames (`youtube.com`, `youtu.be`, `youtube-nocookie.com`); query parameter spoofing and playlist URLs are rejected.
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy) and safe error boundaries with generic user messaging are configured.
- Existing screenshots in `screenshots/` were strictly preserved and not overwritten.

## Unresolved gates & limits

- **Online Security Audit**: Online npm registry advisories were unverified due to network DNS block (`ENOTFOUND`).
- **Live Supabase Auth & Cloud Sync**: Cloud data sync is not implemented; Supabase Google OAuth returned `Unsupported provider: provider is not enabled` on project `pxbmhjqfxfjgjtcuqlbr.supabase.co`.
- **Legal & Operator Configuration**: Privacy Notice and Terms remain draft versions; support email (`NEXT_PUBLIC_SUPPORT_EMAIL`) and canonical domain (`NEXT_PUBLIC_APP_URL`) are unconfigured; no `LICENSE` file is present.
- **Performance & Real-User Metrics**: Lighthouse and Core Web Vitals are unmeasured on the target production deployment.
- **Cross-Midnight Timer Attribution**: Paused wall-clock intervals are not segmented across midnight boundaries.

## Readiness consequence

The build, type, lint, unit, responsive viewport, browser journey, and preset URL checks pass. The application is **NOT READY for public launch** until owner/legal configuration (Privacy, Terms, License, Domain, Support Email), live Supabase provider setup, and online dependency scans are completed. See [LAUNCH_READINESS.md](LAUNCH_READINESS.md) and [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md).
