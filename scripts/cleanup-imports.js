#!/usr/bin/env node

// Cleanup script to remove unused imports automatically
// This helps reduce bundle size and improves build times

const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_SCAN = [
  'app',
  'components',
  'lib'
];

const EXTENSIONS = ['.tsx', '.ts', '.js', '.jsx'];

function scanDirectory(dir) {
  const files = [];
  
  function walk(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        walk(fullPath);
      } else if (stat.isFile() && EXTENSIONS.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
  }
  
  walk(dir);
  return files;
}

function analyzeImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  const unusedImports = [];
  const importRegex = /^import\s*\{([^}]+)\}\s*from\s*['"][^'"]+['"];?$/;
  
  lines.forEach((line, index) => {
    const match = line.match(importRegex);
    if (match) {
      const imports = match[1].split(',').map(imp => imp.trim());
      
      imports.forEach(importName => {
        // Simple check - look for usage in the rest of the file
        const cleanImportName = importName.replace(/\s+as\s+\w+/, '').trim();
        const usageRegex = new RegExp(`\\b${cleanImportName}\\b`);
        
        const isUsed = lines.some((otherLine, otherIndex) => {
          return otherIndex !== index && usageRegex.test(otherLine);
        });
        
        if (!isUsed) {
          unusedImports.push({
            line: index + 1,
            import: cleanImportName,
            fullLine: line
          });
        }
      });
    }
  });
  
  return unusedImports;
}

function main() {
  console.log('🧹 Starting cleanup of unused imports...\n');
  
  let totalFiles = 0;
  let filesWithUnusedImports = 0;
  let totalUnusedImports = 0;
  
  for (const dir of DIRECTORIES_TO_SCAN) {
    if (fs.existsSync(dir)) {
      const files = scanDirectory(dir);
      
      files.forEach(file => {
        totalFiles++;
        const unusedImports = analyzeImports(file);
        
        if (unusedImports.length > 0) {
          filesWithUnusedImports++;
          totalUnusedImports += unusedImports.length;
          
          console.log(`📁 ${file}`);
          unusedImports.forEach(unused => {
            console.log(`   ⚠️  Line ${unused.line}: '${unused.import}' appears unused`);
          });
          console.log('');
        }
      });
    }
  }
  
  console.log(`\n📊 Summary:`);
  console.log(`   📄 Total files scanned: ${totalFiles}`);
  console.log(`   ⚠️  Files with unused imports: ${filesWithUnusedImports}`);
  console.log(`   🗑️  Total unused imports found: ${totalUnusedImports}`);
  
  if (totalUnusedImports > 0) {
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Run 'npm run lint' to see detailed ESLint warnings`);
    console.log(`   2. Consider using an IDE extension to auto-remove unused imports`);
    console.log(`   3. Or manually remove the unused imports listed above`);
  } else {
    console.log(`\n✅ Great! No obvious unused imports found.`);
  }
}

if (require.main === module) {
  main();
}
