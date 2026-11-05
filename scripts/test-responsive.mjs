import puppeteer from 'puppeteer-core';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
const viewports = [
  { width: 360, height: 740 },
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1440, height: 900 },
  { width: 1920, height: 1080 },
];
const routes = [
  '/', '/auth/login', '/auth/signup', '/dashboard', '/courses', '/courses/new',
  '/courses/python-2026', '/sessions', '/settings', '/about', '/privacy', '/terms', '/contact',
];

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    userDataDir: fs.mkdtempSync(path.join(os.tmpdir(), 'learnhour-responsive-')),
    args: ['--no-sandbox', '--disable-gpu'],
  });
  let failures = 0;
  const page = await browser.newPage();
  page.on('pageerror', (error) => {
    failures++;
    console.error(`[PAGE ERROR] ${error.message}`);
  });

  for (const viewport of viewports) {
    await page.setViewport(viewport);
    for (const route of routes) {
      const response = await page.goto(new URL(route, baseUrl).toString(), { waitUntil: 'domcontentloaded', timeout: 30000 });
      await new Promise((resolve) => setTimeout(resolve, 150));
      const result = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        bodyLength: document.body.innerText.trim().length,
      }));
      if (!response?.ok() || result.bodyLength === 0) {
        failures++;
        console.error(`[ROUTE ERROR] ${route} at ${viewport.width}px returned ${response?.status() ?? 'no response'}`);
      }
      if (result.scrollWidth > result.width + 1) {
        failures++;
        console.error(`[OVERFLOW] ${route} at ${viewport.width}px: scrollWidth=${result.scrollWidth}, clientWidth=${result.width}`);
      }
    }
    console.log(`[PASS] ${routes.length} routes checked at ${viewport.width}px`);
  }

  await browser.close();
  console.log(`Responsive audit finished: ${failures} issue(s). No screenshots were written.`);
  if (failures > 0) process.exit(1);
}

runAudit().catch((error) => {
  console.error('Responsive audit failed:', error);
  process.exit(1);
});
