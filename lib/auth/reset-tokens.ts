// Shared reset token store
// In production, this should be Redis or a database table

interface ResetTokenData {
  email: string;
  expires: number;
}

class ResetTokenStore {
  private tokens = new Map<string, ResetTokenData>();

  set(token: string, data: ResetTokenData): void {
    this.tokens.set(token, data);
    this.cleanup();
  }

  get(token: string): ResetTokenData | undefined {
    const data = this.tokens.get(token);
    if (data && data.expires < Date.now()) {
      this.tokens.delete(token);
      return undefined;
    }
    return data;
  }

  delete(token: string): void {
    this.tokens.delete(token);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [token, data] of this.tokens.entries()) {
      if (data.expires < now) {
        this.tokens.delete(token);
      }
    }
  }
}

export const resetTokenStore = new ResetTokenStore();
