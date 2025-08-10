/**
 * CBT Quiz API with Exact Specification Scoring
 * CTRL+ALT+BLOCK™ Specification Section 3.1 & 12
 */

import { NextRequest, NextResponse } from 'next/server';

interface QuizAnswer {
  questionId: string;
  answer: 'A' | 'B' | 'C' | 'D';
}

interface ArchetypeResult {
  archetype: 'df' | 'fb' | 'gis' | 'sn';
  scores: Record<string, number>;
  blend?: {
    primary: string;
    secondary: string;
    ratio: string;
  };
  attachment_style: 'anxious' | 'avoidant' | 'disorganized' | 'secure';
  cbt_cue: string;
  healing_focus: string[];
  recommended_persona: string;
}

const scoringMap: Record<string, Record<string, { primary: string; secondary?: string }>> = {
  'q1_no_text_back': {
    'A': { primary: 'df', secondary: 'gis' },
    'B': { primary: 'sn', secondary: 'fb' },
    'C': { primary: 'fb', secondary: 'gis' },
    'D': { primary: 'gis', secondary: 'df' }
  },
  'q2_cancelled_plans': {
    'A': { primary: 'df', secondary: 'gis' },
    'B': { primary: 'sn', secondary: 'fb' },
    'C': { primary: 'fb', secondary: 'gis' },
    'D': { primary: 'gis', secondary: 'df' }
  },
  'q3_unstable_relationship': {
    'A': { primary: 'df', secondary: 'gis' },
    'B': { primary: 'fb', secondary: 'sn' },
    'C': { primary: 'fb', secondary: 'gis' },
    'D': { primary: 'sn', secondary: 'df' }
  },
  'q4_conflict_handling': {
    'A': { primary: 'df', secondary: 'sn' },
    'B': { primary: 'fb', secondary: 'gis' },
    'C': { primary: 'gis', secondary: 'df' },
    'D': { primary: 'sn', secondary: 'fb' }
  },
  'q5_independence_request': {
    'A': { primary: 'df', secondary: 'gis' },
    'B': { primary: 'fb', secondary: 'sn' },
    'C': { primary: 'gis', secondary: 'df' },
    'D': { primary: 'sn', secondary: 'fb' }
  },
  'q6_breakup_first_move': {
    'A': { primary: 'df', secondary: 'gis' },
    'B': { primary: 'fb', secondary: 'sn' },
    'C': { primary: 'gis', secondary: 'df' },
    'D': { primary: 'sn', secondary: 'fb' }
  },
  'q7_relationship_superpower': {
    'A': { primary: 'df', secondary: 'gis' },
    'B': { primary: 'fb', secondary: 'sn' },
    'C': { primary: 'gis', secondary: 'df' },
    'D': { primary: 'sn', secondary: 'fb' }
  },
  'q8_biggest_fear': {
    'A': { primary: 'df', secondary: 'gis' },
    'B': { primary: 'fb', secondary: 'sn' },
    'C': { primary: 'gis', secondary: 'df' },
    'D': { primary: 'sn', secondary: 'fb' }
  }
};

const archetypeDetails = {
  df: {
    attachment_style: 'anxious' as const,
    cbt_cue: 'Thoughts ≠ facts. Check evidence before reacting.',
    healing_focus: ['Delay responses', 'Build self-reassurance', 'Replace "fix now" with "check-in first"'],
    recommended_persona: 'DebugDaemon'
  },
  fb: {
    attachment_style: 'avoidant' as const,
    cbt_cue: 'Space is healthy; so is letting safe people in.',
    healing_focus: ['Micro-vulnerability', 'Name when "space" = fear', 'Ask for help earlier'],
    recommended_persona: 'FirewallBuilder'
  },
  gis: {
    attachment_style: 'disorganized' as const,
    cbt_cue: 'Mixed signals drain you; clarity is your ally.',
    healing_focus: ['Name needs despite fear', 'Keep boundary consistency', 'Trust safe ties slowly'],
    recommended_persona: 'VoidFragment'
  },
  sn: {
    attachment_style: 'secure' as const,
    cbt_cue: 'Use stability as base to expand vulnerability.',
    healing_focus: ['Support without self-erase', 'Stretch emotional range', 'Stay curious in conflict'],
    recommended_persona: 'user_choice'
  }
};

