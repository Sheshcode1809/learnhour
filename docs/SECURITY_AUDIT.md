# Security audit

**Review date:** 2026-11-05
**Status:** Needs configuration; cloud mode is blocked pending implementation and live verification.
**Scope:** Static repository review and local dependency checks. This is not a penetration test or a live Supabase review.

## Findings

### Authentication and authorization

- Guest use is local browser storage and is not an authenticated or isolated cloud account.
- Supabase Auth is disabled by default and activates only when `NEXT_PUBLIC_SUPABASE_AUTH_ENABLED=true` and the public URL/key are supplied. Email/password and Google OAuth use the Supabase Auth client; direct token scraping and fabricated Google identities were removed.
- Learning records are not connected to Supabase. Authenticated users still store records in the current browser.
- Login, Google provider configuration, callback URLs, email confirmation, logout, and session expiry were not verified against a live Supabase project. Do not enable Auth until those checks pass.

### Database and RLS

- `supabase/migrations/001_initial_schema.sql` is an unconnected starter schema. The application makes no database CRUD calls.
- RLS policies were read statically but were not run or tested. Cross-user record isolation, ownership of foreign-key relationships, policy `WITH CHECK` behavior, and migration idempotency remain unverified.
- The current schema and local model have ID and feature mismatches. See [SUPABASE_MIGRATION_PLAN.md](SUPABASE_MIGRATION_PLAN.md). No database schema was deployed or changed.

### Browser storage and data handling

- Course/session/preference/timer JSON is stored in local storage. Runtime validation now rejects malformed saved records and storage read/write failures produce a visible warning. A failed write does not claim success.
- Browser storage is not encrypted by the application, is not shared-device isolated, and can be cleared by the browser or user. Export is available; import and server-side recovery are not.
- Data integrity across all multi-key writes is not transactional. A failure after one key saves can require a refresh/recalculation; this remains a reliability limitation.

### URL and embed handling

- YouTube video parsing now requires HTTPS and exact supported hostnames, rejects playlist pages and lookalike hosts, and does not fetch user-supplied URLs server-side.
- Iframe sources are restricted to YouTube hostnames. Non-allowlisted course sources are rendered as outbound links.
- YouTube video availability and embed permissions are controlled by YouTube and were not verified for every prepared course.

### HTTP headers and application errors

Configured in `next.config.mjs`: `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, and production-only `Strict-Transport-Security`. No Content Security Policy is configured. HTTPS delivery must still be confirmed at the deployment host.

The user-facing error boundary no longer renders raw exception messages and logs only a digest reference. There are no application API routes or server-side user URL fetches in the current app. Rate limiting for account flows is expected from the configured auth provider and was not tested here.

### Dependencies and secrets

- `npm audit --offline --omit=dev` reported 0 vulnerabilities using the local npm advisory cache.
- The online advisory endpoint could not resolve `registry.npmjs.org` (`ENOTFOUND`), so this is not a current online advisory result.
- `.env*.local` is ignored by Git. Local environment values were not displayed in this audit. Verify the deployment environment and repository history with the owner's approved secret-scanning workflow before release.
- The Supabase client contains no hard-coded project URL or anon-key fallback; only the browser-safe anon key is read when Auth is explicitly enabled.

## Required before public launch

1. Run an online dependency audit and a secret scan of the intended release commit/history.
2. Configure HTTPS/domain and verify response headers on the deployed candidate.
3. Keep cloud data sync disabled until the target schema, RLS policies, migrations, isolation tests, backups, and conflict handling are implemented.
4. Complete and approve the draft privacy/terms pages and configure a monitored support address.
