declare module 'lucia' {
  /**
   * Minimal generateId replacement signature used across scripts.
   */
  export function generateId(len?: number): string;

  /**
   * Minimal User type surface used by UI components. Allow extra fields.
   */
  export type User = {
    id: string;
    email: string;
    username?: string | null;
    tier?: string | null;
    bytes?: number | null;
    ritual_streak?: number | null;
    no_contact_streak?: number | null;
    is_admin?: boolean;
    emailVerified?: boolean;
    createdAt?: Date | string | null;
    updatedAt?: Date | string | null;
    [key: string]: any;
  };

  // Allow importing other names without type errors
  export const some: any;
  export default any;
}
