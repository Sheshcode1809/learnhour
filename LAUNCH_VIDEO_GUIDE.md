# Learnhour — Motion Graphics Launch Video Guide

This guide details how the **NullMotion** skill (`.agents/skills/nullmotion/`) is configured to create, preview, and export the official motion-graphics launch video for **Learnhour**.

---

## 🎬 1. Launch Film Architecture

NullMotion pairs a finished motion graphics ad sequence on top with frame-accurate **HyperFrames** motion graphics drafts underneath.

We have authored two distinct motion graphics sequences for **Learnhour**:

### Sequence A: The Full SaaS Launch Breakdown (63 seconds)
*Reference ID: `227b019e7968` | 1920x1080 @ 60fps*

| Timeline | Section Name | Visual Beat 1 | Visual Beat 2 | Story & Motion Concept |
| :--- | :--- | :--- | :--- | :--- |
| **0:00 – 0:08** | **Hook** | `text`: "92% of online courses" | `window`: "Are Never Finished" | Highlights the core pain point: abandoned tutorials. |
| **0:08 – 0:17** | **Problem** | `text`: "Long 80-hour playlists" | `notify`: "Overwhelmed & no habit" | Demonstrates course fatigue and information overload. |
| **0:17 – 0:24** | **Solution** | `burst`: Abstract kinetic energy | `logo`: **Learnhour** (⏱️) | Dramatic brand reveal: "1 Hour Every Day". |
| **0:24 – 0:32** | **Generator** | `phone`: "Paste any YouTube video" | `cards`: "Auto-Split into 1h Days" | Shows YouTube link ingestion and automatic syllabus generation. |
| **0:32 – 0:39** | **Focus Timer** | `window`: "Distraction-Free Stopwatch" | `list`: "Live Focus Ticker \| Zero Clutter \| Confetti" | Displays clean stopwatch UI with milestone feedback. |
| **0:39 – 0:48** | **Active Study** | `cards`: "Active Recall Tools" | `list`: "Quizzes \| Smart Notes \| Flashcards" | Highlights interactive learning features. |
| **0:48 – 0:56** | **Streaks** | `window`: "Timezone-Aware Habits" | `chart`: "Daily Streak: 14 Days" | Kinetic line chart showing streak progression. |
| **0:56 – 1:03** | **End Card** | `shape`: "Master any skill in 1h/day" | `logo`: **Learnhour** (Free & Open Source) | Punchy closing CTA with brand mark. |

---

### Sequence B: 30-Second Fast Punchy Promo (30 seconds)
*Reference ID: `69614b10fa87` | 1920x1080 @ 60fps*

- **0:00 – 0:04**: Giant typography hook: *"Online courses — too long"*
- **0:04 – 0:08**: Kinetic geometric burst: *"The 1-Hour Habit"*
- **0:08 – 0:13**: Logo reveal: **Learnhour (⏱️)**
- **0:13 – 0:17**: Phone mockup showing instant YouTube course generation
- **0:17 – 0:22**: Active study tools (Recall Quizzes & Smart Notes)
- **0:22 – 0:26**: Flame streak chart
- **0:26 – 0:30**: End card CTA

---

## 🚀 2. How to Preview & Export

The NullMotion studio server runs locally with zero external dependencies.

### Step 1: Launch the Studio
```bash
cd .agents/skills/nullmotion
npm start
```
*(The studio starts at `http://127.0.0.1:4343`)*

### Step 2: Open in Chrome or Edge
Navigate to:
```
http://127.0.0.1:4343
```

### Step 3: Keyboard Controls & Scrubbing
- **Space**: Play / Pause film & motion drafts in sync.
- **`,` (comma)**: Step backward 1 single frame (1/30s).
- **`.` (period)**: Step forward 1 single frame (1/30s).
- **Left / Right Arrow**: Jump between sections.
- **Home / End**: Jump to the start or end of the film.

### Step 4: Export Frame-Accurate 1080p MP4
1. Click the **Download** dropdown in the top right.
2. Select **"Whole preview"**.
3. Chrome/Edge will use **WebCodecs** and **mp4-muxer** to render every single frame at 24 Mbps (1920x1080) with full synced audio.
4. The `.mp4` file will automatically download to your computer.

---

## 🛠️ Customizing the Drafts

To adjust text, beat types, or colors:
1. Open [`.agents/skills/nullmotion/public/references/drafts.json`](file:///s:/Projects/productivity%20project/.agents/skills/nullmotion/public/references/drafts.json).
2. Modify any beat text or options (e.g. `size`, `y`, `stack`, `bg`).
3. Refresh `http://127.0.0.1:4343` to see the live updates instantly.

