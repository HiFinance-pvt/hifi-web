"use client";

import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import Particles from "@/ui/components/Particles";
import ChromaGrid from "@/ui/components/ChromaGrid";
import { useChat } from "@/hooks/useChat";
import { ALL_SESSIONS, AGENTS } from "@/constants/mockData";
import { LanguageSelector } from "@/components/LanguageSelector";
import { TranslatedText } from "@/components/TranslatedText";
import {
  ArrowRight,
  Bot,
  CheckCircle,
  Brain,
  Zap,
  Target,
  Globe,
  Bell,
  Power,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";
import { gsap } from "gsap";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";
import { checkMCPSession } from "@/lib/api/mcp";
import { useQueryClient } from "@tanstack/react-query";
import { useCheckSession } from "@/hooks/useCheckSession";

// Using real chat hook - same as dashboard

// Add CSS for hiding scrollbar
const addScrollbarStyle = () => {
  const style = document.createElement("style");
  style.textContent = `
    .hide-scrollbar {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
  `;
  document.head.appendChild(style);
  return () => {
    document.head.removeChild(style);
  };
};

// Agent Card Component with ChromaGrid styling
const AgentCard: React.FC<{ agent: (typeof AGENTS)[0] }> = ({ agent }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const handleCardMove: React.MouseEventHandler<HTMLElement> = (e) => {
    const c = e.currentTarget as HTMLElement;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  // Convert hex to rgba for spotlight effect
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  return (
    <Link
      href={agent.href}
      className="block w-full max-w-full xl:min-w-[320px] xl:w-[320px] h-[350px] sm:h-[380px] xl:h-[400px] agents-card-unique"
    >
    <Link
      href={agent.href}
      className="block w-full max-w-full xl:min-w-[320px] xl:w-[320px] h-[350px] sm:h-[380px] xl:h-[400px] agents-card-unique"
    >
      <div
        ref={cardRef}
        onMouseMove={handleCardMove}
        className="group relative flex flex-col w-full h-full rounded-[16px] sm:rounded-[20px] overflow-hidden border border-gray-800/50 transition-all duration-300 cursor-pointer bg-black/40 backdrop-blur-sm hover:border-opacity-80"
        style={
          {
            "--card-border": agent.color,
            "--spotlight-color": hexToRgba(agent.color, 0.15),
            "--agent-color": agent.color,
            borderColor: `${agent.color}20`,
          } as React.CSSProperties
        }
        style={
          {
            "--card-border": agent.color,
            "--spotlight-color": hexToRgba(agent.color, 0.15),
            "--agent-color": agent.color,
            borderColor: `${agent.color}20`,
          } as React.CSSProperties
        }
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Agent card spotlight effect - ONLY when hovering card */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 70%)",
          }}
        />

        {/* Icon Section */}
        <div className="relative z-10 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border flex items-center justify-center"
              style={{
                backgroundColor: hexToRgba(agent.color, 0.1),
                borderColor: hexToRgba(agent.color, 0.3),
              }}
            >
              <img
                src={agent.icon}
                alt={agent.name}
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
              />
            </div>
            <div className="flex items-center space-x-1">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: agent.color }}
              />
              <span
                className="text-xs uppercase tracking-wide"
                style={{ color: agent.color }}
              >
                {agent.status}
              </span>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-white mb-2">
            <TranslatedText>{agent.name}</TranslatedText>
          </h3>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed line-clamp-3 sm:line-clamp-4 mb-3 sm:mb-4">
            <TranslatedText>{agent.description}</TranslatedText>
          </p>
        </div>

        {/* Features Section */}
        <div className="relative z-10 mt-auto p-4 sm:p-6 pt-0">
          <h4
            className="text-xs font-medium uppercase tracking-wider mb-2 sm:mb-3"
            style={{ color: hexToRgba(agent.color, 0.8) }}
          >
            Key Features
          </h4>
          <div className="flex flex-wrap gap-1 sm:gap-1.5">
            {agent.features.map((feature, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded text-gray-300"
                style={{
                  backgroundColor: hexToRgba(agent.color, 0.1),
                  borderColor: hexToRgba(agent.color, 0.2),
                  border: `1px solid ${hexToRgba(agent.color, 0.2)}`,
                }}
              >
                <TranslatedText>{feature}</TranslatedText>
              </span>
            ))}
          </div>

          {/* Arrow indicator */}
          <div className="flex items-center justify-end mt-3 sm:mt-4">
            <ArrowRight
              className={`w-3 h-3 sm:w-4 sm:h-4 text-gray-500 transition-all duration-300 ${
                isHovered ? "translate-x-1" : ""
              }`}
              style={isHovered ? { color: agent.color } : {}}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

