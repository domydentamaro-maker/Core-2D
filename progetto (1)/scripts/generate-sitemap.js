import fs from 'fs';
import path from 'path';

// base url for sitemap
const hostname = 'https://www.2dsviluppoimmobiliare.it';

// URL reali indicizzabili — NIENTE anchor # (ignorati da Google)
const urls = [
  { loc: '/',               changefreq: 'weekly',  priority: '1.0' },
  { loc: '/chi-sono/',      changefreq: 'monthly', priority: '0.9' },
  { loc: '/zes/',           changefreq: 'monthly', priority: '0.9' },
  { loc: '/filo/',          changefreq: 'monthly', priority: '0.85' },
  { loc: '/bari/',          changefreq: 'monthly', priority: '0.8' },
  { loc: '/provincia-bari/',changefreq: 'monthly', priority: '0.75' },
  { loc: '/glossario/',     changefreq: 'monthly', priority: '0.7' },
  { loc: '/contact/',       changefreq: 'yearly',  priority: '0.65' },
  // Proprietà esterne del gruppo
  { loc: 'https://www.materiaprima.2dsviluppoimmobiliare.it', changefreq: 'weekly', priority: '0.8', full: true },
  { loc: 'https://www.visioniimmobiliari.2dsviluppoimmobiliare.it', changefreq: 'weekly', priority: '0.8', full: true },
];

function buildUrl({ loc, changefreq, priority, full }) {
  const fullLoc = full ? loc : `${hostname}${loc}`;
  return `  <url>\n    <loc>${fullLoc}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n` +
`        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n` +
urls.map(buildUrl).join('\n') +
`\n</urlset>`;

const outPath = path.join(process.cwd(), 'dist', 'sitemap.xml');
fs.writeFileSync(outPath, xml);
console.log('Sitemap generated at', outPath);
