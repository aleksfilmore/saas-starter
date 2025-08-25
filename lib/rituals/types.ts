// Shared Ritual DTO exposed to frontend (dashboard hub + ritual panels)
export interface RitualDTO {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  completed: boolean;
  duration?: string; // human readable (e.g. '15 min')
  category?: string;
  tier?: 'ghost' | 'firewall';
}

export interface RitualMetaDTO {
  canReroll: boolean;
  mode: 'ghost' | 'firewall';
}