// Custom Hi-Fi Chat Components
export { WelcomeScreen } from "./WelcomeScreen";
export { Sidebar } from "./Sidebar";
export { AuthGuard } from "./AuthGuard";
export { LanguageSelector } from "./LanguageSelector";
export { TranslatedText } from "./TranslatedText";

// Re-export commonly used types
export type {
  User,
  ChatSession,
  ChatConversation,
  QuickAction,
} from "@/types/chat";

// Re-export hooks
export { useChat } from "@/hooks/useChat";

// Re-export theme and constants
export { hiFiTheme } from "@/theme/hifi-theme";
export { APP_CONFIG, QUICK_ACTIONS, ALL_SESSIONS } from "@/constants/mockData";
