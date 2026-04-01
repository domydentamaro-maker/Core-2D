import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const distDir = path.join(process.cwd(), 'dist');

const filesToCopy = [
  'llms.txt',
  path.join('.well-known', 'ai.txt'),
];

for (const relPath of filesToCopy) {
  const src = path.join(publicDir, relPath);
  const dst = path.join(distDir, relPath);

  if (!fs.existsSync(src)) {
    console.log(`Skip (not found): ${src}`);
    continue;
  }

  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.copyFileSync(src, dst);
  console.log(`Copied: ${src} -> ${dst}`);
}
