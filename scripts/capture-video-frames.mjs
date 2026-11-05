import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve(process.cwd(), '.agents/skills/nullmotion/public/frames');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const scenes = [
  { id: 'scene-01-landing', url: 'http://localhost:3000/' },
  { id: 'scene-02-dashboard', url: 'http://localhost:3000/dashboard' },
  { id: 'scene-03-courses', url: 'http://localhost:3000/courses' },
  { id: 'scene-04-creator', url: 'http://localhost:3000/courses/new' },
  { id: 'scene-05-player', url: 'http://localhost:3000/courses/python-2026' },
  { id: 'scene-06-timer', url: 'http://localhost:3000/sessions' },
];

async function capture() {
  console.log('Launching Chrome for 1080p frame capture...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
    defaultViewport: {
      width: 1920,
      height: 1080,
      deviceScaleFactor: 1,
    },
  });

  const page = await browser.newPage();

  for (const scene of scenes) {
    const dest = path.join(outputDir, `${scene.id}.png`);
    console.log(`Rendering ${scene.id} from ${scene.url}...`);
    try {
      await page.goto(scene.url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Wait for layout and hydration to settle
      await new Promise((r) => setTimeout(r, 1500));
      await page.screenshot({ path: dest, clip: { x: 0, y: 0, width: 1920, height: 1080 } });
      console.log(`✓ Saved ${dest}`);
    } catch (err) {
      console.error(`Failed ${scene.id}:`, err);
    }
  }

  await browser.close();
  console.log('Frame capture completed successfully!');
}

capture().catch((err) => {
  console.error('Fatal capture error:', err);
  process.exit(1);
});
