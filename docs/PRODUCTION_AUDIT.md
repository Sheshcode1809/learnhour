# Learnhour production audit

**Review date:** 2026-11-05  
**Scope:** Repository source, local automated checks, Chrome responsive audit across 6 viewports, disposable-profile browser journeys, and supplied screenshots. No production database migration or unauthorized deployment was performed.

## Summary

Learnhour is a local-first Next.js 14 web application. Course, lesson, note, session, preference, and timer data are stored locally in the browser (`localStorage`). Supabase Auth is opt-in; no runtime database CRUD or cloud sync exists.

Automated verification (22 unit tests, TypeScript, ESLint, production build, non-destructive responsive audit at 6 breakpoints, and disposable-profile journeys) confirms that core local flows operate reliably without data loss or layout breakage. Public launch remains gated by missing legal approval, unconfigured domain/support settings, lack of a repository license, and unverified live cloud integrations.

## Findings and status

### Critical / launch gates

1. **Cloud synchronization is absent — BLOCKED if SaaS sync is required.** No data adapter or runtime database CRUD exists. The application operates in local-first mode. If multi-device sync is required, follow [SUPABASE_MIGRATION_PLAN.md](SUPABASE_MIGRATION_PLAN.md) before claiming cloud features.
2. **Live authentication is unverified — NEEDS CONFIGURATION.** Direct simulated tokens were replaced with Supabase OAuth and Google Account redirection. However, the configured Supabase project (`pxbmhjqfxfjgjtcuqlbr.supabase.co`) currently returns `400 Unsupported provider: provider is not enabled` for Google OAuth. Live authentication requires provider setup in the Supabase Dashboard.
3. **Legal and operator launch details are incomplete — BLOCKED for public launch.** Privacy Notice and Terms of Service are drafts, `NEXT_PUBLIC_SUPPORT_EMAIL` is unset, `NEXT_PUBLIC_APP_URL` is unconfirmed, and no `LICENSE` file exists in the repository.
4. **Responsive browser audit — VERIFIED.** Executed `scripts/test-responsive.mjs` across 13 routes at 360px, 390px, 768px, 1024px, 1440px, and 1920px. 0 route errors, 0 page errors, and 0 horizontal overflows were observed. All files in `screenshots/` were strictly preserved.

### High

- **Production demo seeding — FIXED in code.** Missing production course/session storage initializes empty; development mode retains test fixtures.
- **Timer attribution and reload persistence — VERIFIED.** Repeated starts on the same target preserve elapsed seconds; time cannot be reassigned to a different course; reload preserves active state; deterministic session IDs prevent duplicate saves on finish. Cross-midnight interval segmentation remains a known limitation.
- **Browser journeys — VERIFIED.** Disposable profile test (`scripts/test-browser-journeys.mjs`) confirmed end-to-end timer start, pause, resume, reload, and finish session logging; course creation, lesson toggle, and deletion; and JSON export validation.
- **Curated video availability — VERIFIED.** All 3 preset YouTube video URLs (`kL2gQWjmLc0`, `VMj-3S1tku0`, `m8Icp_Cid5o`) returned HTTP 200. Player provides an external link fallback if embed playback fails.
- **Remote image and iframe security — FIXED.** Wildcard remote image hosts removed; iframes are restricted to allowlisted YouTube origins (`isAllowlistedEmbedUrl`).
- **YouTube parser validation — FIXED.** Requires HTTPS and exact supported hostnames; rejects query parameter spoofing and playlist routes.

### Medium

- Online npm advisory audit failed DNS lookup (`ENOTFOUND registry.npmjs.org`) due to sandbox network isolation. The offline audit reported 0 cached vulnerabilities.
- Lighthouse and Core Web Vitals have not been measured on the production deployment.
- Backup import/restore is not implemented; export is JSON-only and accurately labeled as such in Settings.
- System font stacks are used to prevent build-time Google Fonts network dependencies.

## Verification snapshot

| Check | Result | Evidence / Limit |
|---|---|---|
| Unit tests | 22 passed | Vitest calculations, URL validation, timer math. |
| TypeScript | Pass | `npx tsc --noEmit` exited 0. |
| ESLint | Pass | `npm run lint` reported 0 warnings/errors. |
| Production build | Pass | Next.js 14.2.35 compiled 15 routes (87.3 kB shared JS). |
| Responsive audit | Pass | 13 routes verified at 360, 390, 768, 1024, 1440, 1920px with 0 errors/overflows. |
| Browser journeys | Pass | Timer, course CRUD, session logging, and JSON export verified in disposable profile. |
| Video presets | Pass | All 3 preset URLs return HTTP 200; external fallback link in player. |
| Online npm audit | Blocked | DNS resolution failed (`ENOTFOUND`). |
| Supabase Auth / RLS | Not verified live | Provider not enabled in Supabase project dashboard. |
| Core Web Vitals | Not measured | Target production domain not deployed. |

## Repository handling

- Existing screenshot files in `screenshots/` were strictly preserved.
- No production database migrations were run.
- No git commits or pushes were made in this step.
