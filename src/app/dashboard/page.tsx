"use client";

import { useEffect, useRef } from "react";
import { Chat, SessionMessage, SessionMessages, ChatTheme } from "reachat";

// Custom components and hooks
import { useChat } from "@/hooks/useChat";
import { Sidebar } from "@/components/Sidebar";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { hiFiTheme } from "@/theme/hifi-theme";
import { ALL_SESSIONS } from "@/constants/mockData";
import { QuickAction } from "@/types/chat";
import { ChatInput } from "@/components/dashboard";
import Particles from "@/ui/components/Particles";
import { Globe, Bell, Wifi } from "lucide-react";
import { useState } from "react";

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
  const [tooltipClicked, setTooltipClicked] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const languages = [
    { code: "EN", name: "English" },
    { code: "HI", name: "हिंदी" },
    { code: "BN", name: "বাংলা" },
    { code: "TE", name: "తెలుగు" },
    { code: "MR", name: "मराठी" },
    { code: "TA", name: "தமிழ்" },
    { code: "UR", name: "اردو" },
    { code: "GU", name: "ગુજરાતી" },
    { code: "ML", name: "മലയാളം" },
    { code: "KN", name: "ಕನ್ನಡ" },
    { code: "OR", name: "ଓଡ଼ିଆ" },
    { code: "PA", name: "ਪੰਜਾਬੀ" },
    { code: "AS", name: "অসমীয়া" },
    { code: "MAI", name: "मैथिली" },
    { code: "SA", name: "संस्कृत" },
    { code: "NE", name: "नेपाली" },
    { code: "KOK", name: "कोंकणी" },
    { code: "MNI", name: "মৈতৈলোন্" },
    { code: "BRX", name: "बर'" },
    { code: "DOI", name: "डोगरी" },
    { code: "KS", name: "کٲشُر" },
    { code: "SAT", name: "ᱥᱟᱱᱛᱟᱲᱤ" },
    { code: "SD", name: "سنڌي" },
  ];

  const handleFiToggle = () => {
    setFiConnected(!fiConnected);
    setShowFiTooltip(false);
    setTooltipClicked(false);
    setShowConnectionPopup(true);
  };

  const handleFiIconClick = () => {
    if (tooltipClicked) {
      setShowFiTooltip(false);
      setTooltipClicked(false);
    } else {
      setShowFiTooltip(true);
      setTooltipClicked(true);
    }
  };

  const handleTooltipMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setShowFiTooltip(true);
  };

  const handleTooltipMouseLeave = () => {
    if (!tooltipClicked) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowFiTooltip(false);
      }, 200); // 200ms delay before hiding
    }
  };

  const handleIconMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    if (!tooltipClicked) {
      setShowFiTooltip(true);
    }
  };

  const handleIconMouseLeave = () => {
    if (!tooltipClicked) {
      hoverTimeoutRef.current = setTimeout(() => {
        setShowFiTooltip(false);
      }, 200); // 200ms delay before hiding
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Close tooltip when clicking outside (only when clicked open)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipClicked && showFiTooltip) {
        const target = event.target as Node;
        const tooltipElement = document.querySelector("[data-fi-tooltip]");
        const iconElement = document.querySelector("[data-fi-icon]");

        if (
          tooltipElement &&
          iconElement &&
          !tooltipElement.contains(target) &&
          !iconElement.contains(target)
        ) {
          setShowFiTooltip(false);
          setTooltipClicked(false);
        }
      }
    };

    if (tooltipClicked) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [tooltipClicked, showFiTooltip]);

  return (
    <>
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex items-center space-x-2 sm:space-x-3">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-gray-900/80 border border-gray-700/50 rounded-lg backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-200"
          >
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
            <span className="text-xs sm:text-sm text-gray-300">{language}</span>
          </button>

          {showLangDropdown && (
            <div className="absolute top-full mt-2 right-0 w-48 max-h-64 overflow-y-auto bg-gray-900/95 border border-gray-700/50 rounded-lg backdrop-blur-sm shadow-xl scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full px-3 py-2.5 text-left text-sm hover:bg-gray-800/50 transition-colors border-b border-gray-700/30 last:border-b-0 ${
                    language === lang.code
                      ? "text-emerald-400 bg-emerald-500/10"
                      : "text-gray-300"
                  } ${lang.code === languages[0].code ? "rounded-t-lg" : ""} ${
                    lang.code === languages[languages.length - 1].code
                      ? "rounded-b-lg"
                      : ""
                  }`}
                >
                  <span className="block truncate">{lang.name}</span>
                  <span className="text-xs text-gray-500 block">
                    {lang.code}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fi Toggle - Circular Design */}
        <div
          className="relative"
          onMouseEnter={handleIconMouseEnter}
          onMouseLeave={handleIconMouseLeave}
          data-fi-icon
        >
          <button
            onClick={handleFiIconClick}
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 backdrop-blur-sm transition-all duration-200 flex items-center justify-center ${
              fiConnected
                ? `bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30 ${
                    tooltipClicked
                      ? "ring-2 ring-emerald-400/50 shadow-lg shadow-emerald-500/25"
                      : ""
                  }`
                : `bg-red-500/20 border-red-500/50 hover:bg-red-500/30 ${
                    tooltipClicked
                      ? "ring-2 ring-red-400/50 shadow-lg shadow-red-500/25"
                      : ""
                  }`
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
              className="absolute top-full mt-3 right-0 w-72 bg-gray-900/98 border border-gray-600/50 rounded-xl backdrop-blur-md shadow-2xl z-60 overflow-hidden"
              onMouseEnter={handleTooltipMouseEnter}
              onMouseLeave={handleTooltipMouseLeave}
              data-fi-tooltip
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-gray-600/30">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      fiConnected ? "bg-emerald-400" : "bg-red-400"
                    } animate-pulse shadow-lg`}
                  />
                  <span className="text-sm font-semibold text-white">
                    Fi Account Status
                  </span>
                  {tooltipClicked && (
                    <span className="text-xs text-gray-400 ml-2">• Pinned</span>
                  )}
                </div>
              </div>

              {/* Content */}
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
        <button className="relative p-1.5 sm:p-2 bg-gray-900/80 border border-gray-700/50 rounded-lg backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-200">
          <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full flex items-center justify-center">
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

export default function HiFiDashboard() {
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
      // Load sample sessions
      ALL_SESSIONS.forEach((session) => {
        createNewSession(session.title, session.category);
      });
    }
  }, [sessions.length, createNewSession]);

  const handleQuickAction = (action: QuickAction) => {
    sendMessage(action.text);
  };

  const handleSendMessage = (message: string) => {
    sendMessage(message);
  };

  const handleNewSession = () => {
    createNewSession();
  };

  const handleActiveSession = (sessionId: string) => {
    selectSession(sessionId);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Header Controls */}
      <HeaderControls />

      {/* Custom Sidebar */}
      <div className="z-10 bg-none">
        <Sidebar
          user={user}
          starredSessions={sessionsByCategory.starred}
          chatSessions={sessionsByCategory.chats}
          activeSessionId={activeSessionId}
          onSelectSession={selectSession}
          onDeleteSession={deleteSession}
          onNewSession={handleNewSession}
          onToggleStar={toggleSessionStar}
          onRenameSession={updateSessionTitle}
        />
      </div>
      {/* Main Chat Area - Always wrapped in Chat component for theme context */}
      <Chat
        sessions={sessions.map((session) => ({
          id: session.id,
          title: session.title,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          conversations: session.conversations.map((conv) => ({
            id: conv.id,
            question: conv.question,
            response: conv.response || "",
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
            files: conv.files,
            sources: conv.sources,
          })),
        }))}
        activeSessionId={activeSessionId || undefined}
        viewType="companion"
        theme={hiFiTheme as unknown as ChatTheme}
        isLoading={isLoading}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        onNewSession={handleNewSession}
        onSendMessage={handleSendMessage}
        onStopMessage={stopMessage}
        onFileUpload={handleFileUpload}
        className="flex-1 z-10 flex flex-col"
      >
        {/* {!activeSession ? ( */}
        {/* Welcome Screen when no session is active */}
        <div className="flex-1 h-screen relative">
          <WelcomeScreen onQuickAction={handleQuickAction} />

          {/* Chat Input at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                {/* Main input container */}
                <div className="relative z-10 bg-gray-800/95 backdrop-blur-md border border-gray-600 rounded-2xl shadow-2xl hover:border-teal-400/60 hover:shadow-teal-500/10 transition-all duration-300">
                  <ChatInput
                    message={""}
                    setMessage={(e) => {
                      handleSendMessage(e);
                    }}
                  />
                </div>

                {/* Subtle bottom glow */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
        {/* ) : ( */}
        {/* <SessionMessagePanel allowBack={false}>
            <SessionMessagesHeader />
            <SessionMessages
              newSessionContent={
                <WelcomeScreen onQuickAction={handleQuickAction} />
              }
            >
              {(conversations) =>
                conversations.map((conversation, index) => (
                  <SessionMessage
                    key={conversation.id}
                    conversation={conversation}
                    isLast={index === conversations.length - 1}
                  />
                ))
              }
            </SessionMessages>
            <div className="p-6 bg-gradient-to-t from-gray-900/50 to-transparent">
              <div className="max-w-4xl mx-auto">
                <div className="relative group">

                  <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>

                  <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl hover:border-teal-500/50 transition-all duration-300">
                    <ChatInput
                      message={""}
                      setMessage={() => {}}
                    />
                  </div>
                </div>
              </div>
            </div>
          </SessionMessagePanel>
           */}
        {/* )} */}
      </Chat>
      <div className="absolute inset-0 w-screen h-screen">
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
    </div>
  );
}
