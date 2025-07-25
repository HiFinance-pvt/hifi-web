import { ChatSession, QuickAction } from "@/types/chat";

// Sample starred sessions (matching the screenshot)
export const STARRED_SESSIONS: ChatSession[] = [
  {
    id: "starred-1",
    title: "What is the best way to invest in the stock market?",
    category: "starred",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    conversations: [
      {
        id: "conv-1",
        question: "What is the best way to invest in the stock market?",
        response: "I'll help you analyze key competitors in the fintech industry. Let me break down the major players and their market positioning...",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      }
    ],
  },
  {
    id: "starred-2",
    title: "What is the E-KYC process?",
    category: "starred",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    conversations: [],
  },
  {
    id: "starred-3",
    title: "Help me with my loan application",
    category: "starred",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    conversations: [],
  },
  {
    id: "starred-4",
    title: "How to apply for a credit card?",
    category: "starred",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    conversations: [],
  },
];

// Sample chat sessions
export const CHAT_SESSIONS: ChatSession[] = [
  {
    id: "chat-1",
    title: "Portfolio Optimization Strategy",
    category: "chats",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    conversations: [
      {
        id: "conv-p1",
        question: "How should I optimize my investment portfolio?",
        response: "Based on your risk profile and financial goals, I recommend a balanced approach...",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      }
    ],
  },
  {
    id: "chat-2",
    title: "Tax Planning for 2024",
    category: "chats",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    conversations: [],
  },
  {
    id: "chat-3",
    title: "Real Estate Investment Analysis",
    category: "chats",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    conversations: [],
  },
  {
    id: "chat-4",
    title: "Retirement Planning Discussion",
    category: "chats",
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    conversations: [],
  },
  {
    id: "chat-5",
    title: "Crypto Investment Guidelines",
    category: "chats",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    conversations: [],
  },
  {
    id: "chat-6",
    title: "Emergency Fund Strategy",
    category: "chats",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    conversations: [],
  },
  {
    id: "chat-7",
    title: "Stock Market Analysis",
    category: "chats",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    conversations: [],
  },
  {
    id: "chat-8",
    title: "Budget Planning Help",
    category: "chats",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    conversations: [],
  },
];

// All sessions combined
export const ALL_SESSIONS = [...STARRED_SESSIONS, ...CHAT_SESSIONS];

// Quick action suggestions (matching the screenshot)
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: "action-1",
    text: "What can I buy in upcoming 30 days?",
    category: "investments",
  },
  {
    id: "action-2", 
    text: "What is my current DTI?",
    category: "metrics",
  },
  {
    id: "action-3",
    text: "How should I diversify my portfolio?",
    category: "portfolio",
  },
  {
    id: "action-4",
    text: "What are the best tax-saving investments?",
    category: "tax",
  },
  {
    id: "action-5",
    text: "Analyze my spending patterns",
    category: "analytics",
  },
  {
    id: "action-6",
    text: "Create a retirement savings plan",
    category: "planning",
  },
];

// App configuration
export const APP_CONFIG = {
  appName: "Hi-Fi",
  welcomeMessage: "Welcome to Hi-Fi!",
  subtitle: "How can I assist you with finance?",
  placeholderText: "Ask questions, or type '@' to call Agent.",
  allowedFileTypes: [
    ".pdf",
    ".doc", 
    ".docx",
    ".xlsx",
    ".csv",
    ".png",
    ".jpg",
    ".jpeg"
  ],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxConversationsPerSession: 100,
  maxSessionsStored: 500,
};

// Navigation menu items
export const NAVIGATION_ITEMS = [
  {
    id: "agents-hub",
    label: "Agents Hub",
    icon: "🤖",
    href: "/agents",
  },
  {
    id: "settings",
    label: "Settings", 
    icon: "⚙️",
    href: "/settings",
  },
  {
    id: "sign-out",
    label: "Sign Out",
    icon: "🚪",
    action: "signOut",
  },
]; 