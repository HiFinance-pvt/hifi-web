"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

import Particles from "@/ui/components/Particles";
import TextType from "@/ui/TextAnimations/TextType/TextType";
import { useChat } from "@/hooks/useChat";
import { ALL_SESSIONS } from "@/constants/mockData";
import { useTaxTraderStore, TaxRegime } from "@/stores/taxTraderStore";
import TaxPreferencesModal from "@/components/TaxPreferencesModal";
import {
  Globe,
  Bell,
  MessageCircle,
  Send,
  Command,
  CornerDownLeft,
  Paperclip,
  Mic,
  TrendingUp,
  LineChart,
  BarChart,
  Wifi,
  X,
  CandlestickChart,
  PieChart,
  AlertTriangle,
} from "lucide-react";

// Trader Agent specific questions for TextType
const TRADER_QUESTIONS = [
  "How can I help with your trading decisions?",
  "Want to analyze market trends?",
  "Need help with portfolio management?",
  "Looking for stock recommendations?",
  "Want to understand technical indicators?",
  "Need help with risk management?",
  "Want to track market sentiment?",
  "Looking for options trading guidance?",
];

// Trader Agent specific suggestions
const TRADER_SUGGESTIONS = [
  "Analyze market trends for tech stocks",
  "Calculate my portfolio risk metrics",
  "Explain RSI and MACD indicators",
  "Best options trading strategies",
  "How to diversify my portfolio?",
  "Track market sentiment analysis",
  "Set up price movement alerts",
];

