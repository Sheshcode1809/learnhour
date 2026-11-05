# Learnhour — 60-Second Master Product Launch Video Storyboard

A frame-by-frame production storyboard and motion-graphics architecture for the official **Learnhour** SaaS launch video, created with the **NullMotion** skill.

> **Draft claim check required before publication:** This storyboard predates the current launch audit. It is a creative plan, not proof of shipped behavior or accessibility. Playlist ingestion, metadata scraping, cloud synchronization, and responsive acceptance must not be shown or stated as available. Use verified current UI footage and owner-approved copy.

---

## Technical Specifications

| Parameter | Specification |
|---|---|
| **Runtime** | 60.00 Seconds |
| **Resolution** | 1920 × 1080 (Primary 16:9) & 1080 × 1920 (Social 9:16 Reel) |
| **Frame Rate** | 30.00 FPS |
| **Codec** | H.264 (High Profile, CRF 18) / AAC Stereo 192kbps |
| **Color Palette** | Warm Ivory (`#FAF8F5`), Forest Green (`#2D5A27`), Terracotta (`#C85A32`), Charcoal (`#1C1917`), White (`#FFFFFF`) |
| **Typography** | Plus Jakarta Sans (Headlines), JetBrains Mono (Metrics & Durations) |
| **Audio Engine** | Master Mixed Voiceover + Ambient Electronic Synth Soundtrack (-18dB) |

---

## Scene-by-Scene Breakdown

### Scene 1 — The Problem: Course Abandonment & Overwhelm
- **Timecode**: `00:00 – 00:07` (7.0 Seconds)
- **Visual Design**: Dark, moody cinematic opening with dark navy radial glow (`#0F172A` to `#020617`). Three realistic course cards tilt in the background with warning red progress bars: *Full-Stack Bootcamp (65h) stuck at 8%*, *Python Masterclass stalled*, *Machine Learning unopened*.
- **Kinetic Typography**: 
  - Eyebrow: `⚠️ The Online Learning Reality`
  - Headline: **"Too many courses. Too little consistency."**
  - Subtitle: *"Long courses are easier to finish with a steady daily habit."*
- **Camera Movement**: Subtle 1.05x push-in on the abandoned course backlog.
- **Voiceover**: *"We all have courses we promised ourselves we would finish. But finding the time and staying consistent is the real challenge."*
- **NullMotion Draft Beat**: `['text', 'Too many courses.', { size: 44 }], ['text', 'Too little consistency.', { size: 48, weight: 900 }]`

---

### Scene 2 — Introducing Learnhour: The 1-Hour Daily Habit
- **Timecode**: `00:07 – 00:14` (7.0 Seconds)
- **Visual Design**: Transition into Learnhour's warm ivory (`#FAF8F5`) aesthetic. Live view of the real application dashboard (`/dashboard`): personalized greeting, today's habit meter (60 min target), learning streak counter, and the *Continue Learning* hero card.
- **Kinetic Typography**: 
  - Wordmark: **"Meet Learnhour."**
  - Mission: *"One hour. Every day. Real progress."*
- **Camera Movement**: Smooth Ken Burns zoom into the primary course card and progress circle.
- **Voiceover**: *"Meet Learnhour, your personal learning and habit tracker, designed to turn big learning goals into daily achievements."*
- **NullMotion Draft Beat**: `['logo', 'Learnhour', { mark: '🎓', size: 48, sub: 'One hour. Every day. Real progress.' }], ['cards', 'Continue Learning Hero · 1h Habit Meter']`

---

### Scene 3 — Add Your Courses: Build a Daily Learning Plan
- **Timecode**: `00:14 – 00:23` (9.0 Seconds)
- **Visual Design**: Current Course Creator interface (`/courses/new`). Show a supported known preset or a manually entered course. For custom YouTube videos, show the learner confirming title and duration; do not depict playlist parsing or automatic metadata retrieval.
- **Kinetic Typography**:
  - Badge: `Build a plan that fits your learning habit`
  - Headline: **"Turn long courses into daily learning plans."**
- **Camera Movement**: Gentle vertical pan down the course generation parameters.
- **Voiceover**: *"Add a supported video or course, confirm its details, and organize your learning into a manageable daily plan."*
- **NullMotion Draft Beat**: `['window', 'Add a supported video or course'], ['list', 'A daily plan built around your learning goal']`

---

