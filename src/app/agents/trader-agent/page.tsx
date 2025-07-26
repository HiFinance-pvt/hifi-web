"use client";

import React, { useState, useRef, useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";
import Particles from "@/ui/components/Particles";
import TextType from "@/ui/TextAnimations/TextType/TextType";
import { useChat } from "@/hooks/useChat";
import { ALL_SESSIONS } from "@/constants/mockData";
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

// Header Controls Component
const HeaderControls: React.FC = () => {
  const [language, setLanguage] = useState("EN");
  const [fiConnected, setFiConnected] = useState(true);
  const [showFiTooltip, setShowFiTooltip] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  const languages = [
    { code: "EN", name: "English" },
    { code: "HI", name: "हिंदी" },
    { code: "GU", name: "ગુજરાતી" },
    { code: "MR", name: "मराठी" },
  ];

  const handleFiToggle = () => {
    setFiConnected(!fiConnected);
    setShowFiTooltip(false);
    setShowConnectionPopup(true);
  };

  return (
    <>
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex items-center space-x-2 sm:space-x-3">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-900/80 border border-gray-700/50 rounded-full backdrop-blur-sm hover:bg-gray-800/90 transition-all duration-300 ease-out w-12 h-12 justify-center transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
          >
            <Globe className="w-4 h-4 text-gray-300 hover:text-white transition-colors duration-300 ease-out" />
          </button>

          {showLangDropdown && (
            <div className="absolute top-full mt-2 right-0 w-36 bg-gray-900/95 border border-gray-700/50 rounded-lg backdrop-blur-sm shadow-xl popup-animation">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-800/70 transition-all duration-200 ease-out transform hover:scale-105 hover:translate-x-1 ${
                    language === lang.code
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-gray-300"
                  } ${lang.code === languages[0].code ? "rounded-t-lg" : ""} ${
                    lang.code === languages[languages.length - 1].code
                      ? "rounded-b-lg"
                      : ""
                  }`}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fi Toggle */}
        <div
          className="relative"
          onMouseEnter={() => setShowFiTooltip(true)}
          onMouseLeave={() => {
            // Small delay to allow moving to tooltip
            setTimeout(() => setShowFiTooltip(false), 150);
          }}
        >
          <button
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 backdrop-blur-sm transition-all duration-200 flex items-center justify-center ${
              fiConnected
                ? "bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30"
                : "bg-red-500/20 border-red-500/50 hover:bg-red-500/30"
            }`}
          >
            {/* Outer glow ring */}
            <div
              className={`absolute inset-0 rounded-full animate-pulse ${
                fiConnected ? "bg-emerald-400/20" : "bg-red-400/20"
              }`}
            />

            {/* Fi icon in center */}
            <div className="relative z-10 flex items-center justify-center">
              <img
                src={
                  fiConnected
                    ? "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IehfPx9KyJ8jNPpV24cHROwYQuxMUoLIv9n6S"
                    : "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IVSvVCH71tHP9Q3GfOo7m650V8qacgeNAFTyE"
                }
                alt={fiConnected ? "Fi Connected" : "Fi Disconnected"}
                className="w-3 h-3 sm:w-4 sm:h-4 object-contain relative z-10 drop-shadow-md"
                style={{
                  filter: "brightness(1.2) contrast(1.1)",
                  maxWidth: "16px",
                  maxHeight: "16px",
                }}
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.createElement("span");
                  fallback.textContent = "Fi";
                  fallback.className = `text-sm font-bold ${
                    fiConnected ? "text-emerald-400" : "text-red-400"
                  }`;
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>

            {/* Status dot at bottom border */}
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full border border-gray-900 ${
                fiConnected ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
          </button>

          {showFiTooltip && (
            <div
              className="absolute top-full mt-3 right-0 w-72 bg-gray-900/98 border border-gray-600/50 rounded-xl backdrop-blur-md shadow-2xl z-60 overflow-hidden popup-animation"
              onMouseEnter={() => setShowFiTooltip(true)}
              onMouseLeave={() => setShowFiTooltip(false)}
            >
              <div className="px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-gray-600/30 relative">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      fiConnected ? "bg-emerald-400" : "bg-red-400"
                    } animate-pulse shadow-lg`}
                  />
                  <span className="text-sm font-semibold text-white">
                    Fi Account Status
                  </span>
                </div>
                <button
                  onClick={() => setShowFiTooltip(false)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-white transition-colors rounded"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      fiConnected
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {fiConnected ? "Connected" : "Disconnected"}
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  {fiConnected
                    ? "Your Fi account is connected and syncing financial data securely. All features are available."
                    : "Connect your Fi account to sync financial data and unlock all premium features."}
                </p>

                <button
                  onClick={handleFiToggle}
                  className={`w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg border ${
                    fiConnected
                      ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50"
                  }`}
                >
                  {fiConnected ? "Disconnect Account" : "Connect Account"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative w-12 h-12 bg-gray-900/80 border border-gray-700/50 rounded-full backdrop-blur-sm hover:bg-gray-800/90 transition-all duration-300 ease-out flex items-center justify-center transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
          <Bell className="w-4 h-4 text-gray-300 hover:text-white transition-colors duration-300 ease-out" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
            <span className="text-xs text-white font-medium">3</span>
          </div>
        </button>
      </div>

      {/* Connection Status Popup */}
      <ConnectionPopup
        isVisible={showConnectionPopup}
        isConnected={fiConnected}
        onClose={() => setShowConnectionPopup(false)}
      />
    </>
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col lg:flex-row h-screen w-screen bg-[#111827] overflow-hidden smooth-entry"
    >
      {/* Header Controls */}
      <HeaderControls />

      {/* Sidebar */}
      <div className="relative z-10 w-full lg:w-auto lg:flex-shrink-0">
        <Sidebar
          user={user}
          // starredSessions={sessionsByCategory.starred}
          // chatSessions={sessionsByCategory.chats}
          activeSessionId={activeSessionId}
          onSelectSession={selectSession}
          onDeleteSession={deleteSession}
          onNewSession={createNewSession}
          onToggleStar={toggleSessionStar}
        />
      </div>

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
    </div>
  );
}
