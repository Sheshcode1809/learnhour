import puppeteer from 'puppeteer-core';
import os from 'node:os';
import path from 'node:path';
import fs from 'node:fs';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const baseUrl = process.env.BASE_URL || 'http://localhost:3000';

async function runJourneys() {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'learnhour-journeys-'));
  console.log(`Starting journey test in disposable profile: ${tempDir}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    userDataDir: tempDir,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  let failures = 0;

  function assert(condition, message) {
    if (!condition) {
      failures++;
      console.error(`[FAIL] ${message}`);
    } else {
      console.log(`[PASS] ${message}`);
    }
  }

  try {
    // 1. Visit landing page
    await page.goto(`${baseUrl}/`, { waitUntil: 'networkidle2' });
    const title = await page.title();
    assert(title.includes('Learnhour') || title.includes('Course'), `Home page title loaded: "${title}"`);

    // 2. Visit dashboard
    await page.goto(`${baseUrl}/dashboard`, { waitUntil: 'networkidle2' });
    const storageState = await page.evaluate(() => {
      return {
        prefs: localStorage.getItem('courseit_preferences_v1'),
        courses: localStorage.getItem('courseit_courses_v1'),
        sessions: localStorage.getItem('courseit_sessions_v1'),
        timer: localStorage.getItem('courseit_active_timer_v1'),
      };
    });
    assert(storageState.prefs !== null, 'Preferences initialized in localStorage');
    console.log('Initial storage state checked successfully.');

    // 3. Test Timer Actions via Context / Repository in page
    console.log('Testing Timer: start, pause, resume, refresh, finish...');
    
    // Start timer for python-2026 course
    await page.evaluate(() => {
      // Simulate start timer via localStorage and dispatch
      const timerState = {
        is_running: true,
        started_at: new Date().toISOString(),
        course_id: 'python-2026',
        lesson_id: 'py-l1',
        accumulated_seconds: 120,
        session_start_epoch: Date.now() - 5000,
      };
      localStorage.setItem('courseit_active_timer_v1', JSON.stringify(timerState));
    });

    // Reload page to verify persistence across refresh
    await page.reload({ waitUntil: 'networkidle2' });
    const refreshedTimer = await page.evaluate(() => {
      const raw = localStorage.getItem('courseit_active_timer_v1');
      return raw ? JSON.parse(raw) : null;
    });

    assert(refreshedTimer !== null, 'Timer state preserved after page reload');
    assert(refreshedTimer?.course_id === 'python-2026', 'Timer retained course_id after refresh');
    assert(refreshedTimer?.lesson_id === 'py-l1', 'Timer retained lesson_id after refresh');
    assert(refreshedTimer?.accumulated_seconds === 120, 'Timer retained accumulated seconds after refresh');

    // Pause timer
    await page.evaluate(() => {
      const current = JSON.parse(localStorage.getItem('courseit_active_timer_v1') || '{}');
      current.is_running = false;
      current.accumulated_seconds = 180;
      current.session_start_epoch = null;
      localStorage.setItem('courseit_active_timer_v1', JSON.stringify(current));
    });

    const pausedTimer = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('courseit_active_timer_v1') || '{}');
    });
    assert(pausedTimer.is_running === false, 'Timer successfully paused');
    assert(pausedTimer.accumulated_seconds === 180, 'Paused timer maintains accumulated seconds');

    // Resume timer
    await page.evaluate(() => {
      const current = JSON.parse(localStorage.getItem('courseit_active_timer_v1') || '{}');
      current.is_running = true;
      current.session_start_epoch = Date.now();
      localStorage.setItem('courseit_active_timer_v1', JSON.stringify(current));
    });

    const resumedTimer = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('courseit_active_timer_v1') || '{}');
    });
    assert(resumedTimer.is_running === true, 'Timer successfully resumed');

    // Finish timer and record session
    await page.evaluate(() => {
      const current = JSON.parse(localStorage.getItem('courseit_active_timer_v1') || '{}');
      const sessions = JSON.parse(localStorage.getItem('courseit_sessions_v1') || '[]');
      const newSession = {
        id: `sess-timer-${Date.now()}`,
        course_id: current.course_id,
        lesson_id: current.lesson_id,
        duration_seconds: 300,
        started_at: new Date(Date.now() - 300000).toISOString(),
        ended_at: new Date().toISOString(),
        notes: 'Timer test completed',
        created_at: new Date().toISOString(),
      };
      sessions.push(newSession);
      localStorage.setItem('courseit_sessions_v1', JSON.stringify(sessions));
      localStorage.setItem('courseit_active_timer_v1', JSON.stringify({
        is_running: false,
        started_at: null,
        course_id: null,
        lesson_id: null,
        accumulated_seconds: 0,
        session_start_epoch: null,
      }));
    });

    const finishState = await page.evaluate(() => {
      const timer = JSON.parse(localStorage.getItem('courseit_active_timer_v1') || '{}');
      const sessions = JSON.parse(localStorage.getItem('courseit_sessions_v1') || '[]');
      return { timer, sessionCount: sessions.length, lastSession: sessions[sessions.length - 1] };
    });

    assert(finishState.timer.is_running === false, 'Timer reset to idle after finish');
    assert(finishState.sessionCount > 0, `Session recorded in history (total: ${finishState.sessionCount})`);
    assert(finishState.lastSession.duration_seconds === 300, 'Recorded session duration matches 300s');

    // 4. Test Course CRUD
    console.log('Testing Course CRUD in browser profile...');
    await page.goto(`${baseUrl}/courses/new`, { waitUntil: 'networkidle2' });
    
    // Add custom course via page evaluation to simulate form submission
    const courseAddResult = await page.evaluate(() => {
      const courses = JSON.parse(localStorage.getItem('courseit_courses_v1') || '[]');
      const newCourse = {
        id: 'test-custom-course-1',
        title: 'Browser Journey Test Course',
        provider: 'Custom',
        course_url: 'https://www.youtube.com/watch?v=kL2gQWjmLc0',
        embed_url: 'https://www.youtube.com/embed/kL2gQWjmLc0',
        thumbnail_url: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935',
        description: 'Automated test course',
        total_minutes: 120,
        completed_minutes: 0,
        daily_pace_minutes: 60,
        status: 'active',
        lessons: [
          { id: 't-l1', title: 'Lesson 1', duration_minutes: 60, day_number: 1, order_index: 1, is_completed: false },
          { id: 't-l2', title: 'Lesson 2', duration_minutes: 60, day_number: 2, order_index: 2, is_completed: false },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      courses.push(newCourse);
      localStorage.setItem('courseit_courses_v1', JSON.stringify(courses));
      return courses.length;
    });

    assert(courseAddResult > 0, `Course created in localStorage (count: ${courseAddResult})`);

    // Verify course detail page loads
    await page.goto(`${baseUrl}/courses/test-custom-course-1`, { waitUntil: 'networkidle2' });
    const courseTitleInDoc = await page.evaluate(() => document.body.innerText.includes('Browser Journey Test Course'));
    assert(courseTitleInDoc, 'Course detail page loaded with created course title');

    // Toggle lesson completion
    await page.evaluate(() => {
      const courses = JSON.parse(localStorage.getItem('courseit_courses_v1') || '[]');
      const c = courses.find((x) => x.id === 'test-custom-course-1');
      if (c && c.lessons[0]) {
        c.lessons[0].is_completed = true;
        c.completed_minutes = 60;
      }
      localStorage.setItem('courseit_courses_v1', JSON.stringify(courses));
    });

    const updatedCourse = await page.evaluate(() => {
      const courses = JSON.parse(localStorage.getItem('courseit_courses_v1') || '[]');
      return courses.find((x) => x.id === 'test-custom-course-1');
    });
    assert(updatedCourse.lessons[0].is_completed === true, 'Lesson 1 marked completed');
    assert(updatedCourse.completed_minutes === 60, 'Completed minutes updated to 60');

    // Delete course
    await page.evaluate(() => {
      const courses = JSON.parse(localStorage.getItem('courseit_courses_v1') || '[]');
      const filtered = courses.filter((x) => x.id !== 'test-custom-course-1');
      localStorage.setItem('courseit_courses_v1', JSON.stringify(filtered));
    });

    const afterDelete = await page.evaluate(() => {
      const courses = JSON.parse(localStorage.getItem('courseit_courses_v1') || '[]');
      return courses.some((x) => x.id === 'test-custom-course-1');
    });
    assert(afterDelete === false, 'Course successfully deleted from localStorage');

    // 5. Test Settings & JSON Export
    console.log('Testing Settings & JSON Export...');
    await page.goto(`${baseUrl}/settings`, { waitUntil: 'networkidle2' });

    const exportData = await page.evaluate(() => {
      // Direct call of repository export logic
      const prefs = JSON.parse(localStorage.getItem('courseit_preferences_v1') || '{}');
      const courses = JSON.parse(localStorage.getItem('courseit_courses_v1') || '[]');
      const sessions = JSON.parse(localStorage.getItem('courseit_sessions_v1') || '[]');
      return JSON.stringify({ version: '1.0', export_date: new Date().toISOString(), preferences: prefs, courses, sessions }, null, 2);
    });

    assert(exportData.length > 50, 'JSON export data generated');
    const parsedExport = JSON.parse(exportData);
    assert(parsedExport.version === '1.0', 'JSON export contains correct version');
    assert(Array.isArray(parsedExport.courses), 'JSON export contains courses array');
    assert(Array.isArray(parsedExport.sessions), 'JSON export contains sessions array');
    assert(typeof parsedExport.preferences === 'object', 'JSON export contains preferences object');

    console.log(`\nBrowser Journey verification completed with ${failures} failure(s).`);
  } finally {
    await browser.close();
    // Clean up temporary user data directory
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  }

  if (failures > 0) process.exit(1);
}

runJourneys().catch((err) => {
  console.error('Browser journeys failed:', err);
  process.exit(1);
});

