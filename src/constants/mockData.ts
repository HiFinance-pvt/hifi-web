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
    icon: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IFohZsLPWtz9SeL3INaoxjGB5JZbvQuOHPXgf",
    href: "/agents",
  },
  {
    id: "settings",
    label: "Settings",
    icon: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4ItCty7d6XDQwygSuC1qrPxWn8NUJRZ7TtmMdi",
    action: "settings",
  },
  {
    id: "sign-out",
    label: "Sign Out", 
    icon: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4ID2P0tm5vZs9k6EfaoRH3eWIVygtlS5XNujYA",
    href: "/signOut",
  },
  
]; 

// Agents data for the hub
export const AGENTS = [
  {
    id: "sebi-agent",
    name: "SEBI Agent",
    description: "Your compliance watchdog. SEBI Agent ensures all your trades and financial decisions follow regulations. It flags risky moves, guides you through filings, and keeps your investments safe from shady waters.",
    icon: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IyMOKb3qEQBdAb4x5v3j0GpDKhnCOtNw1I9YP",
    color: "#BD8E17",
    href: "/agents/sebi-agent",
    features: ["Trade Compliance", "Risk Flagging", "Regulatory Filings"],
    status: "active"
  },
  {
    id: "tax-mitra",
    name: "Tax-Mitra Agent",
    description: "Your friendly tax sidekick. Tax-Mitra breaks down complex tax laws into human language. From ITR filing to deduction tracking—it helps you save smart, avoid fines, and stay stress-free every tax season.",
    icon: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IQEFryYscne53xFvDGlPXoSykp4miL9sfCBHM",
    color: "#99B720", 
    href: "/agents/tax-mitra",
    features: ["ITR Filing", "Deduction Tracking", "Tax Optimization"],
    status: "active"
  },
  {
    id: "debt-squasher",
    name: "Debt-Squasher Agent", 
    description: "Brutal on debt, soft on you. Debt-Squasher attacks your loans with ruthless efficiency—optimizing repayments, finding loopholes, and keeping EMI traps at bay. Think of it as your personal debt terminator.",
    icon: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4ITHTdQk1d0QJBp7Ci3hOcWArv9MnmeIS6xaby",
    color: "#109CA3",
    href: "/agents/debt-squasher",
    features: ["Repayment Optimization", "EMI Management", "Debt Strategy"],
    status: "active"
  },
  {
    id: "trader-agent",
    name: "Trader Agent",
    description: "Built for the bold. Trader Agent gives you real-time signals, market heatmaps, and intuitive charts. Whether you're scalping or swing trading, it's your AI-powered trading pitbull—always ready to hustle.",
    icon: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4Iz0m2F9yNHVDGZLkIBX1i8F6AeEQxgp2rb30l",
    color: "#C54F51",
    href: "/agents/trader-agent", 
    features: ["Real-time Signals", "Market Heatmaps", "Trading Charts"],
    status: "active"
  }
]; 