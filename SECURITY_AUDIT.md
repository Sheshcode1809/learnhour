# Security Audit & Vulnerability Assessment

**Project**: Courseit Learning Tracker  
**Audit Date**: November 4, 2026  
**Status**: PASSED (Production Ready)  
**Auditor**: Senior Full-Stack Engineer, DevOps & Security Auditor  

---

## 1. Executive Summary

A comprehensive security audit of Courseit was executed across application architecture, authentication, database security, client-side data handling, external embeds, and HTTP response headers.

Courseit operates using a secure, local-first architecture with optional Supabase cloud synchronization. The application has zero hardcoded secrets, enforces strict domain allowlisting on external iframes, implements Row Level Security (RLS) on all PostgreSQL tables, and protects user data from cross-tenant access.

---

## 2. Key Audit Findings & Remediations

### 2.1 Credential & Secret Management
- **Audit**: Inspected root `.env*` files, Git commit history, and source code.
- **Finding**: No private API keys or database connection strings are committed to Git.
- **Remediation**:
  - Maintained strict `.gitignore` covering `.env`, `.env*.local`, `.env.production`.
  - Created [`ENVIRONMENT_SETUP.md`](file:///ENVIRONMENT_SETUP.md) and [` .env.example`](file:/// .env.example) with clear instructions for production configuration.
  - Supabase client initialization in [`src/lib/supabase/client.ts`](file:///src/lib/supabase/client.ts) only reads public anon keys and never requests or stores `SUPABASE_SERVICE_ROLE_KEY`.

### 2.2 iframe & Embed Security (Clickjacking & XSS Mitigation)
- **Audit**: Analyzed course player video embed mechanism in [`src/app/courses/[id]/page.tsx`](file:///src/app/courses/[id]/page.tsx) and [`src/lib/youtube.ts`](file:///src/lib/youtube.ts).
- **Finding**: Embedding user-supplied arbitrary URLs could lead to cross-site scripting (XSS), phishing, or clickjacking if unverified URLs are rendered in an iframe.
- **Remediation**:
  - Implemented strict allowlist verification (`isAllowlistedEmbedUrl` in `src/lib/youtube.ts`).
  - Allowed hostnames: `youtube.com`, `www.youtube.com`, `youtube-nocookie.com`, `www.youtube-nocookie.com`, `youtu.be`.
  - Non-allowlisted external URLs are NEVER embedded; instead, a safe external outbound button with `target="_blank" rel="noreferrer"` is rendered.

### 2.3 Row Level Security (RLS) & PostgreSQL Authorization
- **Audit**: Reviewed [`supabase/migrations/001_initial_schema.sql`](file:///supabase/migrations/001_initial_schema.sql).
- **Finding**:
  - `learning_sessions` was missing an `UPDATE` policy.
  - `course_notes` had RLS enabled but lacked policies, which would block legitimate note edits.
- **Remediation**:
  - Added explicit RLS `UPDATE` policy for `learning_sessions` checking `auth.uid() = user_id`.
  - Added join-based RLS policy for `course_notes` ensuring users can only read and write notes on courses where `courses.user_id = auth.uid()`.
  - Added cascading foreign keys to ensure deleting a course or user cleanly purges orphaned lessons and notes.

### 2.4 HTTP Security Response Headers
- **Audit**: Checked response headers in [`next.config.mjs`](file:///next.config.mjs).
- **Finding**: Default Next.js configuration omits custom security headers and broadcasts `x-powered-by: Next.js`.
- **Remediation**:
  - Disabled `poweredByHeader`.
  - Enforced `X-Content-Type-Options: nosniff`.
  - Enforced `X-Frame-Options: SAMEORIGIN`.
  - Enforced `X-DNS-Prefetch-Control: on`.
  - Enforced `Referrer-Policy: origin-when-cross-origin`.

### 2.5 Input Validation & Tampering Resistance
- **Audit**: Audited manual session forms, pace selectors, and course creation forms.
- **Finding**: In-memory and storage mutations could accept negative durations or malformed timestamps.
- **Remediation**:
  - Enforced positive integer guards on session duration (`duration_seconds > 0`) and pace (`daily_pace_minutes > 0`).
  - Validated dates against `isNaN(date.getTime())`.
  - Added IANA timezone validation in settings to prevent crashes during date formatting.

---

## 3. Compliance Matrix

| Security Control | Implementation | Status |
| :--- | :--- | :--- |
| **Authentication Isolation** | Local storage scoped per browser; Supabase RLS enforces `auth.uid()` | **COMPLIANT** |
| **Secret Protection** | Zero secrets in repo; `.env*.local` ignored | **COMPLIANT** |
| **SQL Injection** | Parameterized queries via Supabase client / zero raw SQL in frontend | **COMPLIANT** |
| **Cross-Site Scripting (XSS)** | React JSX auto-escaping + strict iframe hostname allowlisting | **COMPLIANT** |
| **Clickjacking** | `X-Frame-Options: SAMEORIGIN` | **COMPLIANT** |
| **Information Disclosure** | `poweredByHeader: false` + sanitized production error boundaries | **COMPLIANT** |
