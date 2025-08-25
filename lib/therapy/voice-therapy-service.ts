/**
 * CTRL+ALT+BLOCK™ v1.1 - Voice Therapy Integration System
 * Advanced persona-voice therapy with archetype specialization per specification section 13
 */

import { db } from '@/lib/db';
import { eq, and, gte, desc, sql } from 'drizzle-orm';
import { users } from '@/lib/db/unified-schema';
import { enhancedFUPService } from '@/lib/fup/enhanced-fup-service';

export interface VoiceTherapySession {
  id: string;
  userId: string;
  personaVoice: 'analyst' | 'healer' | 'coach' | 'friend' | 'sage';
  archetype: string;
  sessionType: 'crisis' | 'routine' | 'breakthrough' | 'maintenance';
  userInput: string;
  responseGenerated: string;
  emotionalState: {
    detected: string[];
    intensity: number;
    valence: 'positive' | 'negative' | 'neutral';
  };
  therapeuticInterventions: string[];
  sessionDuration: number;
  effectiveness: number; // 0-1 score
  timestamp: Date;
}

export interface PersonaVoiceConfig {
  voice: 'analyst' | 'healer' | 'coach' | 'friend' | 'sage';
  specialization: string[];
  archetypeAffinity: Record<string, number>; // archetype -> affinity score
  responseStyle: {
    tone: string;
    language: string;
    interventionTypes: string[];
  };
  cooldownAfterIntense: number; // minutes
  maxSessionsPerDay: number;
}

export interface VoiceTherapyResponse {
  response: string;
  interventionUsed: string[];
  emotionalCalibration: {
    detected: string[];
    addressed: string[];
    recommended: string[];
  };
  followUpSuggested: boolean;
  sessionEffectiveness: number;
  archetypePersonalization: string[];
}

export class VoiceTherapyService {
  
  private personaConfigs: Record<string, PersonaVoiceConfig> = {
    analyst: {
      voice: 'analyst',
      specialization: ['cognitive_restructuring', 'logical_analysis', 'pattern_recognition'],
      archetypeAffinity: {
        'df': 0.9,  // Data Flooder - loves analytical approach
        'fb': 0.3,  // Firewall Builder - too clinical
        'gis': 0.7, // Ghost in Shell - appreciates clarity
        'sn': 0.5   // Secure Node - moderate fit
      },
      responseStyle: {
        tone: 'logical_supportive',
        language: 'precise_technical',
        interventionTypes: ['cognitive_reframe', 'evidence_evaluation', 'cost_benefit_analysis']
      },
      cooldownAfterIntense: 120, // 2 hours
      maxSessionsPerDay: 8
    },
    healer: {
      voice: 'healer',
      specialization: ['emotional_regulation', 'trauma_processing', 'self_compassion'],
      archetypeAffinity: {
        'df': 0.4,  // Data Flooder - too emotional
        'fb': 0.8,  // Firewall Builder - gentle approach
        'gis': 0.6, // Ghost in Shell - healing integration
        'sn': 0.7   // Secure Node - supportive growth
      },
      responseStyle: {
        tone: 'gentle_nurturing',
        language: 'empathetic_warm',
        interventionTypes: ['emotional_validation', 'self_soothing', 'inner_child_work']
      },
      cooldownAfterIntense: 180, // 3 hours
      maxSessionsPerDay: 6
    },
    coach: {
      voice: 'coach',
      specialization: ['goal_setting', 'motivation', 'behavioral_change'],
      archetypeAffinity: {
        'df': 0.6,  // Data Flooder - structured approach
        'fb': 0.5,  // Firewall Builder - not too pushy
        'gis': 0.7, // Ghost in Shell - likes systems
        'sn': 0.9   // Secure Node - natural fit
      },
      responseStyle: {
        tone: 'encouraging_direct',
        language: 'action_oriented',
        interventionTypes: ['goal_planning', 'accountability', 'skill_building']
      },
      cooldownAfterIntense: 90, // 1.5 hours
      maxSessionsPerDay: 10
    },
    friend: {
      voice: 'friend',
      specialization: ['active_listening', 'emotional_support', 'perspective_sharing'],
      archetypeAffinity: {
        'df': 0.5,  // Data Flooder - casual balance
        'fb': 0.8,  // Firewall Builder - safe connection
        'gis': 0.7, // Ghost in Shell - authentic relating
        'sn': 0.8   // Secure Node - natural connector
      },
      responseStyle: {
        tone: 'casual_supportive',
        language: 'conversational_relatable',
        interventionTypes: ['active_listening', 'normalization', 'shared_experience']
      },
      cooldownAfterIntense: 60, // 1 hour
      maxSessionsPerDay: 12
    },
    sage: {
      voice: 'sage',
      specialization: ['wisdom_sharing', 'meaning_making', 'spiritual_integration'],
      archetypeAffinity: {
        'df': 0.3,  // Data Flooder - too abstract
        'fb': 0.6,  // Firewall Builder - gentle wisdom
        'gis': 0.9, // Ghost in Shell - integration focus
        'sn': 0.7   // Secure Node - growth wisdom
      },
      responseStyle: {
        tone: 'wise_contemplative',
        language: 'metaphorical_deep',
        interventionTypes: ['meaning_making', 'perspective_shift', 'values_clarification']
      },
      cooldownAfterIntense: 240, // 4 hours
      maxSessionsPerDay: 4
    }
  };

