# Deployment guide

This guide prepares a Vercel deployment for the current local-first Learnhour release. It does not enable Supabase data synchronization or deploy the application.

## Requirements

- Node.js `>=18.17.0 <23` and npm.
- A Vercel project connected to the intended `learnhour` repository and production branch.
- The final HTTPS domain and a support email.
- Owner-approved Privacy Notice and Terms of Use, and a repository license decision.

## Configure Vercel

1. Select Next.js as the framework and the repository root as the project root.
2. Use `npm install` and `npm run build`; the output directory is managed by Next.js.
3. Set `NEXT_PUBLIC_APP_URL` to the canonical HTTPS origin and `NEXT_PUBLIC_SUPPORT_EMAIL` to a monitored address.
4. Leave `NEXT_PUBLIC_SUPABASE_AUTH_ENABLED=false` for local guest mode. Do not set Supabase variables unless real account authentication has been configured and tested in a non-production project.
5. Do not run the SQL migration to imply cloud sync. The runtime does not use its tables.
6. Review the final environment scope for Production, Preview, and Development before building.

## Verify the deployment candidate

Run locally or in CI before promoting a deployment:

```bash
npm install
npm test
npx tsc --noEmit
npm run lint
npm run build
```

Then verify `/`, `/about`, `/privacy`, `/terms`, `/contact`, `/robots.txt`, and `/sitemap.xml`; verify authentication is not advertised when disabled; and smoke-test dashboard, course creation, timer, manual session, export, refresh persistence, and 360px/desktop layouts. The privacy and terms pages are drafts and must be approved and completed before public launch.

## Data and rollback

Current learning data is stored in each user's browser. A Vercel rollback does not restore or roll back browser data. There is no server-side data recovery or import flow. Users should export a JSON copy before clearing browser data.

To roll back a deployment, use Vercel's deployment controls and verify the selected prior build. No production deployment or rollback was performed as part of this audit.
