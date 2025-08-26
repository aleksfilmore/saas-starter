// Centralized enum-like mapping for all byte update sources to avoid string drift
// Update this list when introducing a new earning action.
export const BytesEventSource = {
  CHECK_IN: 'checkIn',
  NO_CONTACT: 'noContact',
  RITUAL: 'ritual', // daily action key
  RITUAL_COMPLETE: 'ritualComplete', // explicit completion flow (modal)
  WALL_INTERACT: 'wallInteract',
  AI_CHAT: 'aiChat',
  WALL_POST: 'wallPost'
} as const;

export type BytesEventSourceValue = typeof BytesEventSource[keyof typeof BytesEventSource];

// Helper type guard (optional usage)
export function isBytesEventSource(val: string | undefined | null): val is BytesEventSourceValue {
  return !!val && Object.values(BytesEventSource).includes(val as any);
}
