import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const videoPath = path.join(publicDir, 'hero-video.mp4');
const sequenceDir = path.join(publicDir, 'hero-sequence');
const configDir = path.join(process.cwd(), 'src', 'config');

console.log('--- Canvas Sequence Extractor ---');

// 1. Validate requirements
if (!fs.existsSync(videoPath)) {
  console.error(`❌ Error: Could not find ${videoPath}`);
  process.exit(1);
}

try {
  execSync('ffmpeg -version', { stdio: 'ignore' });
  console.log('✅ FFmpeg is installed.');
} catch (e) {
  console.error('❌ Error: FFmpeg is not installed or not in your system PATH.');
  console.error('Please install FFmpeg (https://ffmpeg.org/download.html) and try again.');
  process.exit(1);
}

// 2. Setup Directories
if (fs.existsSync(sequenceDir)) {
  console.log(`🧹 Cleaning existing sequence directory...`);
  fs.rmSync(sequenceDir, { recursive: true, force: true });
}
fs.mkdirSync(sequenceDir, { recursive: true });

if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

// 3. Extract Frames
console.log('🎬 Extracting frames from video to WebP... (This may take a minute)');
// scale=1280:-1 maintains aspect ratio while significantly reducing RAM usage for canvas operations
const ffmpegCommand = `ffmpeg -i "${videoPath}" -vf "scale=1280:-1,fps=30" -c:v libwebp -quality 80 "${path.join(sequenceDir, 'frame_%04d.webp')}"`;

try {
  execSync(ffmpegCommand, { stdio: 'inherit' });
} catch (e) {
  console.error('❌ Error during extraction:', e.message);
  process.exit(1);
}

// 4. Count frames and write config
const extractedFiles = fs.readdirSync(sequenceDir).filter(f => f.endsWith('.webp'));
const totalFrames = extractedFiles.length;

const configPath = path.join(configDir, 'sequenceConfig.json');
fs.writeFileSync(configPath, JSON.stringify({ totalFrames }, null, 2));

console.log(`\n✅ Success! Extracted ${totalFrames} frames to public/hero-sequence/`);
console.log(`📝 Wrote configuration to ${configPath}`);
console.log(`\nYou can now tell the AI Assistant you have completed this step!`);
