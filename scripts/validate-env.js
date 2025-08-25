#!/usr/bin/env node
/*
 * Comprehensive environment variable validator for production & staging.
 * Automatically loads .env (without overriding already-set process vars).
 * Exits with non-zero code if required vars are missing.
 */
// Lightweight .env loader (avoids extra dependency on dotenv)
const fs = require('fs');
const envPath = '.env';
try {
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8');
    raw.split(/\r?\n/).forEach(line => {
      if (!line || line.startsWith('#')) return;
      const idx = line.indexOf('=');
      if (idx === -1) return;
      const key = line.slice(0, idx).trim();
      if (!key) return;
      if (process.env[key]) return; // don't override existing
      let val = line.slice(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    });
  }
} catch (e) {
  console.error('Failed loading .env:', e);
}
const groups = [
  {
    label: 'Core',
    required: ['POSTGRES_URL','NODE_ENV','NEXT_PUBLIC_SITE_URL','NEXT_PUBLIC_APP_URL','NEXTAUTH_URL','NEXT_PUBLIC_BASE_URL','ADMIN_SECRET'],
  },
  {
    label: 'Stripe (Payments)',
    required: ['STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','STRIPE_FIREWALL_PRICE_ID'],
    warn: ['STRIPE_AI_THERAPY_PRICE_ID','STRIPE_VOICE_THERAPY_PRICE_ID','STRIPE_PUBLISHABLE_KEY','NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY']
  },
  {
    label: 'Email',
    required: ['EMAIL_API_KEY','EMAIL_FROM','EMAIL_PROVIDER']
  },
  {
    label: 'AI',
    required: ['OPENAI_API_KEY']
  },
  {
    label: 'Security / Ops',
    required: ['CRON_SECRET','DEBUG_KEY'],
    optional: ['ADMIN_TEST_SECRET']
  },
  {
    label: 'App Behavior',
    required: ['RATE_LIMIT_MAX_ATTEMPTS','CLEAR_RITUALS','STARTUP_HEALTH_BASE_URL']
  }
];

let missing = [];
let reportLines = [];

for (const g of groups) {
  reportLines.push(`\n## ${g.label}`);
  for (const name of g.required) {
    const v = process.env[name];
    if (!v) { missing.push(name); reportLines.push(`❌ ${name} (missing)`); } else { reportLines.push(`✅ ${name}`); }
  }
  if (g.warn) {
    for (const name of g.warn) {
      const v = process.env[name];
      if (!v) reportLines.push(`⚠️  ${name} (recommended / optional)`); else reportLines.push(`✅ ${name}`);
    }
  }
  if (g.optional) {
    for (const name of g.optional) {
      const v = process.env[name];
      if (!v) reportLines.push(`ℹ️  ${name} (optional)`); else reportLines.push(`✅ ${name}`);
    }
  }
}

// Additional consistency checks
function same(a,b){ return process.env[a] && process.env[b] && process.env[a] === process.env[b]; }
if (!same('NEXT_PUBLIC_SITE_URL','NEXT_PUBLIC_APP_URL')) {
  reportLines.push('\n⚠️ NEXT_PUBLIC_SITE_URL and NEXT_PUBLIC_APP_URL differ; ensure this is intentional.');
}
if (process.env.STRIPE_PUBLISHABLE_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_PUBLISHABLE_KEY !== process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  reportLines.push('\n⚠️ STRIPE_PUBLISHABLE_KEY and NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY mismatch.');
}

console.log(reportLines.join('\n'));
if (missing.length) {
  console.error(`\nERROR: Missing required env vars (${missing.length}): ${missing.join(', ')}`);
  process.exit(1);
} else {
  console.log('\nAll required environment variables are present.');
}
