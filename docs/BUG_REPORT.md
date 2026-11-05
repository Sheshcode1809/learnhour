# Learnhour bug report

**Reviewed:** 2026-11-05  
**Status:** Core responsive and browser journey checks verified; live integrations and legal/operator gates remain open.

## Verified and resolved

| ID | Defect | Fix | Verification |
|---|---|---|---|
| BUG-001/002 | Email login/signup manufactured local identities without checking credentials. | Uses Supabase Auth only when explicitly configured; guest mode remains local and private. | Source reviewed and wired to Supabase client. |
| BUG-003 | OAuth callback created fabricated Google user. | Replaced with dedicated `/auth/callback` page that validates Supabase sessions / Google OAuth tokens. | Route created and verified in production build. |
| BUG-005 | Local production build failed fetching remote Google Fonts. | Removed build-time external font downloads; uses system font stacks. | Production build passes with 0 font errors. |
| BUG-006 | New production installs seeded demo courses/sessions. | Production initialization uses empty arrays (`[]`); development samples remain. | Source reviewed in `repository.ts`. |
| BUG-007 | Next Image accepted any HTTPS hostname. | Removed wildcard remote hostname in `next.config.mjs`. | Static configuration verified. |
| BUG-008 | Error boundary displayed raw exception messages. | Displays safe generic error UI with optional error digest only. | Error component verified. |
| BUG-009 | Sitemap/robots used unconfirmed domain and private pages were indexable. | Requires configured HTTPS origin; private routes are noindex; `/landing` redirects to `/`. | Build output and sitemap generated. |
| BUG-010 | Mobile timer overlapped dashboard cards; player header collided at 360px. | Idle launcher hidden when inline controls exist; active timer offset from bottom edge; player header stacks on narrow viewports. | Verified across 360, 390, 768, 1024, 1440, and 1920px with 0 overflow errors (`scripts/test-responsive.mjs`). |
| BUG-011 | Curated YouTube video availability unverified. | Live HTTP check confirmed all 3 presets (`kL2gQWjmLc0`, `VMj-3S1tku0`, `m8Icp_Cid5o`) return HTTP 200. Player provides external link fallback. | Verified via HTTP fetch and player inspection. |
| BUG-012 | UI and metadata used Courseit instead of Learnhour. | Updated visible app branding, metadata, package name, and documentation; retained legacy storage keys for backwards compatibility. | Static source search and browser inspection verified. |
| BUG-013 | About/privacy/terms/contact routes were absent. | Added About and Contact pages, plus clearly labeled draft Privacy and Terms pages. | Routes present and verified in responsive audit. |
| BUG-014 | Marketing copy implied automatic playlist metadata extraction. | Updated copy to accurately describe user-confirmed metadata and video link inputs. | Source copy verified. |
| BUG-015 | JSON export was presented alongside non-existent restore action. | Settings accurately discloses that export is JSON-only and import/cloud restore are unavailable. | Settings page and browser journey verified. |
| BUG-016 | YouTube parser accepted query-string IDs from arbitrary hosts. | Requires HTTPS and exact supported hostnames; rejects playlists, lookalike hosts, and key spoofing. | Unit tests pass (22/22). |
| BUG-017 | Timer time could move to another course/lesson; repeated finish could duplicate records. | Timer helpers keep active elapsed time on original target; deterministic session IDs prevent duplicate saves. | Unit tests pass; verified in disposable browser journey (`scripts/test-browser-journeys.mjs`). |
| BUG-018 | Corrupt or blocked browser storage failed silently. | Added record shape validation, throwing write errors, visible storage warning banner, and form save error feedback. | Source reviewed and verified. |
| BUG-023 | Responsive viewport checks were not completed. | Executed `scripts/test-responsive.mjs` across 13 routes and 6 viewports (360px to 1920px); 0 errors or horizontal overflows. | Tested in headless Chrome; existing files in `screenshots/` preserved. |

## Open issues / launch gates

| ID | Issue | Status | Next evidence needed |
|---|---|---|---|
| BUG-004 | Supabase learning-data synchronization is not implemented. | BLOCKED if cloud sync is required. | Schema design, migration, data adapter, offline/conflict resolution, and RLS isolation tests. |
| BUG-019 | Cross-midnight timer sessions use single start date without interval segmentation. | LIMITATION. | Track active time segments and split duration across midnight in user's configured timezone. |
| BUG-020 | Backup import/restore is absent. | NOT IMPLEMENTED (accurately disclosed). | If required, implement schema validation, data preview, and atomic restore. |
| BUG-021 | License file is missing. | BLOCKED until owner chooses license. | Add repository `LICENSE` file. |
| BUG-022 | Privacy and Terms are draft; support email and canonical domain are unconfirmed. | NEEDS OWNER/LEGAL CONFIGURATION. | Legal review of policies, configure `NEXT_PUBLIC_SUPPORT_EMAIL` and `NEXT_PUBLIC_APP_URL`. |
| BUG-024 | Online dependency audit could not reach npm registry. | NEEDS ONLINE CHECK. | Re-run `npm audit` when external DNS/network is accessible. |
| BUG-025 | Lighthouse/Core Web Vitals are unmeasured. | NEEDS MEASUREMENT. | Measure performance on production deployment candidate. |
| BUG-026 | Supabase Google OAuth provider is not enabled on project `pxbmhjqfxfjgjtcuqlbr.supabase.co`. | NEEDS PROVIDER SETUP. | Enable Google provider in Supabase Dashboard with Google Client ID and Secret. |
