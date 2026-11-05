# Learnhour UI/UX audit

**Review date:** 2026-11-05
**Evidence:** Existing screenshots in `screenshots/` and `screenshots/responsive/`, plus source review. No screenshots were rewritten during this audit.

## What the screenshots showed

- The warm ivory, forest green, terracotta, and charcoal system is recognizable and should remain.
- At 360px, the dashboard's idle floating Quick Timer covered a metric card.
- At 360px, the course-player sticky header crowded the lesson title and completion action.
- The tablet player capture showed YouTube's unavailable-video message inside the frame.
- Public copy implied automatic playlist/video metadata that the code does not fetch.
- Account screens had horizontal separators; the current implementation uses a non-wrapping separator label.

## Changes made

- Hid the idle floating timer on the dashboard, where inline timer actions already exist. Moved the active/floating timer above the mobile bottom edge and reserved more page-bottom space.
- Stacked the player action bar on narrow screens and added a permanent external source link below allowlisted embeds.
- Kept the auth separator label on one line and standardized account pages on Learnhour branding.
- Kept the `1-hour/day` phrase together in the landing headline and replaced unsupported playlist/metadata promises with learner-confirmed video title/duration copy.
- Added public About, draft Privacy, draft Terms, and Contact pages with clear local-storage behavior.
- Added storage failure messaging and local-only disclosure; changed reset/export labels so they match actual behavior.
- Added a generated Open Graph image and private-route noindex metadata.

## Visual verification status

The code changes have not been reviewed in a live browser at 360, 390, 768, 1024, 1440, or 1920px. The updated `scripts/test-responsive.mjs` checks all listed app/public routes for HTTP failure, blank content, JavaScript page errors, and horizontal overflow, and it writes no screenshots. Headless Chrome failed to launch in the sandbox; the elevated execution was rejected by automatic review because it considered the prior screenshot behavior a risk. Do not claim responsive pass until a browser run is completed.

No formal WCAG audit, contrast measurement, keyboard-only interaction audit, Lighthouse run, or cross-browser check was completed. Support text and some controls remain below 12px in existing views.

## Typography note

Build-time Google Fonts fetching failed in the restricted environment. The layout now uses system sans/monospace stacks so production builds do not depend on Google Fonts at build time. The original Plus Jakarta Sans and JetBrains Mono faces are not bundled; restore them from approved local font assets if exact brand typography is required.
