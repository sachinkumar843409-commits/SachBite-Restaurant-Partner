import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

// Exact SVG of official SachBite Logo as provided
const createSvg = (width, height, isForeground = false, isRound = false) => {
  // For foreground (adaptive icon 108dp canvas), center the logo inside the 66% safe zone (72dp)
  const scale = isForeground ? 0.65 : 0.88;
  const cx = width / 2;
  const cy = height / 2;

  // Background style
  let bgElement = '';
  if (!isForeground) {
    if (isRound) {
      bgElement = `<circle cx="${cx}" cy="${cy}" r="${Math.min(width, height) / 2}" fill="#ffffff" />`;
    } else {
      bgElement = `<rect width="${width}" height="${height}" rx="${width * 0.22}" fill="#ffffff" />`;
    }
  }

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Main Brand Flame Gradient -->
      <linearGradient id="sbGradMain" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ff7a1a" />
        <stop offset="50%" stopColor="#ff4d00" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>

      <!-- Speed Trail Gradient -->
      <linearGradient id="sbGradSpeed" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ff9f43" />
        <stop offset="100%" stopColor="#ff5200" />
      </linearGradient>

      <!-- Text Bite Gradient -->
      <linearGradient id="sbGradBite" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ff7a1a" />
        <stop offset="100%" stopColor="#e11d48" />
      </linearGradient>

      <!-- Drop Shadow Filter -->
      <filter id="sbShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#ff4d00" floodOpacity="0.25" />
      </filter>
    </defs>

    ${bgElement}

    <!-- Scaled & Centered SachBite Logo Content -->
    <g transform="translate(${cx}, ${cy}) scale(${scale}) translate(-100, -110)">
      
      <!-- 1. Chef's Hat on top of S -->
      <g transform="translate(104, 8)">
        <path
          d="M 12,38 C 4,38 0,32 0,26 C 0,18 7,12 16,12 C 17,6 23,0 32,0 C 41,0 47,6 48,12 C 57,12 64,18 64,26 C 64,32 60,38 52,38 Z"
          fill="url(#sbGradMain)"
        />
        <rect x="10" y="36" width="44" height="7" rx="3" fill="url(#sbGradMain)" />
      </g>

      <!-- 2. Left Delivery Speed Trails (3 Horizontal rounded bars) -->
      <rect x="42" y="70" width="28" height="7" rx="3.5" fill="url(#sbGradSpeed)" />
      <rect x="22" y="85" width="48" height="8" rx="4" fill="url(#sbGradSpeed)" />
      <rect x="42" y="101" width="28" height="7" rx="3.5" fill="url(#sbGradSpeed)" />

      <!-- 3. Dynamic 'S' Monogram Body with Cutlery Cutouts -->
      <path
        d="M 125,32 
           C 155,32 178,50 178,74 
           C 178,96 160,110 138,118 
           C 165,124 184,142 184,166 
           C 184,192 152,210 115,210 
           C 72,210 52,185 52,158 
           C 52,142 62,130 75,130 
           C 86,130 94,138 94,149 
           C 94,162 103,172 118,172 
           C 134,172 144,162 144,150 
           C 144,134 126,126 102,120 
           C 75,114 55,98 55,74 
           C 55,48 85,32 125,32 Z"
        fill="url(#sbGradMain)"
      />

      <!-- Fork Cutout inside upper loop -->
      <g fill="#ffffff">
        <path d="M 85,78 C 96,65 110,60 126,62 L 132,63 C 130,56 135,52 142,53 C 146,54 148,56 150,60 L 158,61 C 158,57 160,54 165,55 C 170,56 170,60 170,63 L 175,64 C 178,65 180,68 180,72 C 180,76 177,78 173,78 L 140,78 C 120,78 102,86 92,94 Z" opacity="0.95" />
        <path d="M 148,46 L 175,54" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 142,52 L 174,62" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
        <path d="M 136,58 L 170,70" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" />
      </g>

      <!-- Spoon Cutout inside lower loop -->
      <ellipse
        cx="122"
        cy="154"
        rx="18"
        ry="24"
        transform="rotate(-25 122 154)"
        fill="#ffffff"
        opacity="0.95"
      />
      <path
        d="M 98,118 C 105,126 112,136 116,146 L 108,150 C 103,138 96,128 89,122 Z"
        fill="#ffffff"
        opacity="0.95"
      />

      <!-- 4. Typography: SachBite -->
      <text x="100" y="244" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', Inter, sans-serif" font-weight="900" font-size="34" letter-spacing="-1">
        <tspan fill="#1e1e1e">Sach</tspan><tspan fill="url(#sbGradBite)">Bite</tspan>
      </text>

      <!-- 5. Tagline: Good Food • Better Mood -->
      <g transform="translate(100, 262)">
        <text text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Plus Jakarta Sans', Inter, sans-serif" font-weight="700" font-size="10.5" fill="#4b5563" letter-spacing="1">
          Good Food <tspan fill="#ff7a1a" font-size="14" dy="-1">•</tspan><tspan dy="1"> Better Mood</tspan>
        </text>
      </g>
    </g>
  </svg>
  `;
};

// Android Density Targets
const androidDensities = [
  { name: 'mdpi', legacySize: 48, adaptiveSize: 108 },
  { name: 'hdpi', legacySize: 72, adaptiveSize: 162 },
  { name: 'xhdpi', legacySize: 96, adaptiveSize: 216 },
  { name: 'xxhdpi', legacySize: 144, adaptiveSize: 324 },
  { name: 'xxxhdpi', legacySize: 192, adaptiveSize: 432 },
];

async function generateAllIcons() {
  console.log('🚀 Generating exact official SachBite Android launcher icons...');

  const baseResDir = path.resolve('android/app/src/main/res');

  for (const d of androidDensities) {
    const dir = path.join(baseResDir, `mipmap-${d.name}`);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // 1. Legacy Launcher Icon (Square / Rounded)
    const legacySvg = createSvg(d.legacySize, d.legacySize, false, false);
    await sharp(Buffer.from(legacySvg))
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    // 2. Legacy Round Icon
    const roundSvg = createSvg(d.legacySize, d.legacySize, false, true);
    await sharp(Buffer.from(roundSvg))
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // 3. Adaptive Foreground Icon (108dp canvas with 72dp safe zone)
    const fgSvg = createSvg(d.adaptiveSize, d.adaptiveSize, true, false);
    await sharp(Buffer.from(fgSvg))
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));

    console.log(`✅ Generated mipmap-${d.name}: ic_launcher.png (${d.legacySize}x${d.legacySize}), ic_launcher_round.png, ic_launcher_foreground.png (${d.adaptiveSize}x${d.adaptiveSize})`);
  }

  // Generate Web & PWA Icons in public/ directory
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const webSizes = [
    { name: 'favicon.png', size: 64 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'sachbite-logo.png', size: 512 },
  ];

  for (const w of webSizes) {
    const webSvg = createSvg(w.size, w.size, false, false);
    await sharp(Buffer.from(webSvg))
      .png()
      .toFile(path.join(publicDir, w.name));
  }

  console.log('✅ Generated Web & PWA icons in /public: favicon.png, icon-192.png, icon-512.png, sachbite-logo.png');
}

generateAllIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
