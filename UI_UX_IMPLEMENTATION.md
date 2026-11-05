# Courseit UI/UX Redesign — Implementation Architecture

This document details the complete design system implementation and interface overhaul for **Courseit (Course Learning Tracker)** using the installed **UI/UX Pro Max** skill intelligence (`.agents/skills/ui-ux-pro-max/`).

---

## 1. Executive Summary

- **Product Category**: Learning Management / Focus & Habit Tracker SaaS
- **Target Persona**: Self-directed learners, developers, and students studying long online video courses and masterclasses in consistent 1-hour daily blocks.
- **Brand Archetype**: Calm, Minimal, Focus-Oriented, Editorial, and Modern.
- **Core Design Principles**:
  1. **Hierarchy Inversion**: Put the current study task ("Continue Learning") above the fold before analytical telemetry.
  2. **Distraction-Free Focus**: High-contrast, tabular monospace timer typography, calm off-white canvas (`#FAF8F5`), and subdued borders (`#E7E2D5`).
  3. **Editorial Typography**: Pairing **Plus Jakarta Sans** for crisp legible UI and metrics with **JetBrains Mono** for timers and timestamps.
  4. **Tactile Feedback**: Intentional micro-interactions (soft scale on active buttons, toast confirmations, confetti upon reaching habit goals).

---

## 2. Token Architecture & Theme Extensions

### 2.1 Color Tokens
| Semantic Role | Token Name | Hex Code | Purpose |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `cream-100` / `cream-50` | `#FAF8F5` / `#FDFCFA` | Warm ivory background preventing eye strain |
| **Surface Card** | `white` | `#FFFFFF` | Elevated content containers |
| **Primary Accent** | `forest-600` / `forest-700` | `#2D5A27` / `#23471F` | Progress bars, primary CTAs, completion badges |
| **Action Accent** | `terracotta-500` / `600` | `#C85A32` / `#AE4C28` | Streak flames, finish timer actions, urgent badges |
| **Primary Typography**| `charcoal-900` / `800` | `#1C1917` / `#292524` | High-contrast headings and body text |
| **Subdued Typography**| `charcoal-500` / `400` | `#78716C` / `#A8A29E` | Secondary captions, helper hints, labels |
| **Structural Borders**| `sand-border` | `#E7E2D5` | Clean hairline container and divider boundaries |

### 2.2 Typography Scale
- **Headings**: `Plus Jakarta Sans` (`font-sans`), weights: 700 (Bold), 800 (Extra Bold), 900 (Black).
- **Body & Captions**: `Plus Jakarta Sans` (`font-sans`), weights: 400 (Regular), 500 (Medium), 600 (Semi-bold).
- **Numerics & Timers**: `JetBrains Mono` (`font-mono tabular-nums`), weights: 500, 700, 900.

---

## 3. Redesigned Pages & Components

### 3.1 Dashboard (`src/app/dashboard/page.tsx`)
- **Top "Continue Learning" Hero**: Instantly shows the user's active course, next pending lesson title, duration, day number, and a direct "Resume Study" button.
- **Daily Habit Meter**: Clean gauge comparing `todayMinutes` vs `dailyGoalMinutes` with a progress bar and remaining minutes indicator.
- **Streak & Flame Badge**: Displays current streak vs personal best with motivation copy.
- **7-Day Interactive Activity Chart**: Monospace day labels, relative bar height representing study duration, hover tooltip showing exact minutes, and mobile-friendly tap support.
- **In-Progress Courses Grid**: Card view with completion status pills, progress bars, and direct link to video player.
- **Recent Study Sessions**: Chronological list of completed sessions with monospace timestamps and course metadata.

### 3.2 Course Library (`src/app/courses/page.tsx`) & CourseCard (`src/components/courses/CourseCard.tsx`)
- **CourseCard**:
  - 16:9 thumbnail frame with branded fallback gradient if external image fails to load.
  - Duration pill in bottom right corner.
  - Completed badge when progress hits 100%.
  - Quick action menu (Start Timer, Edit, Delete).
  - Hover elevation (`-translate-y-0.5`) with soft shadow.
- **Library View**:
  - Filter tabs: All, In Progress, Completed.
  - Instant client-side search input.
  - Empty state with quick-enroll triggers for curated masterclasses.

### 3.3 Focus Timer & Sessions (`src/app/sessions/page.tsx`)
- **Distraction-Free Timer Card**:
  - Large monospace stopwatch (`font-mono text-5xl sm:text-7xl tabular-nums`).
  - Course selection dropdown to associate study time with specific courses.
  - Clear state pills: "Ready to Focus", "Focus Session Active", "Session Paused".
  - Tactile controls: Start, Pause, Resume, Finish & Record, Reset.
- **Session History Table & Mobile Stack**:
  - Desktop: Full tabular view with date/time, course title, duration, notes, edit, and delete actions.
  - Mobile (`< sm`): Responsive card stack preventing horizontal overflow on 360px and 390px viewports.
  - Modals: Offline manual study logger (with backdating support) and session editor with input validation.

### 3.4 Course Player & Unified Study Dock (`src/app/courses/[id]/page.tsx`)
- **Cinema Video Container**:
  - 16:9 aspect ratio with allowlisted YouTube iframe embed.
  - Branded fallback backdrop if offline or external link.
  - External link button for non-embeddable courses.
- **Lesson Metadata Bar**:
  - Current day and lesson index pills.
  - Quick "Mark Completed" toggle with optional auto-advance.
  - "Focus timer on this lesson" button launching active stopwatch with lesson context.
- **Unified Study Dock**:
  - Day selector tabs (Day 1, Day 2, etc.).
  - Interactive lesson list with active item ring and checkmark indicators.
  - Study tools dock: Recall Quiz, Smart Notes, Day Plan, Flashcards modals.

### 3.5 Settings (`src/app/settings/page.tsx`)
- **Daily Study Target**: Preset duration pills (30m, 45m, 60m, 90m, 120m) plus custom input.
- **Profile & Timezone**: Learner name and IANA timezone validation with quick suggestion chips.
- **Storage Telemetry**: Local-first storage status and Supabase cloud migration schema indicator.
- **Backup & Reset**: One-click JSON backup export and confirmation dialog for demo reset.

---

## 4. Verification & Responsive Compliance
- Built with standard Tailwind CSS and semantic HTML5.
- Tested across 360px, 390px, 768px, 1024px, 1440px, and 1920px viewports with zero horizontal overflow.
- Strict TypeScript (`npx tsc --noEmit`) passes with 0 errors.
- ESLint (`npm run lint`) passes with 0 warnings.
- Test suite (`npm test`) passes 19/19 unit tests.

