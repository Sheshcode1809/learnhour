# Learnhour

Learnhour helps people organize self-paced video courses into manageable daily study sessions. The product is local-first: course data and study history are stored in the browser on the current device.

## What it does

- Create and manage courses with a user-confirmed title and duration.
- Accept supported YouTube video URLs and provide prepared course plans.
- Plan lessons around a daily pace, track lesson completion, and record focused or manually logged study sessions.
- Review streaks, weekly activity, notes, quizzes, and flashcards.
- Export courses, sessions, and preferences as JSON from Settings.

Custom YouTube metadata is not fetched automatically. Playlist ingestion, chapter extraction, and course-data synchronization are not implemented. Embedded playback depends on YouTube availability and the video's embed settings.

## Data and accounts

Courses, lessons, notes, preferences, and sessions are stored in browser local storage. They do not sync between devices or to a Learnhour account. Clearing browser site data may remove them; export a JSON copy when you need a backup. There is no backup import or server-side recovery flow yet.

Guest use is available without credentials. Supabase Auth can be enabled separately for login, but that does not connect learning records to a database. The SQL migration is a starter schema; it has not been connected to the application or verified against the local data model. Do not advertise or enable cloud synchronization based on that migration alone.

## Run locally

Requirements: Node.js 18.17 through 22.x and npm.

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. Guest mode works without environment credentials. The default environment example disables Supabase Auth.

## Environment

See [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md) for the supported variables. Set `NEXT_PUBLIC_APP_URL` to the final HTTPS origin before a production build so metadata and the sitemap use the correct domain. Set `NEXT_PUBLIC_SUPPORT_EMAIL` before public launch.

## Checks

```bash
npm test
npx tsc --noEmit
npm run lint
npm run build
npm run test:responsive # requires the app at localhost:3000 and Chrome
```

The responsive check tests route loading and horizontal overflow at six widths. It does not overwrite files in `screenshots/` and is not a full interaction or accessibility test. See [TEST_REPORT.md](TEST_REPORT.md) for current results and limits.

## Deployment and release

See [DEPLOYMENT.md](DEPLOYMENT.md), [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md), and [LAUNCH_READINESS.md](LAUNCH_READINESS.md). Production deployment remains gated on final domain, support contact, approved legal terms/privacy notice, license decision, and the checks listed in those documents. Supabase authentication and cloud storage must be validated independently before enabling.

No `LICENSE` file is currently present. The repository owner must choose and add a license before making public licensing claims.

## Documentation index

### Launch and operations

- [Changes handoff for AntiGravity](changes.md)
- [Production audit](PRODUCTION_AUDIT.md)
- [Launch readiness](LAUNCH_READINESS.md)
- [Production checklist](PRODUCTION_CHECKLIST.md)
- [Test report](TEST_REPORT.md)
- [Bug report](BUG_REPORT.md)
- [Security audit](SECURITY_AUDIT.md)
- [Environment setup](ENVIRONMENT_SETUP.md)
- [Deployment guide](DEPLOYMENT.md)
- [Supabase migration plan](SUPABASE_MIGRATION_PLAN.md)

### Product and design references

- [Product requirements](PRD.md) · [Functional requirements](REQUIREMENTS.md) · [Acceptance tests](ACCEPTANCE_TESTS.md)
- [Technical architecture](TECHNICAL_ARCHITECTURE.md) · [Data model](DATA_MODEL.md) · [Implementation plan](IMPLEMENTATION_PLAN.md)
- [UI/UX audit](UI_UX_AUDIT.md) · [UI/UX implementation notes](UI_UX_IMPLEMENTATION.md) · [UI/UX verification](UI_UX_TEST_REPORT.md) · [UI/UX specification](UI_UX_SPEC.md)
- [Design system](DESIGN_SYSTEM.md) · [Changelog](CHANGELOG.md)
- [Course tracker overview](COURSE_LEARNING_TRACKER_README.md) · [Antigravity master prompt](AGENT_PROMPT.md)
- [Launch video guide](LAUNCH_VIDEO_GUIDE.md) · [60-second storyboard](STORYBOARD_60S.md)
