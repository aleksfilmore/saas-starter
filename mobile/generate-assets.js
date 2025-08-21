const fs = require('fs');
const path = require('path');

// Simple SVG to PNG placeholder generator
function createSVGAsset(width, height, backgroundColor, text, textColor = '#FFFFFF') {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="${width}" height="${height}" fill="${backgroundColor}"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" 
        font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 15}" 
        font-weight="bold" fill="${textColor}">${text}</text>
</svg>`;
}

// Create assets directory if it doesn't exist
const assetsDir = path.join(__dirname, 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir);
}

console.log('🎨 Generating mobile app assets...');

// Generate SVG assets (these can be converted to PNG later or used as-is for testing)
const assets = [
  {
    name: 'icon.svg',
    width: 1024,
    height: 1024,
    backgroundColor: '#8B45FF',
    text: 'CAB'
  },
  {
    name: 'adaptive-icon.svg', 
    width: 1024,
    height: 1024,
    backgroundColor: '#EC4899',
    text: 'CAB'
  },
  {
    name: 'splash.svg',
    width: 1284,
    height: 2778,
    backgroundColor: '#080F20',
    text: 'CTRL+ALT+BLOCK'
  },
  {
    name: 'notification-icon.svg',
    width: 256,
    height: 256,
    backgroundColor: '#EC4899',
    text: '!'
  },
  {
    name: 'favicon.svg',
    width: 32,
    height: 32,
    backgroundColor: '#8B45FF',
    text: 'C'
  }
];

assets.forEach(asset => {
  const svgContent = createSVGAsset(
    asset.width, 
    asset.height, 
    asset.backgroundColor, 
    asset.text
  );
  
  const filePath = path.join(assetsDir, asset.name);
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Created ${asset.name} (${asset.width}x${asset.height})`);
});

// Also create PNG versions with simple colored rectangles as fallback
console.log('\n📝 Note: For production, convert SVG files to PNG format:');
console.log('1. Use online converters or design tools');
console.log('2. Or install sharp: npm install sharp');
console.log('3. For now, we\'ll update app.json to use SVG files temporarily');

console.log('\n🎯 Assets generated! Update app.json to use these files.');
