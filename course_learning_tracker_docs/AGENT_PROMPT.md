# Antigravity Master Prompt — Build the Course Learning Tracker

## Role
Act as a senior product engineer, UX designer, and solution architect. Work methodically. Treat the supplied reference video and this documentation as product inputs. Build a polished, responsive, functional web application—not a static mockup.

## First: documentation before code
1. Inspect every `.md` file in this documentation folder.
2. If the reference video is available in the workspace, inspect it carefully. If not, ask for its path or request that it be added under `reference/`; do not pretend to have inspected it.
3. Create or refine the required project documents:
   - `README.md`
   - `PRD.md`
   - `REQUIREMENTS.md`
   - `UI_UX_SPEC.md`
   - `TECHNICAL_ARCHITECTURE.md`
   - `DATA_MODEL.md`
   - `IMPLEMENTATION_PLAN.md`
   - `ACCEPTANCE_TESTS.md`
4. Resolve contradictions between documents. Record unresolved assumptions explicitly.
5. Before coding, provide a short documentation review: product scope, page map, data model, chosen stack, risks, and implementation phases.
6. Do not start implementation until the documentation is complete and consistent. If the user has requested an approval checkpoint, stop and wait. Otherwise, proceed after presenting the review.

## Product objective
Build a course and learning progress tracker inspired by the supplied video. Its central idea is: **study for one hour a day and steadily finish long courses and video playlists**.

The user should be able to add courses, record learning time or lesson progress, resume where they left off, and understand their daily target, streak, and overall progress.

## Core MVP features
### 1. Dashboard
- Greeting and current date.
- Daily learning target, default 60 minutes.
- Today's completed minutes and remaining minutes.
- Weekly learning summary.
- Current learning streak and best streak.
- Course library with progress bars.
- A clear “Continue learning” action for the most recently active course.
- Empty state with a useful “Add your first course” action.

### 2. Course management
- Create, edit, archive, and delete a course.
- Fields: title, provider/source, course URL, optional thumbnail URL, total duration in minutes, optional description, status.
- Support course types such as YouTube playlist, online course, and custom learning plan.
- Show total duration, completed duration, remaining duration, and percentage complete.
- Validate URLs and non-negative duration values.
- Do not scrape YouTube or external sites unless a supported API and credentials are explicitly configured. Manual entry must always work.

### 3. Learning sessions and progress
- Start, pause, resume, and finish a study timer.
- Allow manual session entry/editing for learners who study offline or forget to start the timer.
- Record start/end timestamps, duration, course, and optional notes.
- Update course progress safely. Prevent accidental double-counting when a timer is resumed.
- Allow a simple progress update by minutes watched or lessons completed.
- A session must be associated with a course, unless the user explicitly records general study time.

### 4. Goals and streaks
- User-configurable daily target, default 60 minutes.
- Mark a day complete when valid recorded study minutes meet the target.
- Calculate current and best streak from the user's local calendar dates.
- Do not count future dates. Handle timezone boundaries consistently.
- Explain that streaks are based on saved sessions, not merely opening the app.

### 5. Course detail
- Course overview and progress.
- Completed, remaining, and total duration.
- Recent sessions.
- “Continue” action.
- Edit course and add a session.
- Show lesson/playlist breakdown only if lesson data is available or entered by the user.

### 6. Settings and persistence
- Store data persistently.
- For a local-first prototype, use a well-structured storage abstraction and safe local persistence.
- For a multi-device production version, use Supabase Auth + Postgres with row-level security.
- Never expose service-role keys in browser code.
- Include export/import or CSV export if feasible; do not let this delay the core MVP.

## Design direction
- Match the reference video's visual language: warm off-white/cream background, charcoal text, restrained muted green and terracotta/orange accents, clean cards, subtle borders and shadows.
- Keep the interface calm, focused, and distraction-free.
- Use a desktop dashboard layout with a sidebar or compact top navigation; adapt cleanly to mobile.
- Use clear typography, generous spacing, readable data labels, and strong empty states.
- Avoid excessive gradients, glassmorphism, neon colors, oversized decorative elements, and unnecessary animations.
- Do not copy a creator's identity, logo, or proprietary assets. Use original branding and neutral placeholder imagery where needed.
- Make the mobile experience excellent; the reference video itself is vertical, but the app must work on desktop and mobile.

## Suggested page map
- `/` — dashboard
- `/courses` — course library
- `/courses/new` — add course
- `/courses/[id]` — course details
- `/sessions` — learning history
- `/settings` — daily target and preferences
- `/auth` — only if Supabase authentication is enabled

## Engineering requirements
- Use strict TypeScript; avoid `any`.
- Use reusable components and a clear feature-based folder structure.
- Use server components by default; add client components only for interactive areas.
- Validate forms with Zod (or equivalent).
- Provide loading, error, success, and empty states.
- Use accessible labels, keyboard navigation, visible focus states, and semantic HTML.
- Handle invalid data and storage failures gracefully.
- Keep calculations (minutes, percentages, streaks) in tested utility functions.
- Avoid fake buttons, dead links, placeholder interactions, and hard-coded dashboard statistics once real data exists.
- Do not add dependencies without a reason.
- Include `.env.example` if environment variables are required.
- Include setup and run instructions in `README.md`.

## Definition of done
- A user can add a course and see it on the dashboard.
- A user can record a session and see daily progress update.
- Course completed/remaining minutes and progress percentage are correct.
- Daily goal and streak calculations work across date boundaries.
- User can edit and delete their own courses and sessions.
- The interface works at mobile, tablet, and desktop widths.
- No major console errors, broken routes, or non-functional controls.
- Tests cover core calculations and key user flows.
- Documentation matches the delivered implementation.

## Execution discipline
Work in small phases from `IMPLEMENTATION_PLAN.md`. After each phase, run type checks, linting, and relevant tests. Fix errors before continuing. Do not silently change the product scope. If a feature is too large, document it as a later enhancement rather than shipping a broken version.
