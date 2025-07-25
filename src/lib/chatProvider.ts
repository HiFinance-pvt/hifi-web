// Example provider configuration for AI chat
// This would typically connect to OpenAI, Anthropic, or other AI services

export interface ChatProvider {
  sendMessage: (message: string, sessionId?: string) => Promise<string>;
  createSession: (title?: string) => Promise<string>;
  getSessions: () => Promise<any[]>;
}

// Mock provider for development - replace with actual AI service
export const mockChatProvider: ChatProvider = {
  async sendMessage(message: string, sessionId?: string): Promise<string> {
    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock financial AI responses
    const responses = [
      "Based on your financial data, I recommend diversifying your portfolio with 60% stocks and 40% bonds.",
      "Your current DTI ratio is 28%, which is within the healthy range. Most lenders prefer to see DTI below 36%.",
      "Looking at your spending patterns, you spend most on housing (32%) and food (18%). Consider budgeting apps to track expenses.",
      "For next month's budget, I suggest allocating 50% to needs, 30% to wants, and 20% to savings and debt repayment.",
      "Your investment portfolio shows strong performance with a 12% annual return. Tech stocks are your top performers.",
      "Consider low-cost index funds like VTI or VTSAX for long-term growth with minimal fees.",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  },

  async createSession(title?: string): Promise<string> {
    const sessionId = `session_${Date.now()}`;
    return sessionId;
  },

  async getSessions(): Promise<any[]> {
    // Return mock sessions - in real app, this would fetch from database
    return [];
  },
};

// Example OpenAI provider setup (commented out - requires API key)
/*
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const openAIChatProvider: ChatProvider = {
  async sendMessage(message: string, sessionId?: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are Hi-Fi, a helpful financial assistant. Provide clear, accurate financial advice and analysis."
          },
          {
            role: "user",
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      return "I'm experiencing technical difficulties. Please try again later.";
    }
  },

  async createSession(title?: string): Promise<string> {
    // Implement session creation logic
    const sessionId = `session_${Date.now()}`;
    return sessionId;
  },

  async getSessions(): Promise<any[]> {
    // Implement session retrieval logic
    return [];
  }
};
*/
