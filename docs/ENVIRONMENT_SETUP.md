# Environment setup

Copy `.env.example` to `.env.local` for local development. Local guest use needs no credentials.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Production | Canonical HTTPS origin used to build absolute metadata and the sitemap. Set it before `next build`; there is no hard-coded production domain. |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Public launch | Support email rendered on `/contact`. This value is public. |
| `NEXT_PUBLIC_SUPABASE_AUTH_ENABLED` | Optional; defaults off | Set to `true` only after configuring and testing Supabase email and Google providers. |
| `NEXT_PUBLIC_SUPABASE_URL` | Only when Auth is enabled | Supabase project URL. Must use HTTPS outside localhost. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Only when Auth is enabled | Public anon/publishable key. This key is intended for the browser; never use a service-role key here. |

Supabase in the current code provides authentication only. Course, lesson, note, preference, and session records remain in browser storage. The migration in `supabase/migrations/` is not wired to application data operations and has not been verified against the runtime model. Do not describe this as cloud sync.

## Enable Supabase Auth

1. Create or select the intended Supabase project.
2. Configure email/password and Google providers in Supabase.
3. Add the exact production and preview callback URLs (`https://<host>/auth/callback`) to the provider settings and Supabase redirect allowlist.
4. Set the three Supabase variables above in the target deployment environment.
5. Verify signup confirmation, login, Google OAuth, callback, logout, and error paths against a non-production project first.
6. Keep course data local until a separate schema, migration, RLS, sync, and recovery implementation is reviewed and tested.

Keep `.env.local` and other private environment files out of Git. Do not add a `SUPABASE_SERVICE_ROLE_KEY` to any `NEXT_PUBLIC_` variable or client bundle.
