# UI / UX Specification

> **Status:** Design intent, not a claim of completed visual QA. See `UI_UX_AUDIT.md` and `UI_UX_TEST_REPORT.md` for screenshot findings and current verification status.

## Visual direction
Calm, editorial, distraction-free learning dashboard directly matching the reference video:
- **Background**: Warm off-white / cream (`#FAF8F5` / `#F5F2EB`).
- **Primary text**: Deep charcoal (`#1C1917` / `#1F2937`).
- **Secondary text**: Muted warm gray (`#6B7280` / `#78716C`).
- **Accent primary**: Forest/olive muted green (`#2D5A27` / `#234E24`) for active buttons, completed statuses, and primary CTA.
- **Accent secondary**: Warm terracotta/orange (`#C85A32` / `#EA580C`) for streak fire and highlights.
- **Cards & Surfaces**: Clean white (`#FFFFFF`) or soft ivory with light borders (`#E5E0D8`) and soft shadows (`shadow-sm`).
- **Header Artwork**: Illustrated pastel scenic nature banner (mountains, lake, pine trees, serene sky) creating an inviting learning atmosphere.
- **Typography**: Clean, readable modern sans-serif (Inter/Geist) with prominent numbers and clear hierarchy.

## App Navigation & Shell
### Left Sidebar (Desktop) / Drawer & Bottom Nav (Mobile)
- **App Brand**: Graduation mortarboard icon + **"Learnhour"** logo.
- **Quick Action**: `+ New course` green pill button.
- **Navigation Links**:
  - `Today` (Daily targets, streak, active sessions, quick stats)
  - `My courses` (Full course catalog, filters, progress overview)
  - `Sessions` (Study timer, manual session logger, learning history)
  - `Settings` (Daily target minutes, timezone, local data export)
- **Recents Section**: Fast-switching list of in-progress courses.
- **User Profile Pill**: Name, avatar, and tier badge ("Free beta").

### Main Views
1. **New Course / Quick Paste Hero**:
   - Scenic banner with centered floating card: "Paste a long video. Get a course."
   - URL input with "Build my course" button.
   - Quick selector for manual creation or pre-configured sample masterclasses (e.g. 10hr Python, 8hr Neural Networks, 12hr System Design).
2. **Course Day-Plan Preview**:
   - Day breakdown cards (Day 1: 60m, Day 2: 60m, etc.).
   - Lesson checkmarks, daily goal pace selector (e.g. 30m, 60m, full course).
   - "Start learning" CTA.
3. **Interactive Course Player**:
   - Top bar with back button, course title, and `Mark as completed` green button.
   - Left / main column:
     - Embedded YouTube video player or custom video frame with controls.
     - Lesson details, title, provider/channel link, autoplay next lesson toggle, and description.
   - Right column:
     - Course title and progress summary ("Lesson X of Y").
     - Day tabs (`Day 1 *`, `Day 2`, `Day 3`...).
     - Interactive lesson list with thumbnails, durations, and active status indicator.
     - **Study Tools Section**:
       - `Quiz` card (launches interactive multiple-choice quiz modal).
       - `My notes` card (launches timestamped notes modal).
       - `Flashcards` card (interactive flippable flashcard deck).
4. **Dashboard / "Today" View**:
   - Daily target card (circular or bar progress: e.g. 45/60 min completed).
   - Streak card (fire icon, current streak, best streak).
   - "Continue Learning" hero card for the last active course.
   - Weekly activity bar chart showing study minutes by day.
   - Active courses grid with progress bars and remaining hours.
5. **Session Management & Floating Timer**:
   - Persistent study timer widget accessible across all pages.
   - Start / Pause / Resume / Finish controls.
   - Automatic session creation and course progress calculation upon finish.
   - Manual session modal for logging past offline study sessions.

## Responsive Breakpoints
- **Mobile (< 768px)**: Collapsible hamburger menu, single-column dashboard cards, stacked video player, and sticky bottom timer bar.
- **Tablet (768px - 1024px)**: Compact sidebar navigation, flexible 2-column dashboard layout.
- **Desktop (>= 1024px)**: Full sidebar, 2-column player layout (video on left, lessons & study tools on right).