// Enhanced Connection Status Popup Component
const ConnectionPopup: React.FC<{
  isVisible: boolean;
  isConnected: boolean;
  onClose: () => void;
}> = ({ isVisible, isConnected, onClose }) => {
  const [animationStage, setAnimationStage] = useState<
    "initial" | "transition" | "final"
  >("initial");

  useEffect(() => {
    if (isVisible) {
      // Animation sequence
      const stages = [
        { stage: "initial", delay: 0 },
        { stage: "transition", delay: 300 },
        { stage: "final", delay: 800 },
      ];

      stages.forEach(({ stage, delay }) => {
        setTimeout(() => {
          setAnimationStage(stage as any);
        }, delay);
      });

      // Auto close after showing the full animation
      const timer = setTimeout(() => {
        onClose();
      }, 3500);

      return () => clearTimeout(timer);
    } else {
      setAnimationStage("initial");
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const getWifiIconProps = () => {
    if (isConnected) {
      // Connection sequence: grey → green → green with glow
      switch (animationStage) {
        case "initial":
          return {
            color: "text-gray-400",
            bgColor: "bg-gray-500/20",
            glowing: false,
          };
        case "transition":
          return {
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/20",
            glowing: false,
          };
        case "final":
          return {
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/20",
            glowing: true,
          };
        default:
          return {
            color: "text-gray-400",
            bgColor: "bg-gray-500/20",
            glowing: false,
          };
      }
    } else {
      // Disconnection sequence: green → grey
      switch (animationStage) {
        case "initial":
          return {
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/20",
            glowing: false,
          };
        case "transition":
        case "final":
          return {
            color: "text-gray-400",
            bgColor: "bg-gray-500/20",
            glowing: false,
          };
        default:
          return {
            color: "text-gray-400",
            bgColor: "bg-gray-500/20",
            glowing: false,
          };
      }
    }
  };

  const { color, bgColor, glowing } = getWifiIconProps();

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-gray-900/95 border border-gray-700/50 rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-sm w-full backdrop-blur-md shadow-2xl transform transition-all duration-500 ease-out scale-100">
        <div className="text-center">
          {/* Enhanced Animation Icon */}
          <div className="mb-4 sm:mb-6 relative">
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ease-out ${bgColor}`}
            >
              <Wifi
                className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-500 ease-out ${color} ${
                  glowing ? "drop-shadow-lg filter" : ""
                }`}
                style={
                  glowing
                    ? {
                        filter:
                          "drop-shadow(0 0 8px rgb(52 211 153 / 0.6)) drop-shadow(0 0 16px rgb(52 211 153 / 0.4))",
                      }
                    : {}
                }
              />

              {/* Dynamic glow effects */}
              {glowing && (
                <>
                  <div className="absolute inset-0 bg-emerald-400/30 rounded-full animate-ping" />
                  <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-pulse" />
                </>
              )}
            </div>
          </div>

          {/* Enhanced Status Text with smooth transitions */}
          <div className="transition-all duration-300 ease-out">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 transition-all duration-300">
              Fi-Account {isConnected ? "Connected" : "Disconnected"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 transition-all duration-300">
              {isConnected
                ? "Your financial data is now syncing securely."
                : "Your Fi account has been safely disconnected."}
            </p>
          </div>

          {/* Enhanced Close Button */}
          <button
            onClick={onClose}
            className="px-4 py-1.5 sm:px-6 sm:py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-lg text-gray-300 text-xs sm:text-sm transition-all duration-300 hover:scale-105 transform"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Suggestion Button Component
const SuggestionButton: React.FC<{
  suggestion: string;
  onClick: () => void;
}> = ({ suggestion, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-[rgba(30,31,34,0.6)] hover:bg-[rgba(30,31,34,0.8)] text-white text-sm rounded-lg border border-gray-600/30 hover:border-[#C54F51]/50 backdrop-blur-sm transition-all duration-300 ease-out transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-[#C54F51]/20"
    >
      {suggestion}
    </button>
  );
};

// Chat Input Component
const ChatInput: React.FC<{
  message: string;
  setMessage: (value: string) => void;
  onSend: () => void;
}> = ({ message, setMessage, onSend }) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center bg-gray-800/60 rounded-xl border border-gray-600/50 focus-within:border-[#C54F51]/60 focus-within:shadow-lg focus-within:shadow-[#C54F51]/20 transition-all duration-500 ease-out backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-[1.01]">
        {/* Filter/Agent Button */}
        <div className="p-3">
          <div className="w-8 h-8 bg-gray-700/50 rounded-lg flex items-center justify-center hover:bg-gray-600/60 transition-all duration-300 ease-out transform hover:scale-105">
            <svg
              className="w-4 h-4 text-gray-400 hover:text-gray-300 transition-colors duration-300 ease-out"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z" />
            </svg>
          </div>
        </div>

        {/* Input Field */}
        <div className="flex-1 px-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask questions, or type '@' to call Agent."
            className="w-full bg-transparent text-gray-300 placeholder-gray-500 focus:outline-none text-sm focus:placeholder-gray-400 transition-all duration-300 ease-out"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-1 px-3">
          <button className="p-2 text-gray-400 hover:text-gray-200 transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 rounded-lg hover:bg-gray-700/30">
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Voice Button */}
          <button className="p-2 text-[#C54F51] hover:text-[#C54F51]/80 transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 rounded-lg hover:bg-[#C54F51]/10">
            <Mic className="w-4 h-4" />
          </button>

          {/* Send Button - Prominent */}
          <button
            onClick={onSend}
            className="ml-2 p-2.5 bg-[#C54F51] hover:bg-[#C54F51]/90 text-white rounded-lg transition-all duration-300 ease-out transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg hover:shadow-[#C54F51]/30"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function TraderAgentPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);



  // Add smooth animations CSS
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes slideInFade {
        0% {
          opacity: 0;
          transform: translateY(-10px) scale(0.95);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes popupSlideIn {
        0% {
          opacity: 0;
          transform: translateY(-20px) scale(0.9);
        }
        50% {
          opacity: 0.7;
          transform: translateY(-5px) scale(1.02);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      .smooth-entry {
        animation: slideInFade 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      }
      
      .popup-animation {
        animation: popupSlideIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Add auto-rotate functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuestionIndex((prev) => (prev + 1) % TRADER_QUESTIONS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // Use the same chat hook as other pages
  const {
    sessions,
    activeSession,
    activeSessionId,
    isLoading,
    user,
    sessionsByCategory,
    createNewSession,
    selectSession,
    deleteSession,
    sendMessage,
    stopMessage,
    handleFileUpload,
    updateSessionTitle,
    toggleSessionStar,
  } = useChat();

  // Tax Trader store
  const {
    preferences,
    hasPreferences,
    taxData,
    isLoading: isTaxLoading,
    error: taxError,
    setPreferences,
    analyzeTax,
    hasCompleteData,
    clearPreferences,
  } = useTaxTraderStore();

  // Debug modal state
  useEffect(() => {
    console.log("🔄 Modal state changed:", showPreferencesModal);
  }, [showPreferencesModal]);

  // Debug preferences state
  useEffect(() => {
    console.log("🔄 Preferences state:", { hasPreferences, preferences });
  }, [hasPreferences, preferences]);

  // Initialize with sample data on first load
  useEffect(() => {
    if (sessions.length === 0) {
      ALL_SESSIONS.forEach((session) => {
        createNewSession(session.title, session.category);
      });
    }
  }, [sessions.length, createNewSession]);

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  const handleSendMessage = () => {
    console.log("🚀 handleSendMessage called", {
      message: message.trim(),
      hasPreferences,
      preferences,
    });

    if (message.trim()) {
      // Check if we have preferences set first
      if (!hasPreferences) {
        console.log("🔄 No preferences found, showing modal");
        setShowPreferencesModal(true);
        return;
      }

      // Redirect to dashboard with agent query parameter only
      const searchParams = new URLSearchParams({
        agent: "trader-agent",
      });

      console.log(
        "➡️ Redirecting to dashboard:",
        `/dashboard?${searchParams.toString()}`
      );
      router.push(`/dashboard?${searchParams.toString()}`);
    }
  };

  const handlePreferencesSubmit = async (prefs: {
    totalSalary: number;
    otherIncomeSources: number;
    regime: TaxRegime;
    employeeTAN?: string;
  }) => {
    console.log("💾 handlePreferencesSubmit called", prefs);

    try {
      // Set preferences with timestamp
      const preferencesWithTimestamp = {
        ...prefs,
        lastUpdated: new Date().toISOString(),
      };

      console.log("💾 Setting preferences:", preferencesWithTimestamp);
      setPreferences(preferencesWithTimestamp);

      // Close modal
      console.log("❌ Closing modal");
      setShowPreferencesModal(false);

      // Start tax analysis
      console.log("🔍 Starting tax analysis");
      await analyzeTax();

      // Redirect to dashboard for tax analysis
      const searchParams = new URLSearchParams({
        agent: "trader-agent",
      });

      console.log(
        "➡️ Redirecting to dashboard after preferences:",
        `/dashboard?${searchParams.toString()}`
      );
      router.push(`/dashboard?${searchParams.toString()}`);
    } catch (error) {
      console.error("❌ Error setting preferences:", error);
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full bg-transparent overflow-hidden smooth-entry"
      style={{ pointerEvents: "auto" }}
    >
      {/* Particles Background - Full Screen */}
      <div className="fixed inset-0 w-screen h-screen z-0 blur-sm opacity-70">
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={false}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden z-10 min-h-0 min-w-0">
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col">
          {/* Trading Features Tooltips */}
          <div
            className="w-full px-8 pt-24 pb-8 smooth-entry"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div
                  className="space-y-2 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-[#FF6B00]/50 transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-[#FF6B00]/20 popup-animation"
                  style={{ animationDelay: "0.2s" }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[#C54F51]/10 border border-[#C54F51]/30 flex items-center justify-center">
                      <CandlestickChart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#C54F51]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-[#C54F51]">
                      Market Analysis
                    </h3>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Real-time market analysis with technical indicators and
                    trend predictions.
                  </p>
                </div>

                <div
                  className="space-y-2 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-green-400/50 transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-green-400/20 popup-animation"
                  style={{ animationDelay: "0.3s" }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-green-500/10 border border-green-500/30 flex items-center justify-center">
                      <PieChart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-green-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-green-400">
                      Portfolio Insights
                    </h3>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Advanced portfolio analytics and risk management strategies.
                  </p>
                </div>

                <div
                  className="space-y-2 bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-orange-400/50 transition-all duration-500 ease-out transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl hover:shadow-orange-400/20 popup-animation sm:col-span-2 lg:col-span-1"
                  style={{ animationDelay: "0.4s" }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                      <AlertTriangle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-orange-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-orange-400">
                      Risk Alerts
                    </h3>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    Smart alerts for market volatility and trading
                    opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Welcome Section */}
          <div className="flex-1 flex flex-col items-center justify-center px-8 smooth-entry">
            {/* Trader Agent Logo */}
            <div
              className="mb-8 smooth-entry"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-[#C54F51]/20 rounded-full flex items-center justify-center border-2 border-[#C54F51]/30 backdrop-blur-sm shadow-lg hover:shadow-xl hover:shadow-[#C54F51]/20 transition-all duration-500 transform hover:scale-105">
                <img
                  src="https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4Iz0m2F9yNHVDGZLkIBX1i8F6AeEQxgp2rb30l"
                  alt="Trader Agent Logo"
                  className="w-12 h-12 md:w-14 md:h-14 object-contain"
                />
              </div>
            </div>

            {/* Welcome Title */}
            <div className="text-center mb-8">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 transition-all duration-1000 ease-out transform hover:scale-105">
                Welcome to <span className="text-[#C54F51]">Trader Agent</span>!
              </h1>

              {/* Animated Subtitle using TextType */}
              <div className="text-2xl md:text-3xl mb-8">
                <TextType
                  key={currentQuestionIndex}
                  text={TRADER_QUESTIONS[currentQuestionIndex]}
                  className="text-gray-400 transition-colors duration-1000 ease-out"
                  typingSpeed={50}
                  showCursor={true}
                  cursorCharacter="|"
                  cursorClassName="text-[#C54F51] animate-pulse"
                  cursorBlinkDuration={0.8}
                  loop={false}
                  variableSpeed={{ min: 30, max: 80 }}
                />
              </div>
            </div>

            {/* Central Search Bar */}
            <div
              className="w-full max-w-4xl mb-8 smooth-entry"
              style={{ animationDelay: "0.3s" }}
            >
              <ChatInput
                message={message}
                setMessage={setMessage}
                onSend={handleSendMessage}
              />
            </div>

            {/* Debug info */}
            <div className="mb-4 text-center">
              <p className="text-gray-400 text-sm mb-2">
                Debug: hasPreferences = {hasPreferences.toString()}
              </p>
              <button
                onClick={() => setShowPreferencesModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg mr-2"
              >
                Test Modal
              </button>
              <button
                onClick={() => {
                  clearPreferences();
                  console.log("🧹 Preferences cleared");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Clear Preferences
              </button>
            </div>

            {/* Suggestion Buttons */}
            <div
              className="w-full max-w-6xl smooth-entry"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="flex flex-wrap justify-center gap-3">
                {TRADER_SUGGESTIONS.slice(0, 7).map((suggestion, index) => (
                  <SuggestionButton
                    key={index}
                    suggestion={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Preferences Modal */}
      <TaxPreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
        onSubmit={handlePreferencesSubmit}
        isLoading={isTaxLoading}
      />
    </div>
  );
}
