import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface TherapyContext {
  userProfile: {
    codename: string;
    phase: string;
    emotionalTone: string;
    attachmentStyle: string;
    distressLevel: number;
    noContactDays: number;
  };
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
  }>;
  sessionType: 'therapy' | 'crisis' | 'protocol-ghost' | 'ritual-guidance';
  personalityMode: 'savage-bestie' | 'zen-master' | 'therapist' | 'chaos-goblin' | 'brutal-saint';
}

export interface AIResponse {
  message: string;
  emotionalTone: 'supportive' | 'challenging' | 'empathetic' | 'motivational' | 'humorous';
  actionSuggestions?: string[];
  ritualRecommendations?: string[];
  xpReward?: number;
  byteReward?: number;
  triggerWarnings?: string[];
}

class CTRLALTBLOCKAIEngine {
  private getSystemPrompt(context: TherapyContext): string {
    const { userProfile, sessionType, personalityMode } = context;
    
    const basePrompt = `You are an AI therapist for CTRL+ALT+BLOCK™, a tech-themed breakup recovery platform. 

USER PROFILE:
- Codename: ${userProfile.codename}
- Recovery Phase: ${userProfile.phase}
- Emotional Tone: ${userProfile.emotionalTone}
- Attachment Style: ${userProfile.attachmentStyle}
- Distress Level: ${userProfile.distressLevel}/10
- No-Contact Days: ${userProfile.noContactDays}

BRAND IDENTITY:
- Use tech/gaming metaphors (system crash, reboot, debugging, malware)
- Avoid traditional therapy jargon
- Be direct, authentic, and sometimes edgy
- Focus on empowerment and growth, not just comfort

SESSION TYPE: ${sessionType.toUpperCase()}
PERSONALITY MODE: ${personalityMode.toUpperCase()}`;

    // Add personality-specific instructions
    switch (personalityMode) {
      case 'savage-bestie':
        return basePrompt + `

PERSONALITY: SAVAGE BESTIE
- Be brutally honest but loving
- Call out self-destructive patterns directly
- Use humor and sarcasm when appropriate
- Give tough love with real solutions
- Example: "Bestie, stalking their Instagram at 2 AM isn't 'research' - it's digital self-harm. Your nervous system can't tell the difference."`;

      case 'zen-master':
        return basePrompt + `

PERSONALITY: ZEN MASTER
- Speak with calm wisdom and perspective
- Use mindfulness and acceptance approaches
- Offer gentle but profound insights
- Focus on present moment awareness
- Example: "The urge to text them is just a feeling, not a fact. It will pass like clouds across the sky."`;

      case 'therapist':
        return basePrompt + `

PERSONALITY: PROFESSIONAL THERAPIST
- Maintain professional but warm boundaries
- Use evidence-based therapeutic techniques
- Ask thoughtful questions to promote insight
- Provide structured coping strategies
- Example: "I notice a pattern in what you're describing. How do you think your attachment style might be influencing this response?"`;

      case 'chaos-goblin':
        return basePrompt + `

PERSONALITY: CHAOS GOBLIN
- Be playfully chaotic and unpredictable
- Use dark humor and absurd metaphors
- Challenge conventional wisdom
- Suggest unconventional but healthy activities
- Example: "Why are we crying over someone who probably puts ketchup on steak? Let's plot your villain era instead."`;

      case 'brutal-saint':
        return basePrompt + `

PERSONALITY: BRUTAL SAINT
- Combine harsh truths with genuine compassion
- Be unflinchingly honest about reality
- Offer practical, no-nonsense guidance
- Balance toughness with real care
- Example: "The truth is they're not coming back. The also truth is that you're going to be better for it. Both can be true."`;

      default:
        return basePrompt + `

PERSONALITY: ADAPTIVE
- Match the user's energy and needs
- Be flexible in your approach
- Respond authentically to their emotional state`;
    }
  }

  private getCrisisPrompt(): string {
    return `CRISIS MODE ACTIVATED

You are responding to someone in acute emotional distress. Priority is safety and stabilization.

IMMEDIATE PROTOCOLS:
1. Assess for self-harm risk (if indicated, provide crisis resources)
2. Validate their pain without minimizing
3. Offer grounding techniques
4. Suggest immediate coping strategies
5. Encourage professional help if needed

CRISIS RESOURCES TO MENTION:
- 988 Suicide & Crisis Lifeline (Call or Text)
- Crisis Text Line: Text HOME to 741741
- National Domestic Violence Hotline: 1-800-799-7233

Be direct, compassionate, and action-oriented. This is not the time for humor or tough love.`;
  }

