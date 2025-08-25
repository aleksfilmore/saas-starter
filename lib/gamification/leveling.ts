// DEPRECATED: Leveling system removed (XP eliminated). Retained as thin shim
// so legacy imports don't crash. All functions now return neutral values.

export function xpThresholdForLevel(_level: number): number { return 0; }

export function getNextLevelXP(_currentLevel: number): number { return 0; }

export function progressToNextLevel(_xp: number, _level: number): number { return 0; }

export interface LevelProgressSnapshot {
  level: number;
  xp: number;
  baseThreshold: number;
  nextThreshold: number;
  progressFraction: number; // 0..1
  remainingXP: number;
  spanXP: number;
}

export function getLevelProgressSnapshot(_xp: number, _level: number): LevelProgressSnapshot {
  return {
    level: 1,
    xp: 0,
    baseThreshold: 0,
    nextThreshold: 0,
    progressFraction: 0,
    remainingXP: 0,
    spanXP: 0
  };
}
