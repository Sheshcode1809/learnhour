# Learnhour UI implementation notes

## Visual system

- Warm ivory `#FAF8F5`, forest green `#2D5A27`, terracotta `#C85A32`, and charcoal text remain the interface palette.
- Tailwind utility classes define spacing and responsive reflow; cards, controls, and dialogs use the existing rounded editorial style.
- Timer and metric displays retain monospace styling. Text falls back to local system sans/monospace fonts because the Google Fonts build fetch was unavailable in this environment. Plus Jakarta Sans and JetBrains Mono are not bundled.

## Changes in this pass

- Account screens keep the email separator horizontal and show guest mode separately from optional account auth.
- The dashboard hides its idle floating timer because inline timer controls already exist. An active timer remains available, positioned above the mobile bottom area; content reserves extra space below.
- The player action bar stacks on small screens. It keeps a visible source-video link if an embed is unavailable.
- The landing headline protects the `1-hour/day` phrase from breaking at the hyphen and explains that custom title/duration are learner-confirmed.
- Storage errors appear in a shared warning banner, with inline messages in core save/export/reset flows.
- About and Contact pages explain the actual local-first service. Privacy/Terms pages are explicitly drafts and noindex until owner/legal review.

## Still to verify

- Real browser screenshots/interactions at 360/390/768/1024/1440/1920px.
- Keyboard-only focus order, dialog focus return, screen-reader announcements, and touch-target size.
- Color contrast measurements and actual media fallback appearance for unavailable YouTube videos.
- Visual output after final font and production-domain decisions.

Do not interpret this implementation note as a WCAG certification or a completed visual regression pass.
