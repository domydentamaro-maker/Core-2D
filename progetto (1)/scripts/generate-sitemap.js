import fs from 'fs';
import path from 'path';

const hostname = 'https://www.2dsviluppoimmobiliare.it';
const distDir = path.join(process.cwd(), 'dist');

function walkHtmlFiles(dir, base = dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'assets') continue;
      walkHtmlFiles(fullPath, base, acc);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    const rel = path.relative(base, fullPath).replace(/\\/g, '/');
    acc.push(rel);
  }
  return acc;
}

function routeFromRelHtml(rel) {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) {
    const dir = rel.slice(0, -'/index.html'.length);
    return `/${dir}/`;
  }
  const slug = rel.slice(0, -'.html'.length);
  return `/${slug}/`;
}

function priorityForRoute(route) {
  const map = {
    '/': '1.0',
    '/domenico-dentamaro/': '0.9',
    '/zes/': '0.9',
    '/metodofilo/': '0.85',
    '/bari/': '0.8',
    '/provincia-bari/': '0.75',
    '/glossario/': '0.7',
    '/contact/': '0.65',
  };
  return map[route] ?? '0.65';
}

function changefreqForRoute(route) {
  if (route === '/') return 'weekly';
  if (route === '/contact/') return 'yearly';
  return 'monthly';
}

function buildSitemap() {
  const htmlFiles = walkHtmlFiles(distDir);
  const routes = Array.from(new Set(htmlFiles.map(routeFromRelHtml)))
    .filter((route) => route !== '/404/' && !route.includes('#') && route !== '/metodofilo/manuale/' && route !== '/filo/')
    .sort((a, b) => {
      if (a === '/') return -1;
      if (b === '/') return 1;
      return a.localeCompare(b);
    });

  // Pagine statiche non-route che vogliamo indicizzare esplicitamente
  const staticPages = [
    { loc: `${hostname}/metodofilo/manuale.html`, changefreq: 'monthly', priority: '0.8' },
  ];

  const xmlUrls = routes.map((route) => {
    return [
      '  <url>',
      `    <loc>${hostname}${route}</loc>`,
      `    <changefreq>${changefreqForRoute(route)}</changefreq>`,
      `    <priority>${priorityForRoute(route)}</priority>`,
      '  </url>',
    ].join('\n');
  });

  const xmlStaticUrls = staticPages.map(({ loc, changefreq, priority }) => {
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <changefreq>${changefreq}</changefreq>`,
      `    <priority>${priority}</priority>`,
      '  </url>',
    ].join('\n');
  });

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...xmlUrls,
    ...xmlStaticUrls,
    '</urlset>',
  ].join('\n');

  const sitemapPath = path.join(distDir, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`Sitemap generated at ${sitemapPath} (${routes.length + staticPages.length} URL)`);
}

function buildRobots() {
  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    `Sitemap: ${hostname}/sitemap.xml`,
    `Sitemap: ${hostname}/images-sitemap.xml`,
    '',
  ].join('\n');

  const robotsPath = path.join(distDir, 'robots.txt');
  fs.writeFileSync(robotsPath, robots);
  console.log(`Robots generated at ${robotsPath}`);
}

buildSitemap();
buildRobots();
