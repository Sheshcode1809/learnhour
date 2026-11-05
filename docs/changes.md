# Learnhour — AntiGravity production handoff

## Objective

Finish the launch-readiness work in this repository. Keep the existing Learnhour visual system and local-first behavior. Treat the current implementation and the audit files in this folder as the source of truth; do not reuse older reports that claim cloud sync, responsive passes, or a production build without current evidence.

## Current product facts

- Course, lesson, note, preference, timer, and study-session records use browser local storage.
- Supabase Auth is opt-in. Supabase data synchronization is not implemented. The SQL migration is a starter schema and has not been applied or live-tested.
- Guest mode works without credentials. Account sign-in does not move learning data between devices.
- Custom YouTube metadata is not fetched. Playlist URLs and non-HTTPS/lookalike hosts are rejected; custom video title/duration are learner-entered. Playback availability depends on YouTube.
- JSON export exists. Restore/import and server-side recovery do not.
- Privacy and Terms pages are drafts. Production domain, monitored support email, and license have not been confirmed.

## Work already applied in this pass

- Removed fake email identities and fabricated Google callback behavior; gated real Supabase Auth behind an explicit environment flag.
- Made first-run production course/session data empty while keeping development fixtures.
- Added browser-storage record checks, visible failure status, throwing writes, and key form-level error feedback.
- Extracted/tested timer state helpers; same-target starts are lossless, time cannot be moved to another course/lesson, and retry IDs prevent duplicate timer sessions.
- Tightened YouTube URL parsing, removed wildcard Next Image hostname, hardened response headers, and stopped showing raw exception messages.
- Added configured-origin metadata/sitemap handling, private-route noindex, `/landing` redirect, Learnhour metadata, and a generated Open Graph image.
- Fixed narrow player header reflow, dashboard timer overlap behavior, landing headline wrapping, and unsupported marketing claims; added external player fallback.
- Added About, Contact, draft Privacy, draft Terms, Supabase migration plan, and corrected launch documentation.
- Updated the responsive script so it checks without writing screenshots. Do not overwrite any existing files under `screenshots/`.
- Re-ran unit tests (22/22), TypeScript, ESLint, the production build (19 static pages in the elevated local run), and cached offline npm audit (0 findings); exact limitations are in `TEST_REPORT.md`.

## Remaining work — do not mark complete without evidence

1. Complete route and interaction checks at 360, 390, 768, 1024, 1440, and 1920px. Inspect dashboard, player, dialogs, sessions, auth, and new-course forms. The browser audit is still blocked: sandboxed Chrome failed and elevated execution was rejected by automatic review. Current screenshots are pre-change captures; do not overwrite them. Ask for permission before another browser-audit attempt.
2. Exercise course create/edit/delete, lesson completion, manual session create/edit/delete, timer start/pause/resume/refresh/finish, JSON export, and first-run production-empty behavior in a disposable browser profile. Check no duplicates or data loss.
3. Verify each curated YouTube URL/thumbnail in a browser. Keep the external fallback if embeds are unavailable; do not claim every video plays.
4. Decide whether the release is local-only or requires cloud sync. For sync, follow `SUPABASE_MIGRATION_PLAN.md`; implement a compatible schema/data adapter and test RLS isolation in staging. Do not run migrations against production without explicit authorization.
5. Configure the final HTTPS `NEXT_PUBLIC_APP_URL` and monitored `NEXT_PUBLIC_SUPPORT_EMAIL`; rebuild and inspect canonical metadata, `/robots.txt`, `/sitemap.xml`, and response headers.
6. Get owner/legal approval and complete Privacy/Terms; get the repository owner's license decision and add the matching `LICENSE` file.
7. Run current online dependency and secret scans when network access is available. Measure Lighthouse/Core Web Vitals on the final candidate; report actual values only.
8. Inspect Git status and remotes before release preparation. Do not overwrite the existing auth/callback working-tree change, alter user screenshots, push, deploy, or modify production data without authorization.

## Acceptance criteria

- Production starts with no demo courses or sessions; user data survives reload and write failures are visible.
- Timer time stays with the original course/lesson, paused time is excluded, and finishing twice does not create duplicate records. Decide and test cross-midnight attribution.
- Invalid and playlist URLs never create a course or produce an embed. Custom video details are confirmed by the learner.
- Private/auth/user-specific routes are noindex and absent from the public sitemap.
- Supported pages have no horizontal overflow or overlapping critical controls at all six target widths, verified in a real browser.
- Final automated check outputs, online audit status, live Auth/RLS status, and performance measurements are documented with their limits.
- Launch status remains NOT READY until all owner, legal, domain, responsive, and live-integration gates required by the selected release mode have evidence.
