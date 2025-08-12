const fs = require('fs');

// Read the admin homepage
const adminPage = fs.readFileSync('app/admin/page.tsx', 'utf8');

let updated = adminPage;

// Remove "12 expert articles" text
updated = updated.replace(
  /12 expert articles • Evidence-based recovery • Updated weekly/g,
  'Evidence-based recovery insights • Updated weekly'
);

// Update FAQ section to use a grid layout (2-3 cards per row desktop, mobile adaptive)
updated = updated.replace(
  /<div className="space-y-6">/,
  '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">'
);

// Update individual FAQ cards to have better mobile/desktop layout
updated = updated.replace(
  /className="bg-gray-800\/50 border border-gray-600\/50 hover:border-purple-500\/50 transition-all duration-300 overflow-hidden"/g,
  'className="bg-gray-800/50 border border-gray-600/50 hover:border-purple-500/50 transition-all duration-300 overflow-hidden h-fit"'
);

// Write the updated admin page
fs.writeFileSync('app/admin/page.tsx', updated);

console.log('✅ FAQ section updated successfully!');
console.log('📱 Updated: FAQ layout to responsive grid (2-3 cards per row desktop, mobile adaptive)');
console.log('🗑️ Removed: "12 expert articles" text');
console.log('🎨 Enhanced: FAQ cards with better spacing and height fitting');
