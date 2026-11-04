import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outputDir = path.resolve(process.cwd(), 'screenshots', 'responsive');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const viewports = [
  { width: 360, height: 740, name: '360px-mobile' },
  { width: 390, height: 844, name: '390px-mobile' },
  { width: 768, height: 1024, name: '768px-tablet' },
  { width: 1024, height: 768, name: '1024px-laptop' },
  { width: 1440, height: 900, name: '1440px-desktop' },
  { width: 1920, height: 1080, name: '1920px-desktop' },
];

const urlsToTest = [
  { path: '/', name: 'landing' },
  { path: '/dashboard', name: 'dashboard' },
  { path: '/courses', name: 'courses' },
  { path: '/courses/python-2026', name: 'player' },
  { path: '/sessions', name: 'sessions' },
  { path: '/settings', name: 'settings' },
];

async function runAudit() {
  console.log('Starting Responsive Design Audit...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  let overflowIssues = 0;

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    console.log(`\nTesting viewport: ${vp.name} (${vp.width}x${vp.height})`);

    for (const route of urlsToTest) {
      const url = `http://localhost:3000${route.path}`;
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((r) => setTimeout(r, 600));

      // Check for horizontal overflow (document scrollWidth > window innerWidth)
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const windowWidth = await page.evaluate(() => window.innerWidth);

      if (scrollWidth > windowWidth + 1) { // 1px margin of error for subpixel rendering
        console.warn(`[WARNING] Horizontal scroll detected on ${route.path} at ${vp.width}px: scrollWidth=${scrollWidth}, innerWidth=${windowWidth}`);
        overflowIssues++;
      } else {
        console.log(`[PASS] ${route.path} fits perfectly within ${vp.width}px`);
      }

      // Capture a sample screenshot for mobile (360px), tablet (768px), and full (1920px)
      if (['360px-mobile', '768px-tablet', '1920px-desktop'].includes(vp.name) && ['landing', 'dashboard', 'player'].includes(route.name)) {
        const dest = path.join(outputDir, `${route.name}-${vp.name}.png`);
        await page.screenshot({ path: dest, fullPage: false });
      }
    }
  }

  await browser.close();
  console.log(`\nResponsive Audit Finished. Total horizontal overflow issues: ${overflowIssues}`);
  if (overflowIssues > 0) {
    process.exit(1);
  }
}

runAudit().catch((err) => {
  console.error('Audit failed with error:', err);
  process.exit(1);
});