// Enhanced Connection Status Popup Component
const ConnectionPopup: React.FC<{
  isVisible: boolean;
  isConnected: boolean;
  onClose: () => void;
}> = ({ isVisible, isConnected, onClose }) => {
  const [animationStage, setAnimationStage] = useState<
    "initial" | "transition" | "final"
  >("initial");
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
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ease-out ${bgColor}`}
            >
              <Wifi
              <Wifi
                className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-500 ease-out ${color} ${
                  glowing ? "drop-shadow-lg filter" : ""
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
              Fi-Account {isConnected ? "Connected" : "Disconnected"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6 transition-all duration-300">
              {isConnected
                ? "Your financial data is now syncing securely."
                : "Your Fi account has been safely disconnected."}
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
  const [showFiTooltip, setShowFiTooltip] = useState(false);
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const queryClient = useQueryClient();
  // const router = useRouter();

  const { data, error, isPending } = useCheckSession(sessionId);

  const languages = [
    { code: "EN", name: "English" },
    { code: "HI", name: "हिंदी" },
    { code: "GU", name: "ગુજરાતી" },
    { code: "MR", name: "मराठी" },
  ];

  const handleFiToggle = () => {
    const sessionId = `mcp-server-${uuidv4()}`;
    setSessionId(sessionId);
    window.open(
      `${env.NEXT_PUBLIC_FI_MCP_SERVER_URL}/mockWebPage?sessionId=${sessionId}`
    );
    queryClient.invalidateQueries({ queryKey: ["check-session", sessionId] });
  };

  // Add scrollbar style
  useEffect(() => {
    return addScrollbarStyle();
  }, []);

  return (
    <>
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex items-center space-x-2 sm:space-x-3">
        {/* Language Selector */}
        <LanguageSelector />

        {/* Fi Toggle - Circular Design */}
        <div
          className="relative"
          onMouseEnter={() => setShowFiTooltip(true)}
          onMouseLeave={() => setShowFiTooltip(false)}
        >
          <button
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 backdrop-blur-sm transition-all duration-200 flex items-center justify-center ${
              data?.valid
                ? "bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30"
                : "bg-red-500/20 border-red-500/50 hover:bg-red-500/30"
            }`}
          >
            {/* Outer glow ring */}
            <div
              className={`absolute inset-0 rounded-full animate-pulse ${
                data?.valid ? "bg-emerald-400/20" : "bg-red-400/20"
              }`}
            />

            {/* Fi icon in center */}
            <div className="relative z-10 flex items-center justify-center">
              <img
                src={
                  data?.valid
                    ? "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IehfPx9KyJ8jNPpV24cHROwYQuxMUoLIv9n6S"
                    : "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IVSvVCH71tHP9Q3GfOo7m650V8qacgeNAFTyE"
                }
                alt={data?.valid ? "Fi Connected" : "Fi DisconfiConnected"}
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
                    data?.valid ? "text-emerald-400" : "text-red-400"
                  }`;
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>

            {/* Status dot at bottom border */}
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full border border-gray-900 ${
                data?.valid ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
          </button>

          {showFiTooltip && (
            <div
              className="absolute top-full mt-3 right-0 w-72 bg-gray-900/98 border border-gray-600/50 rounded-xl backdrop-blur-md shadow-2xl z-60 overflow-hidden"
              onMouseEnter={() => setShowFiTooltip(true)}
              onMouseLeave={() => setShowFiTooltip(false)}
            >
              {/* Header */}
              <div className="px-4 py-3 bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-b border-gray-600/30">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      data?.valid ? "bg-emerald-400" : "bg-red-400"
                    } animate-pulse shadow-lg`}
                  />
                  <span className="text-sm font-semibold text-white">
                    Fi Account Status
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      data?.valid
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {data?.valid ? "Connected" : "Disconnected"}
                  </div>
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mb-4">
                  {data?.valid
                    ? "Your Fi account is connected and syncing financial data securely. All features are available."
                    : "Connect your Fi account to sync financial data and unlock all premium features."}
                </p>

                <button
                  onClick={handleFiToggle}
                  className={`w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg border ${
                    data?.valid
                      ? "bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50"
                  }`}
                >
                  {data?.valid ? "Disconnect Account" : "Connect Account"}
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
        isConnected={data?.valid || false}
        onClose={() => setShowConnectionPopup(false)}
      />
    </>
  );
};

