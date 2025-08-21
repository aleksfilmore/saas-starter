const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertSVGToPNG() {
  const assetsDir = path.join(__dirname, 'assets');
  
  console.log('🔄 Converting SVG assets to PNG...');
  
  const conversions = [
    { input: 'icon.svg', output: 'icon.png' },
    { input: 'adaptive-icon.svg', output: 'adaptive-icon.png' },
    { input: 'splash.svg', output: 'splash.png' },
    { input: 'notification-icon.svg', output: 'notification-icon.png' },
    { input: 'favicon.svg', output: 'favicon.png' }
  ];
  
  for (const conversion of conversions) {
    try {
      const inputPath = path.join(assetsDir, conversion.input);
      const outputPath = path.join(assetsDir, conversion.output);
      
      if (fs.existsSync(inputPath)) {
        await sharp(inputPath)
          .png()
          .toFile(outputPath);
        
        console.log(`✅ Converted ${conversion.input} → ${conversion.output}`);
      } else {
        console.log(`⚠️  ${conversion.input} not found, skipping...`);
      }
    } catch (error) {
      console.error(`❌ Failed to convert ${conversion.input}:`, error.message);
    }
  }
  
  console.log('\n🎉 Asset conversion complete!');
}

convertSVGToPNG().catch(console.error);