### Scene 4 — Focused Learning: The Distraction-Free Timer
- **Timecode**: `00:23 – 00:33` (10.0 Seconds)
- **Visual Design**: Live Focus Timer and Sessions workspace (`/sessions`). Large high-contrast digital stopwatch (`45:00`), live session indicators, Play/Pause/Resume action buttons, and chronological learning logs.
- **Kinetic Typography**:
  - Badge: `Focus Mode Active`
  - Headline: **"Focus. Learn. Track your progress."**
- **Camera Movement**: Center punch zoom highlighting the ticking timer and immediate feedback badge.
- **Voiceover**: *"Start your focus timer, track every learning session, and see your progress grow with every minute invested."*
- **NullMotion Draft Beat**: `['window', 'Distraction-Free Focus Stopwatch'], ['chart', 'Live Session Tracking & Daily Target Meter']`

---

### Scene 5 — Build the Habit: Cinema Player & Active Recall Dock
- **Timecode**: `00:33 – 00:43` (10.0 Seconds)
- **Visual Design**: Live Course Detail screen (`/courses/python-2026`). Features the 16:9 YouTube cinema player with custom distraction-free container, complete day-by-day lesson syllabus, and the active recall dock with self-assessment quizzes, smart timestamped notes, and Leitner flashcards.
- **Kinetic Typography**:
  - Badge: `Active Recall System`
  - Headline: **"Build consistency. Strengthen knowledge."**
- **Camera Movement**: Smooth lateral camera scan from video player to recall tools.
- **Voiceover**: *"Build learning streaks, track your daily goals, review with flashcards, and reinforce what you learn."*
- **NullMotion Draft Beat**: `['shape', 'Active Recall Dock & Daily Streaks', { bg: '#2D5A27' }], ['list', 'Smart Notes | Flashcards | Self-Check Quizzes']`

---

### Scene 6 — Your Learning, Your Way: Local-First
- **Timecode**: `00:43 – 00:51` (8.0 Seconds)
- **Visual Design**: Current Settings panel (`/settings`) highlighting local browser storage, JSON export, and guest use. Do not call the product fully private or show cross-device access. Use mobile footage only after responsive behavior is verified.
- **Kinetic Typography**:
  - Badge: `Your learning records stay in this browser`
  - Headline: **"Your learning. Your progress. Your control."**
- **Camera Movement**: Dynamic pan highlighting data export and timezone preferences.
- **Voiceover**: *"Use Learnhour without an account, keep your learning records in this browser, and export a JSON copy when you need a backup."*
- **NullMotion Draft Beat**: `['cards', 'Local browser storage · JSON export'], ['phone', 'Show only after mobile verification']`

---

### Scene 7 — Product Launch: Grand Finale & Call to Action
- **Timecode**: `00:51 – 01:00` (9.0 Seconds)
- **Visual Design**: Grand launch brand card on Warm Ivory (`#FAF8F5`) with Forest Green (`#2D5A27`) glow and brand mark (`🎓`). Prominently features the wordmark, core value proposition badges, and the official repository URL.
- **Kinetic Typography**:
  - Brand Mark: `🎓`
  - Primary Logo: **LEARNHOUR**
  - Core Tagline: **"Learn consistently. Progress every day."**
  - Action Button: `Start Your Learning Journey Today →`
  - Repository URL: `https://github.com/Sheshcode1809/learnhour`
- **Camera Movement**: Elegant slow pull-back reveal settling on the final CTA.
- **Voiceover**: *"Stop collecting courses. Start completing them. Learnhour. Learn consistently. Progress every day."*
- **NullMotion Draft Beat**: `['logo', 'LEARNHOUR', { mark: '🎓', size: 54, sub: 'Start your learning journey today.' }], ['text', 'github.com/Sheshcode1809/learnhour', { size: 24 }]`

---

## Deliverables Summary

1. `learnhour-launch-60s.mp4`: Full HD 1080p 16:9 master video (60s).
2. `learnhour-launch-9x16.mp4`: Vertical 1080x1920 video for Instagram Reels, YouTube Shorts, and TikTok.
3. `thumbnail.jpg`: High-resolution 1920x1080 video launch poster.
4. `VOICEOVER_SCRIPT.txt`: Synchronized audio transcript with scene cues.
5. `STORYBOARD_60S.md`: This full production document.
6. **NullMotion Studio (`http://127.0.0.1:4343`)**: Fully registered and interactive frame-by-frame breakdown engine.

