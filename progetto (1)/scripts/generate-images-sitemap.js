import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');
const SITEMAP_PATH = path.join(__dirname, '../dist/images-sitemap.xml');

const KEYWORDS = {
  'domenico-dentamaro': 'Domenico Dentamaro, immobiliare, edilizia, lavoro',
  'dentamaro-edilizia': 'Dentamaro, edilizia, cantiere, Bari',
  'domenico-sviluppo': 'Domenico, sviluppo immobiliare, Bari',
  'cantiere-immobiliare': 'Cantiere, immobiliare, edilizia, lavoro',
  'terreni-edilizia': 'Terreni, edilizia, Bari, consulenza',
  'progetto-immobiliare': 'Progetto, immobiliare, Bari, sviluppo',
  'visioni-costruzioni': 'Visioni, costruzioni, Bari, Domenico',
  'lavoro-immobiliare': 'Lavoro, immobiliare, Bari, consulenza',
  'edilizia-bari': 'Edilizia, Bari, Dentamaro, cantiere',
  'cantiere-bari': 'Cantiere, Bari, sviluppo, immobiliare',
};

function generateImagesSitemap() {
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    console.log('⏳ No images directory found');
    return null;
  }

  const files = fs.readdirSync(PUBLIC_IMAGES_DIR)
    .filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.log('⏳ No images found');
    return null;
  }

  console.log(`\n🗺️ Generating images sitemap for ${files.length} images...\n`);

  let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

  // Add founder image from assets (if exists)
  const founderImagePath = path.join(__dirname, '../public/assets/domenico-dentamaro.jpg');
  if (fs.existsSync(founderImagePath)) {
    sitemapXml += `  <url>
    <loc>https://www.2dsviluppoimmobiliare.it/</loc>
    <image:image>
      <image:loc>https://www.2dsviluppoimmobiliare.it/assets/domenico-dentamaro.jpg</image:loc>
      <image:title>Domenico Dentamaro Fondatore | 2D Sviluppo Immobiliare Bari</image:title>
      <image:caption>Domenico Dentamaro, fondatore, immobiliare, sviluppo, Bari, consulenza</image:caption>
    </image:image>
  </url>
`;
  }

  files.forEach((file, idx) => {
    const imagePath = `https://www.2dsviluppoimmobiliare.it/images/${file}`;
    const fileName = file.replace(/\.[^.]+$/, '');
    
    // Extract keywords from filename
    let keywords = 'Domenico Dentamaro, immobiliare, Bari, edilizia';
    for (const [key, val] of Object.entries(KEYWORDS)) {
      if (fileName.includes(key)) {
        keywords = val;
        break;
      }
    }

    const title = fileName
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    sitemapXml += `  <url>
    <loc>https://www.2dsviluppoimmobiliare.it/gallery/</loc>
    <image:image>
      <image:loc>${imagePath}</image:loc>
      <image:title>${title} | Domenico Dentamaro 2D Sviluppo Immobiliare</image:title>
      <image:caption>${keywords}</image:caption>
    </image:image>
  </url>
`;
  });

  sitemapXml += `</urlset>`;

  if (!fs.existsSync(path.dirname(SITEMAP_PATH))) {
    fs.mkdirSync(path.dirname(SITEMAP_PATH), { recursive: true });
  }

  fs.writeFileSync(SITEMAP_PATH, sitemapXml);
  console.log(`✅ Images sitemap generated: ${SITEMAP_PATH}`);
  console.log(`✅ Total images: ${files.length}\n`);

  return files;
}

generateImagesSitemap();
