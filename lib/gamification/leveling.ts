// Gamification leveling utilities (shared)
// Formula: XP threshold for level N is (N)^2 * 100. Next level threshold: (N+1)^2 * 100.
// This yields quadratic growth with widening bands.

export function xpThresholdForLevel(level: number): number {
  if (level <= 0) return 0;
  return level * level * 100;
}

export function getNextLevelXP(currentLevel: number): number {
  return (currentLevel + 1) * (currentLevel + 1) * 100;
}

export function progressToNextLevel(xp: number, level: number): number {
  if (level < 0) level = 0;
  const base = xpThresholdForLevel(level);
  const next = getNextLevelXP(level);
  const span = Math.max(1, next - base);
  const within = xp - base;
  return Math.min(1, Math.max(0, within / span));
}

export interface LevelProgressSnapshot {
  level: number;
  xp: number;
  baseThreshold: number;
  nextThreshold: number;
  progressFraction: number; // 0..1
  remainingXP: number;
  spanXP: number;
}

export function getLevelProgressSnapshot(xp: number, level: number): LevelProgressSnapshot {
  const base = xpThresholdForLevel(level);
  const next = getNextLevelXP(level);
  const span = next - base;
  const within = Math.max(0, xp - base);
  const fraction = Math.min(1, within / (span || 1));
  return {
    level,
    xp,
    baseThreshold: base,
    nextThreshold: next,
    progressFraction: fraction,
    remainingXP: Math.max(0, next - xp),
    spanXP: span
  };
}