  /**
   * Initiate voice therapy session with FUP enforcement
   */
  async initiateSession(
    userId: string, 
    userInput: string, 
    preferredVoice?: 'analyst' | 'healer' | 'coach' | 'friend' | 'sage',
    sessionType: 'crisis' | 'routine' | 'breakthrough' | 'maintenance' = 'routine'
  ): Promise<{ allowed: boolean; session?: VoiceTherapySession; reason?: string; cooldownMinutes?: number }> {
    
    try {
      // Get user context
      const userContext = await this.getUserContext(userId);
      
      // Determine optimal voice based on user archetype and request
      const optimalVoice = preferredVoice || this.selectOptimalVoice(userContext.archetype || 'sn', sessionType);
      
      // Check FUP enforcement
      const fupCheck = await enhancedFUPService.enforceAITherapyFUP(userId, optimalVoice);
      if (!fupCheck.allowed) {
        return {
          allowed: false,
          reason: fupCheck.reason,
          cooldownMinutes: fupCheck.cooldownMinutes
        };
      }

      // Generate therapeutic response
      const response = await this.generateTherapeuticResponse(
        userInput,
        optimalVoice,
        userContext,
        sessionType
      );

      // Create session record
      const session: VoiceTherapySession = {
        id: `session_${Date.now()}_${userId}`,
        userId,
        personaVoice: optimalVoice,
        archetype: userContext.archetype || 'sn',
        sessionType,
        userInput,
        responseGenerated: response.response,
        emotionalState: response.emotionalCalibration.detected.length > 0 ? {
          detected: response.emotionalCalibration.detected,
          intensity: this.calculateEmotionalIntensity(userInput),
          valence: this.detectEmotionalValence(userInput)
        } : {
          detected: ['neutral'],
          intensity: 0.3,
          valence: 'neutral'
        },
        therapeuticInterventions: response.interventionUsed,
        sessionDuration: this.estimateSessionDuration(userInput, response.response),
        effectiveness: response.sessionEffectiveness,
        timestamp: new Date()
      };

      // Store session (would save to database)
      await this.storeSession(session);

      return {
        allowed: true,
        session
      };

    } catch (error) {
      console.error('Error initiating voice therapy session:', error);
      return {
        allowed: false,
        reason: 'Voice therapy service temporarily unavailable'
      };
    }
  }

