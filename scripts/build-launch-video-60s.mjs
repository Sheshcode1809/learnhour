import puppeteer from 'puppeteer-core';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const workingDir = process.cwd();
const publicDir = path.resolve(workingDir, '.agents/skills/nullmotion/public');
const mediaDir = path.resolve(workingDir, '.agents/skills/nullmotion/showcase/media');
const refDir = path.resolve(workingDir, '.agents/skills/nullmotion/showcase/references');
const framesDir = path.resolve(publicDir, 'frames_60s');

[framesDir, mediaDir, refDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

console.log('=== Step 1: Capturing High-Res Frames for 7 Scenes ===');

// Scene 1: The Problem HTML Template
const problemHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px; height: 1080px;
      background: radial-gradient(circle at 50% 40%, #1e293b 0%, #0f172a 60%, #020617 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #f8fafc;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      overflow: hidden; position: relative;
    }
    .grid {
      position: absolute; inset: 0;
      background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
    }
    .badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 18px; border-radius: 9999px;
      background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 24px; z-index: 10;
    }
    h1 {
      font-size: 64px; font-weight: 900; line-height: 1.15; text-align: center;
      letter-spacing: -0.03em; max-width: 1100px; z-index: 10;
      background: linear-gradient(180deg, #ffffff 40%, #94a3b8 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    }
    p {
      font-size: 24px; color: #94a3b8; margin-top: 18px; text-align: center;
      max-width: 800px; z-index: 10; line-height: 1.5;
    }
    .cards {
      display: flex; gap: 24px; margin-top: 50px; z-index: 10;
    }
    .card {
      width: 380px; padding: 22px; border-radius: 20px;
      background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px);
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 20px 40px rgba(0,0,0,0.4);
    }
    .card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .card-provider { font-size: 11px; font-weight: 700; color: #f87171; text-transform: uppercase; letter-spacing: 0.05em; }
    .card-status { font-size: 11px; font-weight: 600; color: #94a3b8; }
    .card-title { font-size: 17px; font-weight: 800; color: #f1f5f9; margin-bottom: 16px; line-height: 1.3; }
    .progress-bar { width: 100%; height: 8px; border-radius: 9999px; background: rgba(255,255,255,0.08); overflow: hidden; }
    .progress-fill { height: 100%; border-radius: 9999px; background: #ef4444; }
    .card-meta { display: flex; justify-content: space-between; font-size: 12px; color: #64748b; margin-top: 8px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="grid"></div>
  <div class="badge">⚠️ The Online Learning Reality</div>
  <h1>Too many courses.<br>Too little consistency.</h1>
  <p>92% of online courses and YouTube playlists are abandoned within two weeks.</p>
  <div class="cards">
    <div class="card" style="transform: rotate(-2deg);">
      <div class="card-top"><span class="card-provider">YouTube Playlist</span><span class="card-status">Abandoned 3 weeks ago</span></div>
      <div class="card-title">Full-Stack Web Development Bootcamp (65 Hours)</div>
      <div class="progress-bar"><div class="progress-fill" style="width: 8%;"></div></div>
      <div class="card-meta"><span>5h 12m watched</span><span>59h 48m remaining</span></div>
    </div>
    <div class="card" style="transform: translateY(-8px) scale(1.03);">
      <div class="card-top"><span class="card-provider">Masterclass</span><span class="card-status">Stalled at Day 3</span></div>
      <div class="card-title">Complete Python 2026: Zero to Advanced Systems</div>
      <div class="progress-bar"><div class="progress-fill" style="width: 14%;"></div></div>
      <div class="card-meta"><span>3h 05m watched</span><span>21h 35m remaining</span></div>
    </div>
    <div class="card" style="transform: rotate(2deg);">
      <div class="card-top"><span class="card-provider">AI Academy</span><span class="card-status">Never opened</span></div>
      <div class="card-title">Machine Learning & Neural Networks from Scratch</div>
      <div class="progress-bar"><div class="progress-fill" style="width: 2%;"></div></div>
      <div class="card-meta"><span>30m watched</span><span>39h 30m remaining</span></div>
    </div>
  </div>
</body>
</html>
`;

// Scene 7: Product Launch Grand Finale HTML Template
const launchHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: 1920px; height: 1080px;
      background: radial-gradient(circle at 50% 30%, #FAF8F5 0%, #F5F1EB 60%, #EAE4D9 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1C1917;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      overflow: hidden; position: relative;
    }
    .ambient-glow {
      position: absolute; width: 800px; height: 800px; border-radius: 50%;
      background: radial-gradient(circle, rgba(45, 90, 39, 0.08) 0%, transparent 70%);
      top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;
    }
    .logo-container {
      display: flex; align-items: center; gap: 16px; margin-bottom: 24px;
    }
    .logo-icon {
      width: 84px; height: 84px; border-radius: 26px;
      background: #2D5A27; color: #ffffff;
      display: flex; align-items: center; justify-content: center;
      font-size: 42px; box-shadow: 0 16px 36px rgba(45, 90, 39, 0.28);
    }
    .badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 20px; border-radius: 9999px;
      background: #EAF0E8; border: 1px solid rgba(45, 90, 39, 0.2);
      color: #2D5A27; font-size: 14px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 78px; font-weight: 900; letter-spacing: -0.04em;
      color: #1C1917; text-align: center; line-height: 1.08;
    }
    .accent { color: #2D5A27; }
    p.tagline {
      font-size: 28px; font-weight: 600; color: #44403C;
      margin-top: 20px; text-align: center; letter-spacing: -0.01em;
    }
    .features-pill {
      display: flex; gap: 16px; margin-top: 36px;
    }
    .pill {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 22px; border-radius: 14px;
      background: #ffffff; border: 1px solid #E2DACF;
      font-size: 15px; font-weight: 700; color: #292524;
      box-shadow: 0 4px 12px rgba(0,0,0,0.04);
    }
    .cta-box {
      margin-top: 48px; display: flex; flex-direction: column; align-items: center; gap: 14px;
    }
    .cta-btn {
      padding: 18px 46px; border-radius: 20px;
      background: #2D5A27; color: #ffffff; font-size: 20px; font-weight: 800;
      box-shadow: 0 16px 36px rgba(45, 90, 39, 0.3); border: none;
      letter-spacing: -0.01em;
    }
    .url {
      font-family: monospace; font-size: 16px; font-weight: 700; color: #78716C;
    }
  </style>
</head>
<body>
  <div class="ambient-glow"></div>
  <div class="logo-container">
    <div class="logo-icon">🎓</div>
  </div>
  <div class="badge">Product Launch · Available Now</div>
  <h1>LEARNHOUR</h1>
  <p class="tagline">Learn consistently. <span class="accent">Progress every day.</span></p>
  <div class="features-pill">
    <div class="pill">⏱️ 1-Hour Daily Pacer</div>
    <div class="pill">▶️ YouTube Playlist Splitter</div>
    <div class="pill">🔥 Streak Tracking</div>
    <div class="pill">🧠 Active Recall Dock</div>
    <div class="pill">🔒 100% Local-First</div>
  </div>
  <div class="cta-box">
    <button class="cta-btn">Start Your Learning Journey Today →</button>
    <div class="url">https://github.com/Sheshcode1809/learnhour</div>
  </div>
</body>
</html>
`;

fs.writeFileSync(path.join(framesDir, 'problem.html'), problemHtml);
fs.writeFileSync(path.join(framesDir, 'launch.html'), launchHtml);

async function run() {
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1920,1080'],
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
  });

  const page = await browser.newPage();

  // 1. Capture Scene 1: Problem
  console.log('Rendering Scene 1 (The Problem)...');
  await page.setContent(problemHtml, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(framesDir, 'scene-1-problem.png') });

  // 2. Capture Scene 2: Introducing Learnhour (Dashboard)
  console.log('Rendering Scene 2 (Dashboard)...');
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(framesDir, 'scene-2-dashboard.png') });

  // 3. Capture Scene 3: Add Your Courses (Course Creator)
  console.log('Rendering Scene 3 (Add Your Courses)...');
  await page.goto('http://localhost:3000/courses/new', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(framesDir, 'scene-3-creator.png') });

  // 4. Capture Scene 4: Focused Learning (Sessions & Timer)
  console.log('Rendering Scene 4 (Focused Learning / Sessions)...');
  await page.goto('http://localhost:3000/sessions', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(framesDir, 'scene-4-timer.png') });

  // 5. Capture Scene 5: Build the Habit (16:9 Cinema Player & Recall Dock)
  console.log('Rendering Scene 5 (Build the Habit / Course Detail)...');
  await page.goto('http://localhost:3000/courses/python-2026', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(framesDir, 'scene-5-player.png') });

  // 6. Capture Scene 6: Your Learning, Your Way (Settings & Data Control)
  console.log('Rendering Scene 6 (Settings & Local-First)...');
  await page.goto('http://localhost:3000/settings', { waitUntil: 'networkidle2' });
  await new Promise((r) => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(framesDir, 'scene-6-settings.png') });

  // 7. Capture Scene 7: Product Launch Grand Finale
  console.log('Rendering Scene 7 (Product Launch)...');
  await page.setContent(launchHtml, { waitUntil: 'load' });
  await page.screenshot({ path: path.join(framesDir, 'scene-7-launch.png') });

  await browser.close();
  console.log('✓ All 7 scenes captured at 1920x1080!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

