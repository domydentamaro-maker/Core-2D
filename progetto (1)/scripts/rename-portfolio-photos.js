import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PORTFOLIO_DIR = path.join(__dirname, '../portfolio-photos');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '../public/images');

// Pattern diversi per AI (WhatsApp) e REALI
const aiPatterns = [
  'domenico-dentamaro-professionista-immobiliare',
  'dentamaro-consulente-immobiliare-bari',
  'domenico-professionista-edilizia-bari',
  'dentamaro-expert-sviluppo-immobiliare',
  'domenico-dentamaro-specialista-bari',
];

const realPatterns = [
  'domenico-dentamaro-cantiere-bari',
  'dentamaro-impalcatura-lavoro-bari',
  'domenico-cantiere-edilizia-bari',
  'dentamaro-lavoro-costruzione-bari',
  'domenico-dentamaro-progetto-bari',
  'cantiere-bari-dentamaro-lavoro',
  'impalcatura-bari-domenico-dentamaro',
  'edilizia-cantiere-bari-dentamaro',
  'lavoro-immobiliare-bari-dentamaro',
  'progetto-edilizia-bari-domenico',
  'sviluppo-immobiliare-bari-dentamaro',
  'terreni-bari-dentamaro-lavoro',
  'costru-zione-bari-domenico-dentamaro',
];

function renamePhotos() {
  if (!fs.existsSync(PORTFOLIO_DIR)) {
    console.log('❌ Portfolio directory not found');
    return;
  }

  // Create images directory if not exists
  if (!fs.existsSync(PUBLIC_IMAGES_DIR)) {
    fs.mkdirSync(PUBLIC_IMAGES_DIR, { recursive: true });
    console.log(`✅ Created ${PUBLIC_IMAGES_DIR}`);
  }

  const files = fs.readdirSync(PORTFOLIO_DIR);
  const images = files.filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

  if (images.length === 0) {
    console.log('⏳ No images found in portfolio-photos/');
    return;
  }

  console.log(`\n📸 Found ${images.length} images. Processing...\n`);

  let aiCount = 0;
  let realCount = 0;

  images.forEach((file) => {
    const ext = path.extname(file).toLowerCase();
    let seoName;
    let newName;

    // Identifica se è WhatsApp (AI) o no (REALE)
    const isWhatsApp = file.toLowerCase().includes('whatsapp');

    if (isWhatsApp) {
      // AI PROFESSIONALI
      const patternIndex = aiCount % aiPatterns.length;
      seoName = aiPatterns[patternIndex] + '-' + String(aiCount + 1).padStart(2, '0');
      aiCount++;
    } else {
      // FOTO REALI
      const patternIndex = realCount % realPatterns.length;
      seoName = realPatterns[patternIndex] + '-' + String(realCount + 1).padStart(2, '0');
      realCount++;
    }

    newName = seoName + ext;
    
    const oldPath = path.join(PORTFOLIO_DIR, file);
    const newPath = path.join(PUBLIC_IMAGES_DIR, newName);

    try {
      fs.copyFileSync(oldPath, newPath);
      const type = isWhatsApp ? '🎯 AI' : '📷 REALE';
      console.log(`✅ ${type} | ${file.substring(0, 35).padEnd(35)} → ${newName}`);
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err.message);
    }
  });

  console.log(`\n✅ Rinominate: ${aiCount} AI + ${realCount} REALI = ${images.length} totali`);
  console.log(`✅ Copiate in: ${PUBLIC_IMAGES_DIR}\n`);
  
  return images.length;
}

renamePhotos();
