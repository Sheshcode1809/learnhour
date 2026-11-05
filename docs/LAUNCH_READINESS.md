# Learnhour launch readiness

**Reviewed:** 2026-11-05  
**Decision:** **NOT READY for public launch yet.** Core local-first functionality, responsive behavior, browser timer journeys, and build health are verified, but owner/legal configuration and live cloud provider setup remain open.

Status meanings: **READY** = verified with test evidence; **NEEDS CONFIGURATION** = requires owner/provider setup; **BLOCKED** = missing implementation or required gate not completed; **NOT APPLICABLE** = not required for local-first release mode.

## Readiness matrix

| Area | Status | Evidence / Remaining Work |
|---|---|---|
| Local-first routes and core features | READY | 13 application routes verified in responsive audit and disposable browser journeys. |
| Production sample data | READY | Code enforces empty initial arrays (`[]`) in production; development retains sample fixtures. |
| Local storage validation / failure UI | READY | Record shape validation, visible storage failure banner, and throwing write errors implemented and verified. |
| Progress & streak calculations | READY, UNIT TESTED | Calculations verified; 22/22 unit tests pass (`npm test`). |
| Timer state calculations & journeys | READY, BROWSER TESTED | Tested in disposable profile: start, pause, resume, refresh persistence, and finish session recording verified. |
| Auth UI / source | READY | Dedicated `/auth/callback` page, Google Account redirection, and email/password forms wired. |
| Live Supabase Auth | NEEDS CONFIGURATION | Supabase Google provider returned `Unsupported provider: provider is not enabled` on `pxbmhjqfxfjgjtcuqlbr.supabase.co`. Requires dashboard activation. |
| Supabase course/session sync | BLOCKED (Cloud mode) | No runtime database sync exists; application operates in local-first mode. |
| Database / RLS | BLOCKED for cloud mode | Starter SQL migration unapplied and unverified against production database. |
| URL and embed validation | READY, UNIT TESTED | Strict HTTPS/host checks and playlist rejection verified with unit tests. |
| Curated video availability | READY, HTTP CHECKED | All 3 presets (`kL2gQWjmLc0`, `VMj-3S1tku0`, `m8Icp_Cid5o`) return HTTP 200; external source link fallback verified in player. |
| HTTP security headers | READY, CODE-REVIEWED | HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy configured. |
| Error handling | READY | Error boundaries provide generic error UI without leaking raw stack/exception messages. |
| Public trust pages | NEEDS CONFIGURATION | About and Contact pages exist; Privacy Notice and Terms of Service are drafts requiring legal approval. |
| Domain, canonical, sitemap | NEEDS CONFIGURATION | Set final HTTPS `NEXT_PUBLIC_APP_URL` in production environment before release. |
| Support contact | NEEDS CONFIGURATION | Set `NEXT_PUBLIC_SUPPORT_EMAIL` to a monitored address. |
| Repository license | BLOCKED | Repository owner must select and add approved `LICENSE` file. |
| Responsive behavior | READY, BROWSER TESTED | Verified across 360px, 390px, 768px, 1024px, 1440px, and 1920px with 0 errors or horizontal overflows (`scripts/test-responsive.mjs`). Screenshots preserved. |
| Production build | READY | Next.js 14.2.35 compiled 15 routes cleanly; shared first-load JS is 87.3 kB. |
| TypeScript & linting | READY | `npx tsc --noEmit` exited 0; `npm run lint` reported 0 warnings/errors. |
| Dependency security audit | NEEDS ONLINE CHECK | Offline audit reported 0 cached vulnerabilities; online npm advisory check blocked by network DNS isolation. |
| Performance measurement | NEEDS MEASUREMENT | Lighthouse and Core Web Vitals unmeasured on production deployment. |
| Deployment | BLOCKED | No unauthorized deployment performed. |
| Git release | NEEDS OWNER ACTION | Git working tree preserved; no unauthorized commit or push performed. |

## Required before public launch

1. **Owner Release Mode Decision**: Confirm that release v1 is explicitly local-first. Do not market cloud data synchronization until a database adapter is built and tested.
2. **Legal & Licensing**: Approve Privacy Notice and Terms of Service; add repository `LICENSE` file.
3. **Environment Configuration**: Set production `NEXT_PUBLIC_APP_URL` and `NEXT_PUBLIC_SUPPORT_EMAIL`.
4. **Supabase Provider Activation**: If Google Auth is desired via Supabase, enable Google Provider in the Supabase Dashboard (`Authentication > Providers > Google`).
5. **Live Performance & Online Audit**: Run an online `npm audit` and measure Lighthouse scores on the deployed domain.

Exact command outputs and evidence are documented in [TEST_REPORT.md](TEST_REPORT.md) and [PRODUCTION_AUDIT.md](PRODUCTION_AUDIT.md).