  /**
   * Select optimal voice based on archetype and session type
   */
  private selectOptimalVoice(
    archetype: string, 
    sessionType: 'crisis' | 'routine' | 'breakthrough' | 'maintenance'
  ): 'analyst' | 'healer' | 'coach' | 'friend' | 'sage' {
    
    // Crisis sessions prioritize healer and friend voices
    if (sessionType === 'crisis') {
      if (archetype === 'fb') return 'healer';
      if (archetype === 'sn') return 'friend';
      return 'healer'; // Default for crisis
    }

    // Breakthrough sessions prefer analyst and sage
    if (sessionType === 'breakthrough') {
      if (archetype === 'df') return 'analyst';
      if (archetype === 'gis') return 'sage';
      return 'analyst'; // Default for breakthrough
    }

    // Routine and maintenance based on archetype affinity
    const bestVoice = Object.entries(this.personaConfigs)
      .sort(([, a], [, b]) => (b.archetypeAffinity[archetype] || 0) - (a.archetypeAffinity[archetype] || 0))
      [0][0] as 'analyst' | 'healer' | 'coach' | 'friend' | 'sage';

    return bestVoice;
  }

  /**
   * Generate therapeutic response with archetype personalization
   */
  private async generateTherapeuticResponse(
    userInput: string,
    voice: 'analyst' | 'healer' | 'coach' | 'friend' | 'sage',
    userContext: any,
    sessionType: string
  ): Promise<VoiceTherapyResponse> {
    
    const config = this.personaConfigs[voice];
    
    // Analyze emotional content
    const emotionalAnalysis = this.analyzeEmotionalContent(userInput);
    
    // Generate base response using voice configuration
    const baseResponse = await this.generateBaseResponse(userInput, config, emotionalAnalysis, sessionType);
    
    // Apply archetype personalization
    const personalizedResponse = this.personalizeForArchetype(baseResponse, userContext.archetype, voice);
    
    // Select therapeutic interventions
    const interventions = this.selectInterventions(emotionalAnalysis, config, sessionType);
    
    // Calculate session effectiveness
    const effectiveness = this.calculateSessionEffectiveness(userInput, personalizedResponse, interventions);

    return {
      response: personalizedResponse,
      interventionUsed: interventions,
      emotionalCalibration: {
        detected: emotionalAnalysis.emotions,
        addressed: interventions,
        recommended: this.getFollowUpRecommendations(emotionalAnalysis, voice)
      },
      followUpSuggested: effectiveness < 0.7, // Suggest follow-up if not highly effective
      sessionEffectiveness: effectiveness,
      archetypePersonalization: this.getArchetypePersonalizationApplied(userContext.archetype, voice)
    };
  }

