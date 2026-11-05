# Learnhour — Motion Graphics Launch Video Guide

This guide details how the **NullMotion** skill (`.agents/skills/nullmotion/`) is configured to create, preview, and export the official motion-graphics launch video for **Learnhour**.

> **Publication note:** The timeline below is a draft. Verify the footage and claims against the current product before publishing. Playlist ingestion, cloud synchronization, responsive acceptance, and legal/privacy approval are not established by the existence of these video files.

---

## 🎬 1. Official 60-Second Product Launch Video

*Reference ID: `learnhour-app` | Resolution: 1920x1080 @ 30fps | Format: H.264 / AAC 192k*

The launch video pairs high-resolution screen recordings of the real Learnhour application with synchronized **HyperFrames** motion graphics drafts underneath.

| Timeline | Scene | Visual / Route | Kinetic Typography & Audio |
| :--- | :--- | :--- | :--- |
| **0:00 – 0:07** | **The Problem** | Dark cinematic course backlog, stalled progress bars | *"Too many courses. Too little consistency."*<br>Voiceover: *"We all have courses we promised ourselves we would finish..."* |
| **0:07 – 0:14** | **Introducing Learnhour** | Live Dashboard (`/dashboard`), habit meter, greeting | *"Meet Learnhour. One hour. Every day. Real progress."*<br>Voiceover: *"Meet Learnhour, your personal learning and habit tracker..."* |
| **0:14 – 0:23** | **Add Your Courses** | Course Creator (`/courses/new`), supported video or manual course entry | *"Turn long courses into daily learning plans."*<br>Voiceover: *"Add a supported video or course, confirm its details..."* |
| **0:23 – 0:33** | **Focused Learning** | Focus Stopwatch (`/sessions`), timer controls, live log | *"Focus. Learn. Track your progress."*<br>Voiceover: *"Start your focus timer, track every learning session..."* |
| **0:33 – 0:43** | **Build the Habit** | Cinema Player (`/courses/python-2026`), Recall Dock | *"Build consistency. Strengthen knowledge."*<br>Voiceover: *"Build learning streaks, track your daily goals..."* |
| **0:43 – 0:51** | **Your Learning, Your Way** | Settings (`/settings`), local browser storage and JSON export | *"Your learning. Your progress. Your control."*<br>Voiceover: *"Keep your learning records in this browser and export a JSON copy..."* |
| **0:51 – 1:00** | **Product Launch** | Warm ivory grand brand reveal, badges, final CTA | *"LEARNHOUR · Learn consistently. Progress every day."*<br>Voiceover: *"Stop collecting courses. Start completing them..."* |

---

## 📁 2. Generated Artifacts & Files

| Deliverable | File Path | Description |
| :--- | :--- | :--- |
| **16:9 Master Video** | [`learnhour-launch-60s.mp4`](file:///s:/Projects/productivity%20project/learnhour-launch-60s.mp4) | 1920x1080 Full HD 60s launch video with dual-track voiceover & music |
| **9:16 Social Reel** | [`learnhour-launch-9x16.mp4`](file:///s:/Projects/productivity%20project/learnhour-launch-9x16.mp4) | 1080x1920 vertical video for Instagram Reels, YouTube Shorts, & TikTok |
| **Launch Thumbnail** | [`thumbnail.jpg`](file:///s:/Projects/productivity%20project/thumbnail.jpg) | 1920x1080 crisp YouTube / social launch poster |
| **Voiceover Script** | [`VOICEOVER_SCRIPT.txt`](file:///s:/Projects/productivity%20project/VOICEOVER_SCRIPT.txt) | Complete spoken script with scene timecodes and voice direction |
| **Storyboard** | [`STORYBOARD_60S.md`](file:///s:/Projects/productivity%20project/STORYBOARD_60S.md) | Comprehensive scene-by-scene motion design documentation |

---

## 🚀 3. How to Preview & Export in NullMotion Studio

The NullMotion studio server runs locally with zero external dependencies.

### Step 1: Open NullMotion Studio
Navigate to:
```
http://127.0.0.1:4343
```
*(Reference `#1` is pre-selected: **Learnhour · Official 60s Launch Film**)*

### Step 2: Controls & Timeline Scrubbing
- **Space**: Play / Pause video and HyperFrames drafts in perfect sync.
- **← / → Arrow Keys**: Step frame-by-frame (1 frame per tap).
- **Shift + ← / →**: Jump through the 7 scene cut points.
- **J / K / L**: Scrub backward, pause, and scrub forward at variable speeds.

### Step 3: Exporting Custom MP4 Videos
1. Click the **"Export Film"** button in the top-right toolbar.
2. Select your export mode:
   - **Composite (Film + HyperFrames Draft)**: Exports the split-screen sequence.
   - **HyperFrames Draft Only**: Exports pure animated graphic frames.
   - **Source Film Only**: Clean video pass-through.
3. The in-browser WebCodecs engine renders the 1080p MP4 directly to your Downloads folder at 24Mbps.
