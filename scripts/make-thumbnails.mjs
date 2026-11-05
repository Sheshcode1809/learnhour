import { execSync } from 'child_process';
import path from 'path';

const framesDir = path.resolve(process.cwd(), '.agents/skills/nullmotion/public/frames');
const targetDir = path.resolve(process.cwd(), '.agents/skills/nullmotion/showcase/references');

const scenes = [
  'scene-01-landing.png',
  'scene-02-dashboard.png',
  'scene-03-courses.png',
  'scene-04-creator.png',
  'scene-05-player.png',
  'scene-06-timer.png',
];

scenes.forEach((file, index) => {
  const src = path.join(framesDir, file);
  const dest = path.join(targetDir, `learnhour-app-${index}.jpg`);
  console.log(`Generating thumbnail ${index}: ${file} -> ${dest}`);
  execSync(`ffmpeg -y -i "${src}" -vf "scale=480:-1" -q:v 2 "${dest}"`);
});

console.log('Thumbnails created successfully!');
