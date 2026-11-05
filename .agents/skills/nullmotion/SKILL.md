---
name: nullmotion
description: Frame-by-frame motion graphics breakdown and launch film preview engine. Use for creating, studying, previewing, and exporting motion-graphics launch videos, ad sequences, SaaS product previews, and HyperFrames motion graphics breakdowns into 1080p WebCodecs MP4 videos.
---

# NullMotion Skill

NullMotion is a high-performance, zero-dependency motion graphics engine and launch video breakdown studio. It pairs finished motion graphics films with rough, frame-accurate HyperFrames drafts (text, logo, phone, window, cards, chart, burst, etc.) and exports the composite video as a 1920x1080 24Mbps MP4 via browser WebCodecs.

## Core Capabilities

1. **Launch Sequence Breakdown**: See how a finished SaaS motion-graphics ad is constructed scene by scene, beat by beat.
2. **HyperFrames Engine (`public/drafts.mjs`)**: 20+ procedural motion graphics beat types:
   - `text`: Kinetic typography, variable font sizing, custom alignment.
   - `logo`: Brand mark + wordmark reveal.
   - `cards`: Responsive card grid animations.
   - `phone` / `window`: Device mockups and UI viewport animations.
   - `chart`: Kinetic data and metric visualizations.
   - `list`: Dynamic checklist and feature item pop-ins.
   - `burst` / `shape`: Abstract geometric motion accents.
3. **Frame-Accurate MP4 Exporter**: Uses WebCodecs and `mp4-muxer` to render 60fps/30fps 1080p video without dropped frames.

## Quick Usage

Start the studio server:
```bash
cd .agents/skills/nullmotion
npm start
```
Open **http://127.0.0.1:4343** in Chrome or Edge to scrub the timeline and export the launch video.
