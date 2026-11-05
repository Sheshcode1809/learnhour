import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
const framesDir = path.resolve(rootDir, '.agents/skills/nullmotion/public/frames_60s');
const showcaseMediaDir = path.resolve(rootDir, '.agents/skills/nullmotion/showcase/media');
const showcaseRefDir = path.resolve(rootDir, '.agents/skills/nullmotion/showcase/references');
const publicRefDir = path.resolve(rootDir, '.agents/skills/nullmotion/public/references');
const localMediaDir = path.resolve(rootDir, '.agents/skills/nullmotion/.local-media/references');
const publicMediaDir = path.resolve(rootDir, '.agents/skills/nullmotion/public/media/references');

[showcaseMediaDir, showcaseRefDir, publicRefDir, localMediaDir, publicMediaDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

const scenes = [
  {
    index: 1,
    name: 'The Problem',
    duration: 7,
    image: path.join(framesDir, 'scene-1-problem.png'),
    text: 'Too many courses. Too little consistency.',
    vo: 'We all have courses we promised ourselves we would finish. But finding the time and staying consistent is the real challenge.',
  },
  {
    index: 2,
    name: 'Introducing Learnhour',
    duration: 7,
    image: path.join(framesDir, 'scene-2-dashboard.png'),
    text: 'Meet Learnhour. One hour. Every day. Real progress.',
    vo: 'Meet Learnhour, your personal learning and habit tracker, designed to turn big learning goals into daily achievements.',
  },
  {
    index: 3,
    name: 'Add Your Courses',
    duration: 9,
    image: path.join(framesDir, 'scene-3-creator.png'),
    text: 'Turn long courses into daily learning plans.',
    vo: 'Add your favourite courses and playlists, organize your learning, and turn hours of content into a manageable daily plan.',
  },
  {
    index: 4,
    name: 'Focused Learning',
    duration: 10,
    image: path.join(framesDir, 'scene-4-timer.png'),
    text: 'Focus. Learn. Track your progress.',
    vo: 'Start your focus timer, track every learning session, and see your progress grow with every minute invested.',
  },
  {
    index: 5,
    name: 'Build the Habit',
    duration: 10,
    image: path.join(framesDir, 'scene-5-player.png'),
    text: 'Build consistency. Strengthen knowledge.',
    vo: 'Build learning streaks, track your daily goals, review with flashcards, and reinforce what you learn.',
  },
  {
    index: 6,
    name: 'Your Learning, Your Way',
    duration: 8,
    image: path.join(framesDir, 'scene-6-settings.png'),
    text: 'Your learning. Your progress. Your control.',
    vo: 'With local-first learning and optional cloud synchronization, your learning journey stays organized and accessible.',
  },
  {
    index: 7,
    name: 'Product Launch',
    duration: 9,
    image: path.join(framesDir, 'scene-7-launch.png'),
    text: 'LEARNHOUR · Learn consistently. Progress every day.',
    vo: 'Stop collecting courses. Start completing them. Learnhour. Learn consistently. Progress every day.',
  },
];

console.log('=== Step 1: Synthesizing Spoken Narration for 7 Scenes ===');
const tempVoFiles = [];
scenes.forEach((s) => {
  const voFile = path.resolve(rootDir, `temp_vo_${s.index}.wav`);
  tempVoFiles.push(voFile);
  // Sanitize text for flite
  const safeText = s.vo.replace(/'/g, '').replace(/"/g, '');
  console.log(`Generating VO ${s.index} (${s.duration}s): "${safeText.slice(0, 40)}..."`);
  const cmd = `ffmpeg -f lavfi -i "flite=text='${safeText}':voice=slt" -af "apad=whole_dur=${s.duration},afade=t=out:st=${s.duration - 0.3}:d=0.3" -ar 44100 -ac 2 -y "${voFile}"`;
  execSync(cmd, { stdio: 'ignore' });
});

// Concatenate voiceovers
const concatVoTxt = path.resolve(rootDir, 'temp_vo_concat.txt');
fs.writeFileSync(concatVoTxt, tempVoFiles.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n'));
const fullVoWav = path.resolve(rootDir, 'temp_full_vo.wav');
execSync(`ffmpeg -f concat -safe 0 -i "${concatVoTxt}" -c copy -y "${fullVoWav}"`, { stdio: 'ignore' });
console.log('✓ Full voiceover compiled (60.0s)!');

console.log('=== Step 2: Synthesizing Warm Ambient Technology Soundtrack ===');
const musicWav = path.resolve(rootDir, 'temp_music.wav');
// 4-chord gentle ambient progression with lowpass filter
const musicCmd = `ffmpeg -f lavfi -i "sine=frequency=130.81:duration=60" -f lavfi -i "sine=frequency=196.00:duration=60" -f lavfi -i "sine=frequency=261.63:duration=60" -filter_complex "[0:a][1:a][2:a]amix=inputs=3,volume=0.10,lowpass=f=750,afade=t=in:st=0:d=2.5,afade=t=out:st=56.5:d=3.5[m]" -map "[m]" -ar 44100 -ac 2 -y "${musicWav}"`;
execSync(musicCmd, { stdio: 'ignore' });
console.log('✓ Soundtrack synthesized (60.0s)!');

console.log('=== Step 3: Mixing Master Audio Track ===');
const masterAac = path.resolve(rootDir, 'temp_master_audio.aac');
const mixCmd = `ffmpeg -i "${fullVoWav}" -i "${musicWav}" -filter_complex "[0:a]volume=1.35[v];[1:a]volume=0.25[m];[v][m]amix=inputs=2:duration=first:dropout_transition=2[out]" -map "[out]" -c:a aac -b:a 192k -ar 44100 -y "${masterAac}"`;
execSync(mixCmd, { stdio: 'ignore' });
console.log('✓ Master AAC audio mixed cleanly!');

console.log('=== Step 4: Compiling 1080p Video Scenes with Smooth Motion ===');
const tempVideoClips = [];
scenes.forEach((s) => {
  const clipFile = path.resolve(rootDir, `temp_clip_${s.index}.mp4`);
  tempVideoClips.push(clipFile);
  const frames = s.duration * 30;
  console.log(`Encoding Scene ${s.index} (${s.name}, ${s.duration}s)...`);
  
  // High quality H.264 video with subtle Ken Burns zoom
  const zoomFilter = s.index % 2 === 0
    ? `scale=1920:1080,zoompan=z='min(zoom+0.0004,1.06)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30`
    : `scale=1920:1080,zoompan=z='min(zoom+0.0003,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${frames}:s=1920x1080:fps=30`;

  const clipCmd = `ffmpeg -loop 1 -i "${s.image}" -vf "${zoomFilter}" -c:v libx264 -t ${s.duration} -pix_fmt yuv420p -r 30 -preset medium -crf 18 -y "${clipFile}"`;
  execSync(clipCmd, { stdio: 'ignore' });
});

// Concat video clips
const concatVidTxt = path.resolve(rootDir, 'temp_vid_concat.txt');
fs.writeFileSync(concatVidTxt, tempVideoClips.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n'));
const tempVideoOnly = path.resolve(rootDir, 'temp_full_video.mp4');
execSync(`ffmpeg -f concat -safe 0 -i "${concatVidTxt}" -c copy -y "${tempVideoOnly}"`, { stdio: 'ignore' });

console.log('=== Step 5: Muxing Final 16:9 60s Launch Video ===');
const finalVideo16x9 = path.resolve(rootDir, 'learnhour-launch-60s.mp4');
const showcaseVideo = path.join(showcaseMediaDir, 'learnhour-app.mp4');

const muxCmd = `ffmpeg -i "${tempVideoOnly}" -i "${masterAac}" -c:v copy -c:a aac -b:a 192k -movflags +faststart -y "${finalVideo16x9}"`;
execSync(muxCmd, { stdio: 'ignore' });

// Copy to showcase & media targets
fs.copyFileSync(finalVideo16x9, showcaseVideo);
fs.copyFileSync(masterAac, path.join(showcaseMediaDir, 'learnhour-app.aac'));
fs.copyFileSync(finalVideo16x9, path.join(localMediaDir, 'learnhour-app.mp4'));
fs.copyFileSync(finalVideo16x9, path.join(publicMediaDir, 'learnhour-app.mp4'));
fs.copyFileSync(masterAac, path.join(localMediaDir, 'learnhour-app.aac'));
fs.copyFileSync(masterAac, path.join(publicMediaDir, 'learnhour-app.aac'));

console.log(`✓ 16:9 Final Video saved: ${finalVideo16x9} (${(fs.statSync(finalVideo16x9).size / 1024 / 1024).toFixed(2)} MB)`);

console.log('=== Step 6: Rendering 9:16 Social Media Vertical Reel (1080x1920) ===');
const finalVideo9x16 = path.resolve(rootDir, 'learnhour-launch-9x16.mp4');
// Centered 9:16 presentation with blurred ambient background
const verticalFilter = `[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=20:10[bg];[0:v]scale=1080:-1[fg];[bg][fg]overlay=(W-w)/2:(H-h)/2[v]`;
const verticalCmd = `ffmpeg -i "${finalVideo16x9}" -filter_complex "${verticalFilter}" -map "[v]" -map 0:a -c:v libx264 -preset medium -crf 20 -c:a copy -movflags +faststart -y "${finalVideo9x16}"`;
execSync(verticalCmd, { stdio: 'ignore' });
console.log(`✓ 9:16 Vertical Reel saved: ${finalVideo9x16} (${(fs.statSync(finalVideo9x16).size / 1024 / 1024).toFixed(2)} MB)`);

console.log('=== Step 7: Generating High-Impact 1080p Poster Thumbnail ===');
const thumbPath = path.resolve(rootDir, 'thumbnail.jpg');
// Capture frame at 9.0s (Hero Dashboard moment)
execSync(`ffmpeg -ss 00:00:09.500 -i "${finalVideo16x9}" -vframes 1 -q:v 2 -y "${thumbPath}"`, { stdio: 'ignore' });
console.log(`✓ Thumbnail saved: ${thumbPath}`);

// Generate section poster thumbnails for NullMotion breakdown
scenes.forEach((s, idx) => {
  const posterFile = path.join(showcaseRefDir, `learnhour-app-${idx}.jpg`);
  const publicPoster = path.join(publicRefDir, `learnhour-app-${idx}.jpg`);
  let timecode = 0;
  for (let i = 0; i < idx; i++) timecode += scenes[i].duration;
  timecode += 1.0;
  execSync(`ffmpeg -ss ${timecode} -i "${finalVideo16x9}" -vframes 1 -q:v 3 -y "${posterFile}"`, { stdio: 'ignore' });
  fs.copyFileSync(posterFile, publicPoster);
});
console.log('✓ Section thumbnails extracted for NullMotion!');

console.log('=== Step 8: Updating NullMotion Studio Metadata (Catalog, Sections, Drafts) ===');
// 1. Catalog
const catalogPath = path.join(showcaseRefDir, 'catalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

let runningTime = 0;
const segments = scenes.map((s, idx) => {
  const start = runningTime;
  runningTime += s.duration;
  return {
    ref: 'learnhour-app',
    in: Number(start.toFixed(2)),
    out: Number(runningTime.toFixed(2)),
    part: idx + 1,
    poster: `/references/learnhour-app-${idx}.jpg`,
  };
});

const learnhourEntry = {
  id: 'learnhour-app',
  name: 'Learnhour · Official 60s Launch Film',
  duration: 60.0,
  width: 1920,
  height: 1080,
  src: '/media/references/learnhour-app.mp4',
  poster: '/references/learnhour-app-1.jpg',
  segments,
};

catalog.references = [learnhourEntry, ...catalog.references.filter((r) => r.id !== 'learnhour-app')];
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
fs.writeFileSync(path.join(publicRefDir, 'catalog.json'), JSON.stringify(catalog, null, 2));

// 2. Sections
const sectionsPath = path.join(showcaseRefDir, 'sections.json');
const sections = JSON.parse(fs.readFileSync(sectionsPath, 'utf8'));
let curTime = 0;
sections['learnhour-app'] = scenes.map((s) => {
  const start = curTime;
  curTime += s.duration;
  return { start: Number(start.toFixed(2)), end: Number(curTime.toFixed(2)) };
});
fs.writeFileSync(sectionsPath, JSON.stringify(sections, null, 2));
fs.writeFileSync(path.join(publicRefDir, 'sections.json'), JSON.stringify(sections, null, 2));

// 3. Drafts with HyperFrames beats
const draftsPath = path.join(showcaseRefDir, 'drafts.json');
const drafts = JSON.parse(fs.readFileSync(draftsPath, 'utf8'));

drafts.drafts['learnhour-app'] = {
  palette: {
    bg: '#FAF8F5',
    fg: '#1C1917',
    accent: '#2D5A27',
  },
  sections: [
    {
      name: 'Scene 1: The Problem',
      beats: [
        ['text', 'Too many courses.', { size: 44, weight: 800 }],
        ['text', 'Too little consistency.', { size: 48, weight: 900 }],
      ],
    },
    {
      name: 'Scene 2: Introducing Learnhour',
      beats: [
        ['logo', 'Learnhour', { mark: '🎓', markSize: 64, size: 48, sub: 'One hour. Every day. Real progress.' }],
        ['cards', 'Continue Learning Hero · 1h Habit Meter'],
      ],
    },
    {
      name: 'Scene 3: Add Your Courses',
      beats: [
        ['window', 'Paste any YouTube playlist or tutorial link'],
        ['list', 'Auto-Splits 10h Course → 11 Daily 1-Hour Lessons'],
      ],
    },
    {
      name: 'Scene 4: Focused Learning',
      beats: [
        ['window', 'Distraction-Free Focus Stopwatch'],
        ['chart', 'Live Session Tracking & Daily Target Meter'],
      ],
    },
    {
      name: 'Scene 5: Build the Habit',
      beats: [
        ['shape', 'Active Recall Dock & Daily Streaks', { bg: '#2D5A27' }],
        ['list', 'Smart Notes | Flashcards | Self-Check Quizzes'],
      ],
    },
    {
      name: 'Scene 6: Your Learning, Your Way',
      beats: [
        ['cards', '100% Local-First · Zero Account Lock-in'],
        ['phone', 'Responsive on Mobile & Desktop'],
      ],
    },
    {
      name: 'Scene 7: Product Launch',
      beats: [
        ['logo', 'LEARNHOUR', { mark: '🎓', markSize: 76, size: 54, sub: 'Start your learning journey today.' }],
        ['text', 'github.com/Sheshcode1809/learnhour', { size: 24 }],
      ],
    },
  ],
};

fs.writeFileSync(draftsPath, JSON.stringify(drafts, null, 2));
fs.writeFileSync(path.join(publicRefDir, 'drafts.json'), JSON.stringify(drafts, null, 2));

// Clean up temporary files
const tempFiles = [concatVoTxt, fullVoWav, musicWav, masterAac, concatVidTxt, tempVideoOnly, ...tempVoFiles, ...tempVideoClips];
tempFiles.forEach((f) => {
  if (fs.existsSync(f)) fs.unlinkSync(f);
});

console.log('✓ All steps completed successfully!');
