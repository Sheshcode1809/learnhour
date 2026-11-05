# Supabase migration plan

## Current state

Supabase Auth is opt-in. Learning records use browser local storage. The application does not read or write the tables in `supabase/migrations/001_initial_schema.sql`; the SQL is a starter schema and is not production-verified.

## Compatibility gaps to resolve before connecting data

- Local IDs include prefixed strings such as `session-…` and lesson IDs like `py-l1`; the starter schema uses UUID primary keys.
- The runtime stores lessons, notes, quizzes, and flashcards inside course objects. The schema normalizes some data but has no quiz/flashcard tables and omits fields such as `last_selected_lesson_id` and the timer's session start epoch.
- Guest data has no authenticated `auth.users.id` to own database rows.
- `completed_minutes` is derived in the app; a synchronized source of truth and recomputation strategy must be chosen.
- RLS statements have not been executed or tested in a Supabase project. Foreign-key ownership, insert/update checks, and cross-user relationship constraints still need a policy review.
- No sync queue, conflict strategy, migration from browser storage, retry behavior, or deletion/recovery process exists.

## Staged implementation plan

1. Confirm the desired account model: authenticated-only cloud data, guest-only local mode, or a separately reviewed guest migration flow.
2. Define a versioned target schema from the current TypeScript types. Decide whether quizzes/flashcards remain JSON columns or become relational tables. Preserve old string IDs or create an explicit ID mapping; do not silently cast them to UUIDs.
3. Create an additive migration for a staging Supabase project. Review constraints, indexes, cascade behavior, `WITH CHECK` policies, and ownership joins before applying it.
4. Add server/client data access with the anon key and authenticated user identity. Keep service-role credentials server-only and do not trust client-supplied `user_id` values.
5. Implement local-to-cloud migration, offline queue/retry behavior, duplicate prevention, conflict resolution, and user-visible sync state.
6. Test with two separate users and negative cross-tenant cases. Test signup, login, logout, session expiry, CRUD, relationship ownership, network loss, retries, and restore from backup.
7. Back up staging data and validate rollback before any production migration. Get explicit production-data authorization before applying a production migration.

No database schema was changed or deployed during this audit.
