export interface User {
  id: string;
  name: string;
  avatar?: string;
  isVerified?: boolean;
  role?: string;
}

export interface FunctionCall {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  result?: any;
}

export interface ResponseData {
  text: string;
  functionCalls?: FunctionCall[];
  jsonData?: Record<string, any>;
}

export interface AdkMessage {
  text?: string;
  function_called_name?: string;
  function_call?: {
    id?: string;
    name?: string;
    args?: Record<string, any>;
  };
  function_response_content?: Record<string, any>;
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
  response?: string | ResponseData;
  isLoading?: boolean;
  createdAt: Date;
  updatedAt: Date;
  files?: ConversationFile[];
  sources?: ConversationSource[];
  adkMessage?: AdkMessage;
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
