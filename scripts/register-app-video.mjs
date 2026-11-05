import fs from 'fs';
import path from 'path';

const showcaseRefDir = path.resolve(process.cwd(), '.agents/skills/nullmotion/showcase/references');
const publicRefDir = path.resolve(process.cwd(), '.agents/skills/nullmotion/public/references');

if (!fs.existsSync(publicRefDir)) {
  fs.mkdirSync(publicRefDir, { recursive: true });
}

// 1. Catalog
const catalogPath = path.join(showcaseRefDir, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

const learnhourCatalogEntry = {
  id: 'learnhour-app',
  name: 'Learnhour · 1-Hour Daily Habit Launch',
  duration: 30.06,
  width: 1920,
  height: 1080,
  src: '/media/references/learnhour-app.mp4',
  poster: '/references/learnhour-app-0.jpg',
  segments: [
    { ref: 'learnhour-app', in: 0, out: 5.01, part: 1, poster: '/references/learnhour-app-0.jpg' },
    { ref: 'learnhour-app', in: 5.01, out: 10.02, part: 2, poster: '/references/learnhour-app-1.jpg' },
    { ref: 'learnhour-app', in: 10.02, out: 15.03, part: 3, poster: '/references/learnhour-app-2.jpg' },
    { ref: 'learnhour-app', in: 15.03, out: 20.04, part: 4, poster: '/references/learnhour-app-3.jpg' },
    { ref: 'learnhour-app', in: 20.04, out: 25.05, part: 5, poster: '/references/learnhour-app-4.jpg' },
    { ref: 'learnhour-app', in: 25.05, out: 30.06, part: 6, poster: '/references/learnhour-app-5.jpg' },
  ],
};

// Filter out if already present, then prepend
catalog.references = [learnhourCatalogEntry, ...catalog.references.filter((r) => r.id !== 'learnhour-app')];
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
fs.writeFileSync(path.join(publicRefDir, 'catalog.json'), JSON.stringify(catalog, null, 2));
console.log('✓ Catalog updated with learnhour-app as primary reference!');

// 2. Sections
const sectionsPath = path.join(showcaseRefDir, 'sections.json');
const sections = JSON.parse(fs.readFileSync(sectionsPath, 'utf8'));
sections['learnhour-app'] = [
  { start: 0, end: 5.01 },
  { start: 5.01, end: 10.02 },
  { start: 10.02, end: 15.03 },
  { start: 15.03, end: 20.04 },
  { start: 20.04, end: 25.05 },
  { start: 25.05, end: 30.06 },
];
fs.writeFileSync(sectionsPath, JSON.stringify(sections, null, 2));
fs.writeFileSync(path.join(publicRefDir, 'sections.json'), JSON.stringify(sections, null, 2));
console.log('✓ Sections updated for learnhour-app!');

// 3. Drafts
const draftsPath = path.join(showcaseRefDir, 'drafts.json');
const drafts = JSON.parse(fs.readFileSync(draftsPath, 'utf8'));

drafts.drafts['learnhour-app'] = {
  palette: {
    bg: '#0F172A',
    fg: '#FAF8F5',
    accent: '#2D5A27',
  },
  sections: [
    {
      name: 'Landing Page',
      beats: [
        ['text', '92% of online courses', { size: 40 }],
        ['text', 'are never finished', { size: 48, weight: 700 }],
      ],
    },
    {
      name: 'Dashboard',
      beats: [
        ['logo', 'Learnhour', { mark: '⏱️', markSize: 60, size: 44, sub: '1 Hour Every Day' }],
        ['cards', 'Continue Learning Hero · Habit Meter'],
      ],
    },
    {
      name: 'Course Library',
      beats: [
        ['cards', 'Masterclasses & Curated Playlists'],
        ['list', 'Python 2026 | Full Stack Dev | AI & Machine Learning'],
      ],
    },
    {
      name: 'YouTube Ingestion',
      beats: [
        ['phone', 'Paste any YouTube link', { stack: true }],
        ['window', 'Auto-Split into 1-Hour Days'],
      ],
    },
    {
      name: 'Cinema Player',
      beats: [
        ['window', '16:9 Cinema Player & Syllabus'],
        ['list', 'Active Recall Quizzes | Smart Notes | Flashcards | Day Plan'],
      ],
    },
    {
      name: 'Focus Stopwatch',
      beats: [
        ['shape', 'Keep The Daily Streak Alive', { bg: '#2D5A27' }],
        ['logo', 'Learnhour', { mark: '⏱️', markSize: 70, size: 52, sub: 'Free & Local-First' }],
      ],
    },
  ],
};

fs.writeFileSync(draftsPath, JSON.stringify(drafts, null, 2));
fs.writeFileSync(path.join(publicRefDir, 'drafts.json'), JSON.stringify(drafts, null, 2));
console.log('✓ Drafts configured for learnhour-app!');

