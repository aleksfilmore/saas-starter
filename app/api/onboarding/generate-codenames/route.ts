// API endpoint for generating codename options
import { NextRequest, NextResponse } from 'next/server';

const CODENAME_PREFIXES = [
  // Tech/Digital
  'BYTE', 'PIXEL', 'CODE', 'DATA', 'LINK', 'NODE', 'CORE', 'SYNC', 'FLUX', 'WIRE',
  'GRID', 'LOOP', 'CACHE', 'STACK', 'FRAME', 'SHIFT', 'MERGE', 'PARSE', 'QUERY',
  
  // Emotional/Recovery
  'GHOST', 'ECHO', 'VOID', 'NUMB', 'RAGE', 'LOST', 'TORN', 'BURN', 'COLD', 'SHARP',
  'DARK', 'WILD', 'BROKEN', 'FIERCE', 'STORM', 'SHADOW', 'FROST', 'EMBER', 'STEEL',
  
  // Mystical/Aesthetic
  'NOVA', 'ZERO', 'NEON', 'CYBER', 'GLITCH', 'VIRUS', 'MATRIX', 'PRISM', 'LASER',
  'CHROME', 'VAPOR', 'DIGITAL', 'NEURAL', 'QUANTUM', 'HOLOGRAM', 'CIRCUIT'
];

const CODENAME_SUFFIXES = [
  // Numbers
  '01', '02', '99', '404', '500', '666', '777', '808', '911', '1337',
  
  // Tech Terms
  'EXE', 'DLL', 'ZIP', 'RAM', 'CPU', 'GPU', 'SSD', 'USB', 'API', 'SQL',
  'HTTP', 'JSON', 'HTML', 'CSS', 'JS', 'AI', 'ML', 'VR', 'AR', 'IOT',
  
  // Emotional States
  'ACHE', 'SCAR', 'TEAR', 'WOUND', 'HURT', 'PAIN', 'LOSS', 'GONE', 'DEAD',
  'VOID', 'NULL', 'EMPTY', 'HOLLOW', 'BROKEN', 'SHATTERED', 'RUINED',
  
  // Recovery Terms
  'HEAL', 'MEND', 'GROW', 'RISE', 'GLOW', 'SHINE', 'STRONG', 'FREE', 'NEW',
  'REBORN', 'PURE', 'CLEAN', 'FRESH', 'CLEAR', 'BRIGHT', 'WHOLE'
];

function generateCodename(): string {
  const prefix = CODENAME_PREFIXES[Math.floor(Math.random() * CODENAME_PREFIXES.length)];
  const suffix = CODENAME_SUFFIXES[Math.floor(Math.random() * CODENAME_SUFFIXES.length)];
  return `${prefix}_${suffix}`;
}

export async function GET(request: NextRequest) {
  try {
    const codenames = new Set<string>();
    
    // Generate 5 unique codenames
    while (codenames.size < 5) {
      codenames.add(generateCodename());
    }

    return NextResponse.json({
      success: true,
      codenames: Array.from(codenames)
    });
  } catch (error) {
    console.error('Error generating codenames:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate codenames' },
      { status: 500 }
    );
  }
}