export async function POST(request: NextRequest) {
  try {
    const { answers }: { answers: QuizAnswer[] } = await request.json();

    console.log('=== QUIZ API DEBUG ===');
    console.log('Received answers:', answers);
    console.log('Answers count:', answers?.length);

    if (!answers || !Array.isArray(answers)) {
      console.log('Invalid answers format - not array');
      return NextResponse.json(
        { error: 'Invalid answers format. Expected array of answers.' },
        { status: 400 }
      );
    }

    if (answers.length !== 8) {
      console.log(`Invalid answers count: ${answers.length}, expected 8`);
      return NextResponse.json(
        { error: `Invalid answers count. Expected 8 questions, received ${answers.length}.` },
        { status: 400 }
      );
    }

    // Calculate scores per specification
    const scores = { df: 0, fb: 0, gis: 0, sn: 0 };

    console.log('=== QUIZ SCORING DEBUG ===');
    console.log('Input answers:', answers);

    answers.forEach(({ questionId, answer }) => {
      const questionScoring = scoringMap[questionId];
      if (questionScoring && questionScoring[answer]) {
        const { primary, secondary } = questionScoring[answer];
        scores[primary as keyof typeof scores] += 2; // Primary +2
        if (secondary) {
          scores[secondary as keyof typeof scores] += 1; // Secondary +1
        }
        console.log(`${questionId} -> ${answer}: ${primary}(+2)${secondary ? `, ${secondary}(+1)` : ''}`);
      }
    });

    console.log('Final scores:', scores);

    // Find highest scores
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const highest = sortedScores[0];
    const secondHighest = sortedScores[1];

    console.log('Sorted scores:', sortedScores);
    console.log('Highest:', highest, 'Second highest:', secondHighest);

    let result: ArchetypeResult;

    // Check for tie within 1 point (blend 60/40)
    if (highest[1] - secondHighest[1] <= 1 && highest[1] > 0) {
      console.log('Detected tie/close scores');
      // For ties, prefer secure if it's in top 2
      if (highest[0] === 'sn' || secondHighest[0] === 'sn') {
        console.log('Secure in top 2, choosing secure');
        const secureArchetype = 'sn';
        const details = archetypeDetails[secureArchetype];
        result = {
          archetype: secureArchetype,
          scores,
          attachment_style: details.attachment_style,
          cbt_cue: details.cbt_cue,
          healing_focus: details.healing_focus,
          recommended_persona: details.recommended_persona
        };
      } else {
        console.log('No secure in top 2, creating blend');
        // Near-balance → secure_node with shadow list
        const primaryCode = highest[0] as keyof typeof archetypeDetails;
        const secondaryCode = secondHighest[0] as keyof typeof archetypeDetails;
        
        result = {
          archetype: 'sn',
          scores,
          blend: {
            primary: primaryCode,
            secondary: secondaryCode,
            ratio: '60/40'
          },
          attachment_style: 'secure',
          cbt_cue: 'Use stability as base to expand vulnerability.',
          healing_focus: [
            ...archetypeDetails[primaryCode].healing_focus.slice(0, 2),
            ...archetypeDetails[secondaryCode].healing_focus.slice(0, 1)
          ],
          recommended_persona: 'user_choice'
        };
      }
    } else {
      console.log('Clear winner detected');
      // Clear winner
      const winningArchetype = highest[0] as keyof typeof archetypeDetails;
      const details = archetypeDetails[winningArchetype];
      
      result = {
        archetype: winningArchetype,
        scores,
        attachment_style: details.attachment_style,
        cbt_cue: details.cbt_cue,
        healing_focus: details.healing_focus,
        recommended_persona: details.recommended_persona
      };
    }

    // Log quiz completion event (per spec section 16)
    console.log('Quiz completed:', {
      event: 'quiz_completed',
      scores: result.scores,
      archetype: result.archetype,
      blend: result.blend,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error('Quiz scoring error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
