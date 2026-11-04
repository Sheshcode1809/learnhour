# Courseit - Production Deployment Guide (Vercel & Next.js)

This document contains step-by-step instructions for deploying Courseit to production on Vercel, configuring domains, environment variables, security settings, and verifying database connections.

---

## 1. Prerequisites

- A GitHub repository with the latest Courseit codebase.
- A [Vercel](https://vercel.com) account connected to your GitHub provider.
- *(Optional)* A [Supabase](https://supabase.com) project if multi-device cloud synchronization is desired. The application functions in local-first offline-ready mode without external credentials.

---

## 2. Deploying to Vercel (Step-by-Step)

### Option A: Via Vercel Dashboard (Recommended)

1. Log in to [vercel.com](https://vercel.com).
2. Click **Add New...** > **Project**.
3. Select your GitHub repository (`productivity project` or `courseit-learning-tracker`).
4. In the **Configure Project** screen:
   - **Framework Preset**: Next.js (automatically detected).
   - **Root Directory**: `./` (default).
   - **Build Command**: `next build` (configured via `vercel.json`).
   - **Output Directory**: `.next` (default).
   - **Install Command**: `npm install`.
5. Under **Environment Variables**, add the production configuration:
   - `NEXT_PUBLIC_APP_URL`: `https://your-custom-domain.com` (or `https://your-app.vercel.app`)
   - `NEXT_PUBLIC_APP_ENV`: `production`
   - *(Optional for Supabase sync)*:
     - `NEXT_PUBLIC_SUPABASE_URL`: `https://<project-ref>.supabase.co`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<anon-public-key>`
6. Click **Deploy**.
7. Vercel will install dependencies, run type checking (`tsc --noEmit`), compile the Next.js production build, and assign an SSL-enabled production domain.

### Option B: Via Vercel CLI

```bash
# 1. Install Vercel CLI globally
npm i -g vercel

# 2. Login to your Vercel account
vercel login

# 3. Link project & deploy preview
vercel

# 4. Deploy to production
vercel --prod
```

---

## 3. Database Migration Setup (Supabase)

If enabling cloud synchronization with Supabase:

1. Open your Supabase project dashboard.
2. Navigate to **SQL Editor** > **New Query**.
3. Paste the contents of [`supabase/migrations/001_initial_schema.sql`](file:///supabase/migrations/001_initial_schema.sql).
4. Run the query. This will:
   - Create tables: `user_preferences`, `courses`, `course_lessons`, `learning_sessions`, `course_notes`, `active_timer_state`.
   - Enable Row Level Security (RLS) on all tables.
   - Establish ownership policies restricting data access strictly to `auth.uid() = user_id`.
   - Set up cascading foreign keys and performance indexes.

---

## 4. Post-Deployment Verification Checklist

Once deployed, verify the following URLs on your live production domain:

- [ ] **Marketing Landing Page**: `https://<domain>/` loads with 200 OK.
- [ ] **Favicon**: Branded green SVG cap displays in browser tab.
- [ ] **Robots.txt**: `https://<domain>/robots.txt` disallows private routes (`/dashboard`, `/sessions`, `/settings`, `/courses/`) and points to `/sitemap.xml`.
- [ ] **Sitemap.xml**: `https://<domain>/sitemap.xml` lists public indexed routes.
- [ ] **Authentication**: Guest Google demo login routes directly to `/dashboard`.
- [ ] **Habit Dashboard**: Streak engine, daily goal progress, and 7-day activity graph load with 0 errors.
- [ ] **Study Timer**: Floating timer runs, persists across page refreshes, and successfully records sessions.
- [ ] **Curated Masterclasses**: Direct links to Python 2026, Neural Networks, and System Design courses load instantly.
- [ ] **Responsive Design**: Verify on mobile browser (360px–390px) to confirm zero horizontal scroll.

---

## 5. Rollback Procedures

If an issue is detected in production:

1. In the Vercel Dashboard, go to **Deployments**.
2. Find the previous stable deployment.
3. Click the three dots `...` next to the deployment and select **Instant Rollback**.
4. Vercel will instantaneously revert live traffic to the chosen build without downtime.

