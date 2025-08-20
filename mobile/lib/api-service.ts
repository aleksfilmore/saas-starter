// Shared API service that works for both web and mobile
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { mobileAuth } from './auth/mobile-auth';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiService {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: process.env.EXPO_PUBLIC_API_URL || 'https://your-web-platform-url.com',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add authentication
    this.client.interceptors.request.use(
      async (config) => {
        if (mobileAuth.isAuthenticated()) {
          const user = await mobileAuth.getCurrentUser();
          if (user) {
            config.headers.Authorization = `Bearer ${(mobileAuth as any).sessionToken}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const refreshed = await mobileAuth.refreshSession();
          if (refreshed && error.config && !error.config._retry) {
            error.config._retry = true;
            return this.client.request(error.config);
          } else {
            await mobileAuth.signOut();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // User Profile APIs
  async getUserProfile(userId: string) {
    const response = await this.client.get<ApiResponse>(`/api/users/${userId}`);
    return response.data;
  }

  async updateUserProfile(userId: string, data: any) {
    const response = await this.client.put<ApiResponse>(`/api/users/${userId}`, data);
    return response.data;
  }

  // Rituals APIs
  async getUserRituals(userId: string) {
    const response = await this.client.get<ApiResponse>(`/api/rituals/user/${userId}`);
    return response.data;
  }

  async createRitual(ritualData: any) {
    const response = await this.client.post<ApiResponse>('/api/rituals', ritualData);
    return response.data;
  }

  async updateRitual(ritualId: string, data: any) {
    const response = await this.client.put<ApiResponse>(`/api/rituals/${ritualId}`, data);
    return response.data;
  }

  async deleteRitual(ritualId: string) {
    const response = await this.client.delete<ApiResponse>(`/api/rituals/${ritualId}`);
    return response.data;
  }

  async completeRitual(ritualId: string, completionData: any) {
    const response = await this.client.post<ApiResponse>(`/api/rituals/${ritualId}/complete`, completionData);
    return response.data;
  }

  // Progress APIs
  async getUserProgress(userId: string) {
    const response = await this.client.get<ApiResponse>(`/api/progress/user/${userId}`);
    return response.data;
  }

  async getUserStats(userId: string) {
    const response = await this.client.get<ApiResponse>(`/api/users/${userId}/stats`);
    return response.data;
  }

  // Achievements APIs
  async getUserAchievements(userId: string) {
    const response = await this.client.get<ApiResponse>(`/api/achievements/user/${userId}`);
    return response.data;
  }

  // Crisis Support APIs
  async getCrisisResources() {
    const response = await this.client.get<ApiResponse>('/api/crisis/resources');
    return response.data;
  }

  async createCrisisContact(contactData: any) {
    const response = await this.client.post<ApiResponse>('/api/crisis/contacts', contactData);
    return response.data;
  }

  // AI Therapy APIs
  async getAiTherapySession(sessionId: string) {
    const response = await this.client.get<ApiResponse>(`/api/ai-therapy/${sessionId}`);
    return response.data;
  }

  async createAiTherapyMessage(sessionId: string, message: string) {
    const response = await this.client.post<ApiResponse>(`/api/ai-therapy/${sessionId}/messages`, {
      message,
    });
    return response.data;
  }

  // No Contact Support APIs
  async getNoContactProgress(userId: string) {
    const response = await this.client.get<ApiResponse>(`/api/no-contact/progress/${userId}`);
    return response.data;
  }

  async updateNoContactStreak(userId: string, streakData: any) {
    const response = await this.client.post<ApiResponse>(`/api/no-contact/streak/${userId}`, streakData);
    return response.data;
  }

  // Quiz APIs
  async submitQuizResponse(quizData: any) {
    const response = await this.client.post<ApiResponse>('/api/quiz/submit', quizData);
    return response.data;
  }

  async getQuizResults(userId: string) {
    const response = await this.client.get<ApiResponse>(`/api/quiz/results/${userId}`);
    return response.data;
  }

  // Wall of Wounds APIs
  async getWallEntries(userId: string) {
    const response = await this.client.get<ApiResponse>(`/api/wall/entries/${userId}`);
    return response.data;
  }

  async createWallEntry(entryData: any) {
    const response = await this.client.post<ApiResponse>('/api/wall/entries', entryData);
    return response.data;
  }

  async updateWallEntry(entryId: string, data: any) {
    const response = await this.client.put<ApiResponse>(`/api/wall/entries/${entryId}`, data);
    return response.data;
  }

  // Settings APIs
  async getUserSettings(userId: string) {
    const response = await this.client.get<ApiResponse>(`/api/settings/${userId}`);
    return response.data;
  }

  async updateUserSettings(userId: string, settings: any) {
    const response = await this.client.put<ApiResponse>(`/api/settings/${userId}`, settings);
    return response.data;
  }

  // File Upload APIs
  async uploadFile(file: FormData, type: 'profile' | 'ritual' | 'wall') {
    const response = await this.client.post<ApiResponse>(`/api/upload/${type}`, file, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // =====================================
  // QUICKACTIONS APIs (for cross-platform sync)
  // =====================================

  // Mood Check-in APIs
  async logMoodCheckIn(moodData: any) {
    const response = await this.client.post<ApiResponse>('/api/quickactions/mood', moodData);
    return response.data;
  }

  async getMoodHistory(days: number = 7) {
    const response = await this.client.get<ApiResponse>(`/api/quickactions/mood?days=${days}`);
    return response.data;
  }

  // Breathing Exercise APIs
  async logBreathingExercise(exerciseData: any) {
    const response = await this.client.post<ApiResponse>('/api/quickactions/breathing', exerciseData);
    return response.data;
  }

  async getBreathingHistory(days: number = 7) {
    const response = await this.client.get<ApiResponse>(`/api/quickactions/breathing?days=${days}`);
    return response.data;
  }

  // Mindfulness Exercise APIs
  async logMindfulnessExercise(exerciseData: any) {
    const response = await this.client.post<ApiResponse>('/api/quickactions/mindfulness', exerciseData);
    return response.data;
  }

  async getMindfulnessHistory(days: number = 7) {
    const response = await this.client.get<ApiResponse>(`/api/quickactions/mindfulness?days=${days}`);
    return response.data;
  }

  // Gratitude Journal APIs
  async logGratitudeJournal(journalData: any) {
    const response = await this.client.post<ApiResponse>('/api/quickactions/gratitude', journalData);
    return response.data;
  }

  async getGratitudeHistory(days: number = 7) {
    const response = await this.client.get<ApiResponse>(`/api/quickactions/gratitude?days=${days}`);
    return response.data;
  }

  // =====================================
  // LUMO APIs (for cross-platform sync)
  // =====================================

  // Lumo Onboarding APIs
  async getLumoOnboardingState() {
    const response = await this.client.get<ApiResponse>('/api/lumo/onboarding');
    return response.data;
  }

  async updateLumoOnboardingState(action: string, data?: any) {
    const response = await this.client.post<ApiResponse>('/api/lumo/onboarding', { action, data });
    return response.data;
  }

  // Lumo Chat APIs (if implemented)
  async sendLumoMessage(message: string, persona?: string) {
    const response = await this.client.post<ApiResponse>('/api/lumo/chat', { 
      message, 
      persona: persona || 'core' 
    });
    return response.data;
  }

  async getLumoChatHistory() {
    const response = await this.client.get<ApiResponse>('/api/lumo/chat');
    return response.data;
  }
}

export const apiService = new ApiService();
