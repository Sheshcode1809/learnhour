# Environment Configuration Guide

This document explains the environment variables utilized by Courseit across development, staging, and production environments.

---

## 1. Quick Start

Copy the example environment file:

```bash
cp .env.example .env.local
```

The application runs immediately in **local-first mode** without any external API keys or cloud database accounts.

---

## 2. Environment Variables Reference

| Variable | Required? | Default | Description |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Optional | `https://courseit.vercel.app` | Base URL used for OpenGraph cards, Twitter preview images, sitemaps, and canonical links. |
| `NEXT_PUBLIC_APP_ENV` | Optional | `production` | Deployment stage indicator (`development`, `staging`, `production`). |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | *empty* | Your Supabase project URL (e.g. `https://xyzproject.supabase.co`). Needed only if enabling multi-device cloud sync. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | *empty* | Public anonymous API key from Supabase Project Settings > API. |

---

## 3. Security Guidelines for Environment Variables

> [!CAUTION] Never expose private service-role keys!
> - The `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security and must **NEVER** be prefixed with `NEXT_PUBLIC_` or included in frontend client bundles.
> - Only `NEXT_PUBLIC_SUPABASE_ANON_KEY` should be set on client-facing applications.
> - Keep `.env*.local` in `.gitignore` to prevent committing secrets to source control.

---

## 4. Configuring Variables in Vercel

1. Navigate to your project in the **Vercel Dashboard**.
2. Go to **Settings** > **Environment Variables**.
3. Add the following variables:
   - Key: `NEXT_PUBLIC_APP_URL`, Value: `https://your-custom-domain.com` (Target: Production, Preview)
   - Key: `NEXT_PUBLIC_APP_ENV`, Value: `production` (Target: Production)
   - *(Optional)* Key: `NEXT_PUBLIC_SUPABASE_URL`, Value: `https://<id>.supabase.co`
   - *(Optional)* Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`, Value: `<anon-key>`
4. Trigger a new deployment for changes to take effect.

