import fs from 'fs';
import path from 'path';

const prerenderDir = path.resolve(process.cwd(), 'prerender');
const distDir = path.resolve(process.cwd(), 'dist');

if (!fs.existsSync(prerenderDir)) {
  console.error('prerender directory not found:', prerenderDir);
  process.exit(1);
}

if (!fs.existsSync(distDir)) {
  console.error('dist directory not found. Run build first.', distDir);
  process.exit(1);
}

const htmlFiles = fs.readdirSync(prerenderDir).filter((f) => f.endsWith('.html'));
if (htmlFiles.length === 0) {
  console.warn('No .html files found in prerender directory.');
  process.exit(0);
}

for (const fileName of htmlFiles) {
  const src = path.join(prerenderDir, fileName);
  const dest = path.join(distDir, fileName);
  fs.copyFileSync(src, dest);
  console.log(`Copied prerendered ${fileName} into dist`);
}

console.log('Prerender copy completed.');