export default function AgentsHubPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the same chat hook as dashboard for synchronized data
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

  // Initialize with sample data on first load - same as dashboard
  useEffect(() => {
    if (sessions.length === 0) {
      // Load sample sessions
      ALL_SESSIONS.forEach((session) => {
        createNewSession(session.title, session.category);
      });
    }
  }, [sessions.length, createNewSession]);

  // Simplified mouse tracking for agent card gradients only
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Set CSS variables for agent card gradients
        containerRef.current.style.setProperty("--mouse-x", `${x}%`);
        containerRef.current.style.setProperty("--mouse-y", `${y}%`);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col lg:flex-row h-screen w-screen bg-[#111827] overflow-hidden agents-page-container"
    >
      {/* Header Controls */}
      <HeaderControls />

      {/* Sidebar - Same data as dashboard */}
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

      {/* Main Content Area */}
      <div
        className="flex-1 relative overflow-hidden z-10 min-h-0 min-w-0"
        style={{ pointerEvents: "auto" }}
      >
      <div
        className="flex-1 relative overflow-hidden z-10 min-h-0 min-w-0"
        style={{ pointerEvents: "auto" }}
      >
        {/* Content */}
        <div className="agents-section relative z-10 h-full overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
            {/* Header Section */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-400" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                  <TranslatedText>Agents Hub</TranslatedText>
                </h1>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-2xl">
                <TranslatedText>
                  Discover our specialized AI agents designed to help you with
                  various aspects of financial planning and management.
                </TranslatedText>
              </p>
            </div>

            {/* Agents Grid - Responsive Layout */}
            <div className="mb-8 lg:mb-16">
              {/* Mobile/Tablet: Vertical Stack */}
              <div className="block xl:hidden w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
                  {AGENTS.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              </div>


              {/* Desktop: Horizontal Scroll */}
              <div className="hidden xl:block w-full">
                <div className="overflow-x-auto pb-4 agents-scroll-container w-full">
                  <div className="flex gap-6 min-w-max pr-4">
                    {AGENTS.map((agent) => (
                      <AgentCard key={agent.id} agent={agent} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-8 lg:mt-16 p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-gradient-to-r from-gray-900/40 to-gray-800/40 border border-gray-700/50 max-w-4xl w-full backdrop-blur-sm">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-3 sm:mb-4">
                <TranslatedText>Why Choose Our AI Agents?</TranslatedText>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                      <Brain className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-yellow-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-yellow-400">
                      <TranslatedText>Expert Knowledge</TranslatedText>
                    </h3>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    <TranslatedText>
                      Each agent is trained on domain-specific expertise to
                      provide accurate and relevant guidance.
                    </TranslatedText>
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-cyan-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-cyan-400">
                      <TranslatedText>Real-time Insights</TranslatedText>
                    </h3>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    <TranslatedText>
                      Get up-to-date market data and regulatory information for
                      informed decision making.
                    </TranslatedText>
                  </p>
                </div>
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-400" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-red-400">
                      <TranslatedText>Personalized Advice</TranslatedText>
                    </h3>
                  </div>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    <TranslatedText>
                      Receive customized recommendations based on your financial
                      goals and risk profile.
                    </TranslatedText>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
