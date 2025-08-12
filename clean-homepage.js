const fs = require('fs');

// Read the current homepage
const homepage = fs.readFileSync('app/page.tsx', 'utf8');

// Remove beta scan buttons
let cleaned = homepage.replace(
  /\s*<Button[^>]*🧪 Try Beta Scan Now[\s\S]*?<\/Button>/g,
  ''
);

// Update form to use Formspree
cleaned = cleaned.replace(
  'onSubmit={handleSubmit}',
  'action="https://formspree.io/f/xrblayqb" method="POST"'
);

// Update email input to have name attribute and remove controlled state
cleaned = cleaned.replace(
  /type="email"\s*placeholder="exile_404@protonmail\.com"\s*value=\{email\}\s*onChange=\{[^}]+\}/,
  'type="email" name="email" placeholder="exile_404@protonmail.com"'
);

// Remove submit button state management
cleaned = cleaned.replace(
  /disabled=\{isSubmitting\}[^>]*>\s*\{isSubmitting \? \([^)]+\) : \([^)]+\)\}/,
  '>Join Waitlist - Free <ArrowRight className="ml-2 h-5 w-5" />'
);

// Remove pricing section (from comment to next section comment)
cleaned = cleaned.replace(
  /\s*\{\/\* Pricing Section \*\/\}[\s\S]*?(?=\s*\{\/\* Blog Section)/,
  '\n\n'
);

// Remove blog section (from comment to waitlist section)
cleaned = cleaned.replace(
  /\s*\{\/\* Blog Section[^}]*\*\/\}[\s\S]*?(?=\s*\{\/\* Waitlist Section|\s*<section id="waitlist")/,
  '\n\n'
);

// Write the cleaned version
fs.writeFileSync('app/page.tsx', cleaned);
console.log('✅ Homepage cleaned successfully!');
console.log('🔧 Removed: Beta scan buttons, pricing section, blog section');
console.log('📧 Updated: Form to use Formspree integration');
