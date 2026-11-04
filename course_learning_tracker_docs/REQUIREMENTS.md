# Functional and Non-functional Requirements

## Functional requirements
| ID | Requirement | Priority |
|---|---|---|
| FR-01 | Create a course with title, provider/source, URL, total duration, and optional description/thumbnail | Must |
| FR-02 | Paste YouTube video/playlist URL to auto-populate title, duration, embed URL, and day breakdown | Must |
| FR-03 | Divide long courses into structured day-by-day plans (Day 1, Day 2, Day 3) targeting ~60 mins/day | Must |
| FR-04 | Interactive Course Player with embedded video player, lesson list, and "Mark as completed" action | Must |
| FR-05 | Study tools: Interactive Quiz with question scoring, pinned Notes with timestamp, and Flashcards | Must |
| FR-06 | List, filter, view, edit, archive, and delete courses | Must |
| FR-07 | Start, pause, resume, and finish study timer with persisted state across reloads/routes | Must |
| FR-08 | Add, edit, and delete manual learning sessions with duration, course association, and notes | Must |
| FR-09 | Calculate course completed minutes, remaining minutes, and progress percentage safely | Must |
| FR-10 | Calculate today's study minutes, daily target progress, and weekly totals | Must |
| FR-11 | Calculate current streak and best streak using local calendar day boundaries | Must |
| FR-12 | Quick "Continue Learning" action on Dashboard to immediately resume last active course | Must |
| FR-13 | Configure daily learning goal (default: 60 minutes) and user preferences | Must |
| FR-14 | Persist all data locally (localStorage) with instant zero-config startup and Supabase sync readiness | Must |
| FR-15 | Export all user data as JSON / CSV backup | Should |

## Non-functional requirements
- **Responsiveness**: Smooth adaptive layouts from 360px mobile viewport to 1440px+ desktop monitor.
- **Design Aesthetic**: Warm cream/off-white background (`#FBF9F5`), charcoal typography (`#1C1917`), olive/forest green accents (`#2D5A27`), subtle borders, and scenic natural artwork header.
- **Performance**: Instant initial load, zero jank during timer ticks, efficient local cache updates.
- **Type Safety**: Strict TypeScript with strict null checks, no `any`, typed state models and props.
- **Accessibility**: Semantic HTML5 tags, keyboard navigable modals and controls, clear focus rings.
- **Error Handling**: Graceful fallback for non-embeddable URLs, invalid inputs, and storage quotas.

## Data integrity rules
- Durations: Course total stored as integer minutes; sessions stored as integer seconds (`duration_seconds`).
- Session duration must be greater than zero.
- Progress percentage is strictly clamped between `0%` and `100%`.
- Remaining duration is always `Math.max(total - completed, 0)`.
- Daily goal completion is met when `todayCompletedMinutes >= dailyGoalMinutes`.
- Streaks increment only for calendar days where target minutes are achieved. Today's incomplete target does not break yesterday's streak.
