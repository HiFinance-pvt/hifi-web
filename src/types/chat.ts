export interface User {
  id: string;
  name: string;
  avatar?: string;
  isVerified?: boolean;
  role?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  category: 'starred' | 'chats';
  createdAt: Date;
  updatedAt: Date;
  conversations: ChatConversation[];
}

export interface ChatConversation {
  id: string;
  question: string;
  response?: string;
  isLoading?: boolean;
  createdAt: Date;
  updatedAt: Date;
  files?: ConversationFile[];
  sources?: ConversationSource[];
}

export interface ConversationFile {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface ConversationSource {
  id: string;
  title: string;
  url: string;
  image?: string;
}

export interface ChatState {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  user: User | null;
}

export interface QuickAction {
  id: string;
  text: string;
  category?: string;
}

export type ChatCategory = 'starred' | 'chats';

export interface SidebarSection {
  title: string;
  category: ChatCategory;
  sessions: ChatSession[];
}

export interface FinancialPrompt {
  id: string;
  text: string;
  category: "investment" | "budgeting" | "analysis" | "planning";
}

export const financialPrompts: FinancialPrompt[] = [
  {
    id: "1",
    text: "What can I buy in upcoming 30 days?",
    category: "budgeting",
  },
  {
    id: "2",
    text: "What is my current DTI?",
    category: "analysis",
  },
  {
    id: "3",
    text: "Show me my spending patterns",
    category: "analysis",
  },
  {
    id: "4",
    text: "Help me budget for next month",
    category: "planning",
  },
  {
    id: "5",
    text: "Analyze my investment portfolio",
    category: "investment",
  },
  {
    id: "6",
    text: "What are good investment options?",
    category: "investment",
  },
];