  async generateResponse(
    userMessage: string,
    context: TherapyContext
  ): Promise<AIResponse> {
    try {
      const systemPrompt = context.sessionType === 'crisis' 
        ? this.getCrisisPrompt() 
        : this.getSystemPrompt(context);

      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: 'system', content: systemPrompt },
        // Add conversation history
        ...context.conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        max_tokens: 500,
        temperature: 0.8,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const responseContent = completion.choices[0]?.message?.content || '';

      // Parse the response for additional features
      const response: AIResponse = {
        message: responseContent,
        emotionalTone: this.detectEmotionalTone(responseContent),
        xpReward: this.calculateXPReward(context, responseContent),
        byteReward: this.calculateByteReward(context, responseContent),
      };

      // Add action suggestions if appropriate
      if (context.sessionType === 'therapy') {
        response.actionSuggestions = await this.generateActionSuggestions(context, responseContent);
      }

      // Add ritual recommendations
      if (context.userProfile.emotionalTone === 'struggling') {
        response.ritualRecommendations = await this.generateRitualRecommendations(context);
      }

      return response;
    } catch (error) {
      console.error('AI Engine Error:', error);
      
      // Fallback response
      return {
        message: "I'm experiencing a system glitch right now. While I reboot, remember: you're stronger than you think, and this feeling will pass. Try some deep breathing or reach out to a friend. I'll be back online soon.",
        emotionalTone: 'supportive',
        xpReward: 5,
        byteReward: 5,
      };
    }
  }

  private detectEmotionalTone(message: string): AIResponse['emotionalTone'] {
    // Simple keyword-based tone detection
    if (message.includes('challenge') || message.includes('tough love')) return 'challenging';
    if (message.includes('understand') || message.includes('validate')) return 'empathetic';
    if (message.includes('you can') || message.includes('strength')) return 'motivational';
    if (message.includes('lol') || message.includes('😂')) return 'humorous';
    return 'supportive';
  }

  private calculateXPReward(context: TherapyContext, response: string): number {
    let baseXP = 10;
    
    // Bonus for longer, more thoughtful responses
    if (response.length > 200) baseXP += 5;
    
    // Bonus for crisis support
    if (context.sessionType === 'crisis') baseXP += 15;
    
    // Bonus for therapy sessions
    if (context.sessionType === 'therapy') baseXP += 10;
    
    return baseXP;
  }

  private calculateByteReward(context: TherapyContext, response: string): number {
    return Math.floor(this.calculateXPReward(context, response) * 0.6);
  }

  private async generateActionSuggestions(
    context: TherapyContext, 
    aiResponse: string
  ): Promise<string[]> {
    // Generate contextual action suggestions
    const suggestions = [];
    
    if (context.userProfile.emotionalTone === 'struggling') {
      suggestions.push('Complete a breathing exercise');
      suggestions.push('Journal for 5 minutes');
      suggestions.push('Take a walk or do gentle movement');
    }
    
    if (context.userProfile.noContactDays < 30) {
      suggestions.push('Update your no-contact counter');
      suggestions.push('Block one more mutual connection');
    }
    
    if (context.userProfile.distressLevel > 7) {
      suggestions.push('Use crisis support resources');
      suggestions.push('Reach out to a trusted friend');
      suggestions.push('Practice grounding techniques');
    }
    
    return suggestions.slice(0, 3); // Return max 3 suggestions
  }

  private async generateRitualRecommendations(context: TherapyContext): Promise<string[]> {
    const rituals = [];
    
    switch (context.userProfile.emotionalTone) {
      case 'struggling':
        rituals.push('5-Minute Rage Release');
        rituals.push('Mirror Affirmation Practice');
        rituals.push('Digital Detox Hour');
        break;
      case 'processing':
        rituals.push('Letter You\'ll Never Send');
        rituals.push('Timeline Reflection');
        rituals.push('Gratitude for Growth');
        break;
      case 'growing':
        rituals.push('Future Self Visualization');
        rituals.push('Skill Building Session');
        rituals.push('Community Support Activity');
        break;
    }
    
    return rituals.slice(0, 2);
  }

  // Protocol Ghost specific methods
  async generateProtocolGhostResponse(
    userMessage: string,
    personalityMode: TherapyContext['personalityMode'],
    userProfile: TherapyContext['userProfile']
  ): Promise<string> {
    const context: TherapyContext = {
      userProfile,
      conversationHistory: [],
      sessionType: 'protocol-ghost',
      personalityMode
    };

    const response = await this.generateResponse(userMessage, context);
    return response.message;
  }

  // Crisis intervention
  async handleCrisisIntervention(
    userMessage: string,
    userProfile: TherapyContext['userProfile']
  ): Promise<AIResponse> {
    const context: TherapyContext = {
      userProfile,
      conversationHistory: [],
      sessionType: 'crisis',
      personalityMode: 'therapist' // Always use therapist mode for crisis
    };

    return this.generateResponse(userMessage, context);
  }
}

export const aiEngine = new CTRLALTBLOCKAIEngine();
