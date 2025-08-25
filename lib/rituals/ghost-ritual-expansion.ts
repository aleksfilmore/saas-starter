// Helper utilities to expand ghost ritual bank toward 90 entries.
// Provides validation & a placeholder builder for rapid content iteration.
import { RITUAL_BANK, Ritual } from './ritual-bank';

export interface GhostRitualDraft {
  id: string; title: string; description: string; instructions: string[]; category: Ritual['category'];
  emotionalTone: Ritual['emotionalTone']; actionType: Ritual['actionType']; estimatedTime?: string; difficultyLevel?: Ritual['difficultyLevel']; byteReward?: number; tags?: string[];
}

export function validateGhostDraft(d: GhostRitualDraft): string[] {
  const errors: string[] = [];
  if (!d.id.startsWith('gexp-')) errors.push('id should start with gexp-');
  if (RITUAL_BANK.some(r=> r.id === d.id)) errors.push('id already exists in bank');
  if (d.instructions.length < 3) errors.push('needs at least 3 instructions');
  if (!d.estimatedTime) errors.push('estimatedTime required');
  return errors;
}

export function draftToRitual(d: GhostRitualDraft): Ritual {
  return {
    id: d.id,
    title: d.title,
    description: d.description,
    instructions: d.instructions,
    category: d.category,
    emotionalTone: d.emotionalTone,
    actionType: d.actionType,
    byteReward: d.byteReward ?? 20,
    tags: d.tags ?? [],
    tier: 'ghost',
    estimatedTime: d.estimatedTime!,
    difficultyLevel: d.difficultyLevel ?? 2
  };
}

export function countGhostRituals(): number {
  return RITUAL_BANK.filter(r => r.tier === 'ghost').length;
}

export function ghostRitualsNeeded(target = 90): number {
  return Math.max(0, target - countGhostRituals());
}

// Example usage (manual; not executed automatically):
// const draft: GhostRitualDraft = { id: 'gexp-identity-purge', title: 'Identity Purge', ... };
// const errs = validateGhostDraft(draft); if(!errs.length) RITUAL_BANK.push(draftToRitual(draft));