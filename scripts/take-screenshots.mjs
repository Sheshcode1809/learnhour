import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve(process.cwd(), 'screenshots');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const pagesToCapture = [
  { name: '01-landing-page.png', url: 'http://localhost:3000/landing' },
  { name: '02-login-page.png', url: 'http://localhost:3000/auth/login' },
  { name: '03-signup-page.png', url: 'http://localhost:3000/auth/signup' },
  { name: '04-dashboard.png', url: 'http://localhost:3000/' },
  { name: '05-courses-library.png', url: 'http://localhost:3000/courses' },
  { name: '06-course-player.png', url: 'http://localhost:3000/courses/python-2026' },
  { name: '07-new-course.png', url: 'http://localhost:3000/courses/new' },
  { name: '08-sessions-history.png', url: 'http://localhost:3000/sessions' },
  { name: '09-settings.png', url: 'http://localhost:3000/settings' },
];

async function run() {
  console.log('Launching Chrome from:', chromePath);
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1440,900',
    ],
    defaultViewport: {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
    },
  });

  const page = await browser.newPage();

  for (const item of pagesToCapture) {
    const dest = path.join(outputDir, item.name);
    console.log(`Capturing: ${item.url} -> ${item.name}...`);
    try {
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 30000 });
      // Small pause for any animations/hydration to settle
      await new Promise((r) => setTimeout(r, 1500));
      await page.screenshot({ path: dest, fullPage: true });
      console.log(`Saved ${item.name}`);
    } catch (err) {
      console.error(`Error capturing ${item.name}:`, err);
    }
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

