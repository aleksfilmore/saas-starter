/**
 * CTRL+ALT+BLOCK™ v1.1 - Journal Draft Management
 * Implements autosave every 3s & on blur + draft restoration per spec section 6
 */

export interface JournalDraft {
  id: string;
  userId: string;
  ritualId: string;
  assignmentId?: number;
  text: string;
  lastSaved: Date;
  startTime: Date;
  timingSeconds: number;
}

const AUTOSAVE_INTERVAL = 3000; // 3 seconds per spec
const DRAFT_STORAGE_KEY = 'ctrl_journal_drafts';

export class JournalDraftManager {
  private userId: string;
  private draftId: string;
  private autosaveTimer: NodeJS.Timeout | null = null;
  private startTime: Date;
  private isTyping = false;
  
  constructor(userId: string, ritualId: string, assignmentId?: number) {
    this.userId = userId;
    this.draftId = `${userId}_${ritualId}_${assignmentId || 'current'}`;
    this.startTime = new Date();
  }

  /**
   * Start autosave system
   */
  startAutosave(onSave: (draft: JournalDraft) => void) {
    this.stopAutosave();
    
    this.autosaveTimer = setInterval(() => {
      if (this.isTyping) {
        this.isTyping = false;
        this.saveCurrentDraft(onSave);
      }
    }, AUTOSAVE_INTERVAL);
  }

  /**
   * Stop autosave system
   */
  stopAutosave() {
    if (this.autosaveTimer) {
      clearInterval(this.autosaveTimer);
      this.autosaveTimer = null;
    }
  }

  /**
   * Mark user as actively typing
   */
  markTyping() {
    this.isTyping = true;
  }

  /**
   * Save draft immediately (on blur events)
   */
  saveCurrentDraft(onSave: (draft: JournalDraft) => void) {
    const textElement = document.getElementById('journal-textarea') as HTMLTextAreaElement;
    if (!textElement) return;

    const text = textElement.value;
    if (text.trim().length === 0) return;

    const now = new Date();
    const timingSeconds = Math.floor((now.getTime() - this.startTime.getTime()) / 1000);

    const draft: JournalDraft = {
      id: this.draftId,
      userId: this.userId,
      ritualId: this.draftId.split('_')[1],
      assignmentId: this.draftId.includes('current') ? undefined : parseInt(this.draftId.split('_')[2]),
      text,
      lastSaved: now,
      startTime: this.startTime,
      timingSeconds
    };

    // Save to localStorage
    this.saveDraftToStorage(draft);
    
    // Call callback for additional saving
    onSave(draft);
  }

  /**
   * Restore draft from storage
   */
  restoreDraft(): JournalDraft | null {
    try {
      const drafts = this.getAllDrafts();
      return drafts.find(d => d.id === this.draftId) || null;
    } catch (error) {
      console.error('Error restoring draft:', error);
      return null;
    }
  }

  /**
   * Delete current draft
   */
  deleteDraft() {
    try {
      const drafts = this.getAllDrafts();
      const filteredDrafts = drafts.filter(d => d.id !== this.draftId);
      
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(filteredDrafts));
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  }

  /**
   * Get all drafts for current user
   */
  getUserDrafts(): JournalDraft[] {
    try {
      const allDrafts = this.getAllDrafts();
      return allDrafts.filter(d => d.userId === this.userId);
    } catch (error) {
      console.error('Error getting user drafts:', error);
      return [];
    }
  }

  /**
   * Clean old drafts (older than 7 days)
   */
  cleanOldDrafts() {
    try {
      const allDrafts = this.getAllDrafts();
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      
      const activeDrafts = allDrafts.filter(d => 
        new Date(d.lastSaved) > weekAgo
      );
      
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(activeDrafts));
    } catch (error) {
      console.error('Error cleaning old drafts:', error);
    }
  }

  // Private methods
  private getAllDrafts(): JournalDraft[] {
    try {
      const stored = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Error parsing drafts from storage:', error);
      return [];
    }
  }

  private saveDraftToStorage(draft: JournalDraft) {
    try {
      const allDrafts = this.getAllDrafts();
      const existingIndex = allDrafts.findIndex(d => d.id === draft.id);
      
      if (existingIndex >= 0) {
        allDrafts[existingIndex] = draft;
      } else {
        allDrafts.push(draft);
      }
      
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(allDrafts));
    } catch (error) {
      console.error('Error saving draft to storage:', error);
    }
  }
}

/**
 * Server-side draft API helpers
 */
export async function saveDraftToServer(draft: Omit<JournalDraft, 'id'>) {
  try {
    const response = await fetch('/api/journal/draft', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(draft),
    });

    if (!response.ok) {
      throw new Error('Failed to save draft to server');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving draft to server:', error);
    throw error;
  }
}

export async function getDraftsFromServer(userId: string): Promise<JournalDraft[]> {
  try {
    const response = await fetch(`/api/journal/drafts?userId=${userId}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch drafts from server');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching drafts from server:', error);
    return [];
  }
}
