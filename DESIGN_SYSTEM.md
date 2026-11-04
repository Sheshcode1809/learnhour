# Courseit Design System Specifications

**Created with**: UI/UX Pro Max Design Intelligence  
**Version**: 2.0.0  
**Design Persona**: Minimal • Premium • Calm • Modern • Focus-Oriented • Professional  

---

## 1. Design Principles

1. **Quiet Authority (Editorial Calm)**: Never use jarring neon accents or noisy gamification. The visual environment should lower anxiety around learning long courses and foster sustained cognitive focus.
2. **Tactile Clarity**: Every interactive element (buttons, tabs, lessons, timer cards) must feel tangible, responsive, and unambiguous. Hover states use gentle 150–200ms ease-out transitions.
3. **Information Respect**: Present the exact metric the learner needs in the moment: *How much have I completed today? What lesson is next? What is my active streak?*
4. **Adaptive Modularity**: All components adapt naturally from 360px mobile viewports up to 1920px 4K displays with zero horizontal overflow or clipping.

---

## 2. Color Token Architecture

### 2.1 Core Semantic Palette

| Token | Hex Value | Usage / Meaning | Contrast vs `#FAF8F5` |
| :--- | :--- | :--- | :--- |
| `--bg-base` | `#FAF8F5` | Primary application background (warm ivory) | N/A |
| `--bg-surface` | `#FFFFFF` | Cards, modals, elevated surfaces | 1.05:1 (bordered) |
| `--bg-subtle` | `#F5F2EB` | Secondary buttons, badge fills, hover states | 1.08:1 |
| `--border-subtle` | `#E7E2D5` | Card outlines, dividers, input borders | 1.2:1 |
| `--border-strong` | `#D1C9B8` | Focused inputs, active borders | 1.6:1 |
| `--text-primary` | `#1C1917` | High-emphasis headings, titles, active numbers | **15.8:1 (AAA)** |
| `--text-secondary`| `#44403C` | Body copy, lesson names, button labels | **9.2:1 (AAA)** |
| `--text-muted` | `#78716C` | Supporting labels, timestamps, metadata | **4.8:1 (AA)** |
| `--accent-forest` | `#2D5A27` | Primary progress bars, completed badges, success | **6.4:1 (AA)** |
| `--accent-forest-bg`| `#E2EDE2` | Soft forest badge background | 1.15:1 |
| `--accent-terracotta`| `#C85A32` | Streak flames, critical calls to action | **4.9:1 (AA)** |
| `--accent-terracotta-bg`| `#FCE9E2`| Soft terracotta pill background | 1.1:1 |

### 2.2 Functional Accents
- **Success / Goal Met**: Forest Green `#2D5A27`
- **Active Streak / Energy**: Terracotta `#C85A32`
- **Paused State / Warning**: Warm Amber `#D97706`
- **Danger / Deletion**: Muted Crimson `#BE123C`

---

## 3. Typography Scale

Pairing: **Plus Jakarta Sans / Inter** (UI Sans) + **Editorial Serif Accent** + **JetBrains Mono** (Numbers).

| Token | Font Size | Line Height | Weight | Letter Spacing | Typical Element |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-display` | `2.5rem (40px)` | `1.1` | `900` | `-0.03em` | Hero Headings |
| `text-h1` | `1.75rem (28px)`| `1.2` | `800` | `-0.02em` | Page Titles, Dashboard Welcome |
| `text-h2` | `1.25rem (20px)`| `1.3` | `700` | `-0.015em`| Section Headers, Card Titles |
| `text-h3` | `1.0rem (16px)` | `1.4` | `600` | `-0.01em` | Modal Headers, Course Card Title |
| `text-body` | `0.875rem (14px)`| `1.5` | `400 / 500`| `normal` | General descriptions, forms |
| `text-small` | `0.75rem (12px)` | `1.4` | `500` | `0.01em` | Metadata, tags, lesson counts |
| `text-caption`| `0.6875rem (11px)`| `1.3` | `600` | `0.04em` | Micro pills, uppercase category tags |
| `text-mono` | `Font Mono` | `1.0` | `700 / 800`| `-0.02em` | Digital Timer, Streak Counters |

---

## 4. Spacing, Radii & Elevation

### 4.1 Spacing Scale (8pt Grid)
- `space-1`: `4px` (micro gaps, pill spacing)
- `space-2`: `8px` (button icon gap, badge padding)
- `space-3`: `12px` (standard input padding, compact card gap)
- `space-4`: `16px` (card internal padding, mobile gutters)
- `space-6`: `24px` (desktop card padding, section gap)
- `space-8`: `32px` (large section divider)
- `space-12`: `48px` (hero vertical breathing room)

### 4.2 Border Radius
- `rounded-lg`: `10px` (inputs, small tool buttons, pills)
- `rounded-xl`: `14px` (standard buttons, dropdowns, menu items)
- `rounded-2xl`: `18px` (course cards, session rows, timer widgets)
- `rounded-3xl`: `24px` (major feature cards, modals, hero banners)
- `rounded-full`: `9999px` (avatar circles, streak tags, floating timer)

### 4.3 Shadows
- `shadow-subtle`: `0 1px 2px 0 rgba(28, 25, 23, 0.04)`
- `shadow-card`: `0 2px 6px -1px rgba(28, 25, 23, 0.06), 0 1px 4px -1px rgba(28, 25, 23, 0.04)`
- `shadow-elevated`: `0 10px 25px -3px rgba(28, 25, 23, 0.08), 0 4px 10px -2px rgba(28, 25, 23, 0.03)`
- `shadow-modal`: `0 25px 50px -12px rgba(28, 25, 23, 0.25)`

---

## 5. Micro-Interactions & Animation Guidelines

1. **Button States**:
   - `hover:scale-[1.01]` or `hover:bg-forest-700` with `transition-all duration-150 ease-out`.
   - `active:scale-[0.98]` gives tactile click feedback.
2. **Progress Bars**:
   - CSS width transitions using `transition-all duration-500 ease-out` with smooth easing.
3. **Card Hovers**:
   - Subtle vertical float `-translate-y-0.5` and border enhancement `border-stone-300`.
4. **Reduced Motion**:
   - All animations automatically disable or degrade to instant state changes when `@media (prefers-reduced-motion: reduce)` is active.
