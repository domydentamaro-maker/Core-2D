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

// Extract Vite-generated asset tags from the built index.html BEFORE overwriting it
const viteIndexPath = path.join(distDir, 'index.html');
let viteAssetTags = '';
if (fs.existsSync(viteIndexPath)) {
  const viteHtml = fs.readFileSync(viteIndexPath, 'utf-8');
  const tagMatches = viteHtml.match(/<(?:link|script)[^>]*\/assets\/[^>]*(?:\/>|>(?:<\/script>)?)/g) || [];
  viteAssetTags = tagMatches.join('\n    ');
  if (viteAssetTags) {
    console.log(`Extracted ${tagMatches.length} Vite asset tag(s) from dist/index.html`);
  } else {
    console.warn('Warning: no Vite asset tags found in dist/index.html');
  }
}

// The React mount point. Normal document flow (NOT fixed/absolute) so that:
// - body scrolls naturally → window.scrollY works → sticky headers work
// - no double scrollbar
// The inline <style> hides the static prerender content once the React div is present.
// SEO crawlers still read the static HTML before JS runs.
const rootInjection = `<div id="root" style="min-height:100vh;background:#fff;position:relative;z-index:9999"></div>
    <style>body>*:not(#root):not(script):not(link):not(style):not(meta):not(noscript){display:none!important}</style>`;

function injectAssetTags(html) {
  if (!viteAssetTags) return html;
  // Inject root div + hide-prerender style + Vite scripts right after <body ...>
  const bodyTagMatch = html.match(/<body[^>]*>/);
  if (bodyTagMatch) {
    const bodyTag = bodyTagMatch[0];
    return html.replace(bodyTag, `${bodyTag}\n    ${rootInjection}\n    ${viteAssetTags}`);
  }
  // Fallback: inject before </body>
  if (html.includes('</body>')) {
    return html.replace('</body>', `    ${rootInjection}\n    ${viteAssetTags}\n</body>`);
  }
  return html + `\n    ${rootInjection}\n    ${viteAssetTags}`;
}

const htmlFiles = fs.readdirSync(prerenderDir).filter((f) => f.endsWith('.html'));
if (htmlFiles.length === 0) {
  console.warn('No .html files found in prerender directory.');
  process.exit(0);
}

for (const fileName of htmlFiles) {
  const src = path.join(prerenderDir, fileName);
  const prerenderHtml = fs.readFileSync(src, 'utf-8');
  const finalHtml = injectAssetTags(prerenderHtml);

  const destFile = path.join(distDir, fileName);
  fs.writeFileSync(destFile, finalHtml, 'utf-8');
  console.log(`Copied prerendered ${fileName} into dist`);

  const pathWithoutExt = fileName.replace(/\.html$/, '');
  if (pathWithoutExt && pathWithoutExt !== 'index') {
    const targetDir = path.join(distDir, pathWithoutExt);
    const targetIndex = path.join(targetDir, 'index.html');
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(targetIndex, finalHtml, 'utf-8');
    console.log(`Copied prerendered ${fileName} into ${pathWithoutExt}/index.html`);
  }
}

console.log('Prerender copy completed.');
