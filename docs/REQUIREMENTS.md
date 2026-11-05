# Functional and Non-functional Requirements

> **Status:** This is a product requirements document, not verification evidence. See `PRODUCTION_AUDIT.md` and `TEST_REPORT.md` for current implementation and verification status.

## Functional requirements
| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Create a course with title, provider/source, URL, total duration, and optional description/thumbnail | Must |
| FR-02 | Accept supported HTTPS YouTube video URLs and exact known presets; reject playlist pages and unsupported hosts; require learner-entered title/duration for custom videos | Must |
| FR-03 | Divide long courses into structured day-by-day plans (Day 1, Day 2, Day 3) targeting ~60 mins/day | Must |
| FR-04 | Interactive Course Player with allowlisted YouTube video player, lesson list, "Mark as completed" action, "Auto-advance on completion" toggle, and per-course last-selected lesson persistence | Must |
| FR-05 | Study tools: Interactive Quiz with question scoring, lesson-context Notes with editable minute offset, and Flashcards | Must |
| FR-06 | List, filter, view, edit, archive, and delete courses. Deleting all courses persists an empty library across reloads | Must |
| FR-07 | Start, pause, resume, and finish study timer with persisted state, idempotent start calls, and lossless segment handling across navigation | Must |
| FR-08 | Add, backdate (custom study timestamp), edit, and delete manual learning sessions with validated positive duration (>0s) | Must |
| FR-09 | Calculate course completed minutes using single derived progress rule (greater of completed lesson duration and linked session time, capped at lesson duration; plus unassigned course sessions; capped at total minutes) | Must |
| FR-10 | Calculate today's study minutes, daily target progress, and weekly totals using seconds-first daily aggregation | Must |
| FR-11 | Calculate current streak and best streak using local calendar day boundaries in configured IANA timezone, strictly excluding future-dated sessions | Must |
| FR-12 | Quick "Continue Learning" action on Dashboard to immediately resume last active course and its last active lesson | Must |
| FR-13 | Configure daily learning goal (default: 60 minutes) and user preferences with IANA timezone validation | Must |
| FR-14 | Persist learning data locally with zero-config guest startup; production begins empty and reset must not silently reseed sample data | Must |
| FR-15 | Export all user data as JSON backup | Should |

## Non-functional requirements
- **Responsiveness**: Smooth adaptive layouts from 360px mobile viewport to 1440px+ desktop monitor.
- **Design Aesthetic**: Warm cream/off-white background (`#FBF9F5`), charcoal typography (`#1C1917`), olive/forest green accents (`#2D5A27`), subtle borders, and scenic natural artwork header.
- **Performance**: Instant initial load, zero jank during timer ticks, efficient local cache updates.
- **Type Safety**: Strict TypeScript with strict null checks, no `any`, typed state models and props.
- **Security & Embed Safety**: Allowlisted domain verification for iframe embeds (`youtube.com`, `youtu.be`, `youtube-nocookie.com`) with external safe link fallbacks.
- **Accessibility**: Semantic HTML5 tags, keyboard navigable modals and controls, clear focus rings.
- **Error Handling**: Graceful fallback for non-embeddable URLs, invalid inputs, and loading state guards before 404 screens.

## Data integrity rules
- Durations: Course total stored as integer minutes; sessions stored as integer seconds (`duration_seconds`).
- Session duration must be greater than zero seconds.
- Single source of truth derived progress: completed lessons count full lesson duration; incomplete lessons count linked session time capped at lesson duration; unassigned course sessions add on top; capped at `total_minutes`.
- Progress percentage is strictly clamped between `0%` and `100%`.
- Remaining duration is always `Math.max(total - completed, 0)`.
- Second-first daily aggregation: sessions are summed in seconds per local calendar date before converting to minutes via `Math.floor(secs / 60)`.
- Streaks increment only for calendar days where target minutes are achieved in the configured IANA timezone. Future-dated sessions are excluded from streak calculation. Today's incomplete target does not break yesterday's streak.
- Empty library states: saving an empty array `[]` into storage persists `[]` and does not automatically reseed sample courses. Reseeding only occurs on explicit reset in Settings.
