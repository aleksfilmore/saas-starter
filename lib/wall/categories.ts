// Central definition of Wall of Wounds emotion / glitch categories and their UI styles
// Each category maps to a semantic emotional channel + tailwind utility strings

export interface WallCategoryConfig {
  id: string;            // canonical glitch_category value in DB
  label: string;         // human facing short label
  description: string;   // optional tooltip / assistive text
  badgeClass: string;    // classes for the small pill badge
  containerClass: string;// classes for the post container background / border
  accentClass: string;   // text / icon accent color
  accentBarClass?: string; // thin vertical accent bar (optional)
  fullGradientClass?: string; // NEW: full card gradient background (entire card tinted)
}

export const WALL_CATEGORIES: WallCategoryConfig[] = [
  {
    id: 'system_error',
    label: 'Overwhelmed',
    description: 'Acute distress / meltdown moment',
    badgeClass: 'bg-rose-900/40 border border-rose-500/40 text-rose-300',
  containerClass: 'bg-rose-900/15 border-rose-500/40',
  accentClass: 'text-rose-400',
  accentBarClass: 'from-rose-500/70 to-pink-500/70',
  fullGradientClass: 'bg-gradient-to-br from-rose-950/70 via-rose-900/40 to-pink-900/40 border border-rose-600/40 shadow-inner shadow-rose-900/30'
  },
  {
    id: 'loop_detected',
    label: 'Stuck Loop',
    description: 'Rumination / repeating thought cycle',
    badgeClass: 'bg-fuchsia-900/40 border border-fuchsia-500/40 text-fuchsia-300',
  containerClass: 'bg-fuchsia-900/15 border-fuchsia-500/40',
  accentClass: 'text-fuchsia-400',
  accentBarClass: 'from-fuchsia-500/70 to-purple-500/70',
  fullGradientClass: 'bg-gradient-to-br from-fuchsia-950/70 via-fuchsia-900/40 to-purple-900/40 border border-fuchsia-600/40 shadow-inner shadow-fuchsia-900/30'
  },
  {
    id: 'memory_leak',
    label: 'Intrusions',
    description: 'Flashbacks, intrusive memories',
    badgeClass: 'bg-indigo-900/40 border border-indigo-500/40 text-indigo-300',
  containerClass: 'bg-indigo-900/15 border-indigo-500/40',
  accentClass: 'text-indigo-400',
  accentBarClass: 'from-indigo-500/70 to-blue-500/70',
  fullGradientClass: 'bg-gradient-to-br from-indigo-950/70 via-indigo-900/40 to-blue-900/40 border border-indigo-600/40 shadow-inner shadow-indigo-900/30'
  },
  {
    id: 'buffer_overflow',
    label: 'Overload',
    description: 'Too much input / dysregulated',
    badgeClass: 'bg-amber-900/40 border border-amber-500/40 text-amber-300',
  containerClass: 'bg-amber-900/15 border-amber-500/40',
  accentClass: 'text-amber-400',
  accentBarClass: 'from-amber-500/70 to-orange-500/70',
  fullGradientClass: 'bg-gradient-to-br from-amber-950/70 via-amber-900/40 to-orange-900/40 border border-amber-600/40 shadow-inner shadow-amber-900/30'
  },
  {
    id: 'syntax_error',
    label: 'Self-Blame',
    description: 'Inner critic / shame scripts',
    badgeClass: 'bg-purple-900/40 border border-purple-500/40 text-purple-300',
  containerClass: 'bg-purple-900/15 border-purple-500/40',
  accentClass: 'text-purple-400',
  accentBarClass: 'from-purple-500/70 to-fuchsia-500/70',
  fullGradientClass: 'bg-gradient-to-br from-purple-950/70 via-purple-900/40 to-fuchsia-900/40 border border-purple-600/40 shadow-inner shadow-purple-900/30'
  },
  {
    id: 'null_pointer',
    label: 'Numb',
    description: 'Dissociation / emotional flatness',
    badgeClass: 'bg-slate-800/60 border border-slate-500/40 text-slate-300',
  containerClass: 'bg-slate-800/50 border-slate-600/40',
  accentClass: 'text-slate-300',
  accentBarClass: 'from-slate-500/60 to-slate-400/40',
  fullGradientClass: 'bg-gradient-to-br from-slate-900/80 via-slate-800/50 to-slate-700/40 border border-slate-600/40 shadow-inner shadow-slate-900/30'
  },
  {
    id: 'stack_overflow',
    label: 'Anxiety Spike',
    description: 'Panic / racing mind',
    badgeClass: 'bg-cyan-900/40 border border-cyan-500/40 text-cyan-300',
  containerClass: 'bg-cyan-900/15 border-cyan-500/40',
  accentClass: 'text-cyan-400',
  accentBarClass: 'from-cyan-400/70 to-teal-400/70',
  fullGradientClass: 'bg-gradient-to-br from-cyan-950/70 via-cyan-900/40 to-teal-900/40 border border-cyan-600/40 shadow-inner shadow-cyan-900/30'
  },
  {
    id: 'access_denied',
    label: 'Boundary',
    description: 'Enforcing no‑contact / rejection processing',
    badgeClass: 'bg-emerald-900/40 border border-emerald-500/40 text-emerald-300',
    containerClass: 'bg-emerald-900/15 border-emerald-500/40',
    accentClass: 'text-emerald-400',
  accentBarClass: 'from-emerald-500/70 to-teal-500/70',
  fullGradientClass: 'bg-gradient-to-br from-emerald-950/70 via-emerald-900/40 to-teal-900/40 border border-emerald-600/40 shadow-inner shadow-emerald-900/30'
  }
];

// Legacy / transitional category aliases -> canonical IDs
// Extend as more legacy values appear in content.
const WALL_CATEGORY_ALIASES: Record<string,string> = {
  overwhelmed: 'system_error',
  overload: 'buffer_overflow',
  anxiety: 'stack_overflow',
  anxious: 'stack_overflow',
  panic: 'stack_overflow',
  numb: 'null_pointer',
  boundary: 'access_denied',
  loop: 'loop_detected',
  intrusive: 'memory_leak',
  intrusions: 'memory_leak',
  shame: 'syntax_error',
  critic: 'syntax_error',
  future: 'loop_detected', // heuristic: forward rumination treated similar to loops
  hope: 'memory_leak',     // hopeful reprocessing -> intrusions channel (adjust if needed)
  breakthrough: 'system_error' // temp mapping until distinct category reintroduced
};

export const WALL_CATEGORY_MAP: Record<string, WallCategoryConfig> = Object.fromEntries(
  WALL_CATEGORIES.map(c => [c.id, c])
);

export function getWallCategoryConfig(id?: string | null): WallCategoryConfig | null {
  if(!id) return null;
  if (WALL_CATEGORY_MAP[id]) return WALL_CATEGORY_MAP[id];
  const lower = id.toLowerCase();
  const alias = WALL_CATEGORY_ALIASES[lower];
  if (alias && WALL_CATEGORY_MAP[alias]) return WALL_CATEGORY_MAP[alias];
  return null;
}