  /**
   * Analyze emotional content of user input
   */
  private analyzeEmotionalContent(input: string): { emotions: string[]; intensity: number; themes: string[] } {
    const emotionKeywords = {
      anxiety: ['anxious', 'worried', 'nervous', 'scared', 'fearful'],
      sadness: ['sad', 'depressed', 'down', 'hopeless', 'empty'],
      anger: ['angry', 'mad', 'furious', 'frustrated', 'irritated'],
      joy: ['happy', 'excited', 'great', 'wonderful', 'amazing'],
      love: ['love', 'care', 'affection', 'connection', 'bond']
    };

    const detected = [];
    const lowerInput = input.toLowerCase();
    
    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        detected.push(emotion);
      }
    }

    // Simple intensity calculation
    const intensityWords = ['very', 'extremely', 'really', 'so', 'incredibly'];
    const intensity = intensityWords.some(word => lowerInput.includes(word)) ? 0.8 : 0.5;

    // Theme detection
    const themes = [];
    if (lowerInput.includes('relationship') || lowerInput.includes('partner')) themes.push('relationship');
    if (lowerInput.includes('work') || lowerInput.includes('job')) themes.push('career');
    if (lowerInput.includes('family')) themes.push('family');
    if (lowerInput.includes('future') || lowerInput.includes('goal')) themes.push('future');

    return {
      emotions: detected.length > 0 ? detected : ['neutral'],
      intensity,
      themes
    };
  }

  /**
   * Generate base therapeutic response
   */
  private async generateBaseResponse(
    input: string, 
    config: PersonaVoiceConfig, 
    emotional: any, 
    sessionType: string
  ): Promise<string> {
    
    // This would integrate with AI model in production
    // For now, return template-based response
    
    const responses = {
      analyst: {
        crisis: "I understand you're experiencing significant distress. Let's analyze this situation step by step to identify the key factors and develop a logical approach to address them.",
        routine: "Let's examine the patterns in what you're sharing. What specific elements stand out to you as most significant?",
        breakthrough: "This sounds like an important realization. Let's break down the components and understand how this new insight fits with your existing knowledge.",
        maintenance: "How are you tracking your progress on the goals we've discussed? What data points can we review?"
      },
      healer: {
        crisis: "I can feel the pain in your words. You're not alone in this, and what you're experiencing is valid. Let's create some space for healing together.",
        routine: "Thank you for sharing this with me. I sense there are deeper feelings here. What would it feel like to show yourself compassion right now?",
        breakthrough: "What a beautiful moment of growth. Your heart is opening to new possibilities. How does this feel in your body?",
        maintenance: "You're doing such important inner work. How can we nurture the healing you've already cultivated?"
      },
      coach: {
        crisis: "I hear that you're struggling, and I want you to know that this is temporary. What's one small step we can take right now to move you toward stability?",
        routine: "Great work showing up today. What specific outcome are you looking to achieve from our conversation?",
        breakthrough: "This is exciting progress! How can we build momentum from this insight and create actionable next steps?",
        maintenance: "You're building solid foundations. What systems can we put in place to sustain this progress?"
      },
      friend: {
        crisis: "Oh, this sounds really tough. I'm here with you. You don't have to go through this alone. Want to talk about what's happening?",
        routine: "I'm glad you're sharing this with me. It sounds like there's a lot on your mind. What's been the hardest part?",
        breakthrough: "Wow, that's such an important realization! I'm so proud of you for seeing this. How are you feeling about it?",
        maintenance: "It's so good to check in with you. You've been working so hard on yourself. What's feeling different lately?"
      },
      sage: {
        crisis: "In this moment of darkness, remember that even the deepest valleys lead to higher ground. What wisdom is this experience offering you?",
        routine: "Life often speaks to us through our challenges. What deeper meaning might be emerging from your current experience?",
        breakthrough: "You've touched something profound. This understanding is a gift. How might this wisdom transform your path forward?",
        maintenance: "The journey of growth is like tending a garden. What seeds of wisdom are you nurturing in this season?"
      }
    };

    const voiceResponses = responses[config.voice];
    const sessionResponse = sessionType in voiceResponses ? 
      voiceResponses[sessionType as keyof typeof voiceResponses] : 
      voiceResponses.routine;
    
    return sessionResponse;
  }

  /**
   * Personalize response for user's archetype
   */
  private personalizeForArchetype(response: string, archetype: string, voice: string): string {
    const personalizations = {
      'df': { // Data Flooder
        analyst: response.replace(/feel/g, 'process').replace(/emotion/g, 'data'),
        healer: response + " Remember, emotions are information - valuable data about your internal state.",
        coach: response + " Let's create a systematic approach to track your progress.",
        friend: response + " I know you like to understand the logic behind things.",
        sage: response + " Consider this insight as code to be compiled into wisdom."
      },
      'fb': { // Firewall Builder  
        analyst: response.replace(/examine/g, 'safely explore').replace(/analyze/g, 'carefully review'),
        healer: response + " You can control the pace of this healing journey.",
        coach: response + " We'll build these changes gradually, at your comfort level.",
        friend: response + " You're safe to share whatever feels right to you.",
        sage: response + " Wisdom grows within the boundaries you create for yourself."
      },
      'gis': { // Ghost in Shell
        analyst: response + " Let's integrate these different perspectives into a coherent whole.",
        healer: response + " Your scattered pieces are finding their way home to wholeness.",
        coach: response + " We'll help align all parts of yourself toward this goal.",
        friend: response + " It's okay that you feel different things at the same time.",
        sage: response + " In integration, the fragments become a beautiful mosaic."
      },
      'sn': { // Secure Node
        analyst: response + " Your natural stability gives you a strong foundation for this work.",
        healer: response + " You have such a solid core to build this healing upon.",
        coach: response + " Your reliability is an asset we can leverage for consistent progress.",
        friend: response + " I can always count on you to be genuine and grounded.",
        sage: response + " Your groundedness allows others to feel safe in growth."
      }
    };

    const archetypePersonalization = personalizations[archetype as keyof typeof personalizations];
    if (archetypePersonalization && voice in archetypePersonalization) {
      return archetypePersonalization[voice as keyof typeof archetypePersonalization];
    }
    
    return response;
  }

  /**
   * Helper methods
   */
  private async getUserContext(userId: string) {
    const user = await db
      .select({
        archetype: users.emotionalArchetype,
        tier: users.tier
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return user[0] || { archetype: 'sn', tier: 'ghost' };
  }

  private selectInterventions(emotional: any, config: PersonaVoiceConfig, sessionType: string): string[] {
    // Select appropriate interventions based on emotions and voice specialization
    const interventions = [];
    
    if (emotional.emotions.includes('anxiety')) {
      interventions.push(config.responseStyle.interventionTypes[0]);
    }
    
    if (sessionType === 'crisis') {
      interventions.push('crisis_stabilization');
    }
    
    return interventions.length > 0 ? interventions : [config.responseStyle.interventionTypes[0]];
  }

  private calculateEmotionalIntensity(input: string): number {
    const intensityWords = ['extremely', 'very', 'really', 'so', 'incredibly', 'absolutely'];
    const lowerInput = input.toLowerCase();
    
    let intensity = 0.3; // Base intensity
    intensityWords.forEach(word => {
      if (lowerInput.includes(word)) intensity += 0.2;
    });
    
    return Math.min(1, intensity);
  }

  private detectEmotionalValence(input: string): 'positive' | 'negative' | 'neutral' {
    const positiveWords = ['happy', 'good', 'great', 'wonderful', 'amazing', 'love', 'joy'];
    const negativeWords = ['sad', 'bad', 'terrible', 'awful', 'hate', 'angry', 'depressed'];
    
    const lowerInput = input.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerInput.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerInput.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private estimateSessionDuration(input: string, response: string): number {
    // Estimate based on word count and complexity
    const totalWords = input.split(' ').length + response.split(' ').length;
    return Math.max(5, Math.round(totalWords / 10)); // Rough estimate in minutes
  }

  private calculateSessionEffectiveness(input: string, response: string, interventions: string[]): number {
    // Simple effectiveness calculation
    let effectiveness = 0.5; // Base
    
    if (interventions.length > 0) effectiveness += 0.2;
    if (response.length > 200) effectiveness += 0.1;
    if (response.includes('you')) effectiveness += 0.1; // Personalized
    
    return Math.min(1, effectiveness);
  }

  private getFollowUpRecommendations(emotional: any, voice: string): string[] {
    const recommendations = ['self_reflection'];
    
    if (emotional.intensity > 0.7) {
      recommendations.push('schedule_follow_up');
    }
    
    if (emotional.emotions.includes('anxiety')) {
      recommendations.push('breathing_exercise');
    }
    
    return recommendations;
  }

  private getArchetypePersonalizationApplied(archetype: string, voice: string): string[] {
    return [`archetype_${archetype}_adaptation`, `voice_${voice}_specialization`];
  }

  private async storeSession(session: VoiceTherapySession): Promise<void> {
    // Would store to database in production
    console.log('Voice therapy session stored:', session.id);
  }
}

export const voiceTherapyService = new VoiceTherapyService();
