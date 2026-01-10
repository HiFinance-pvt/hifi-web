"use client";

import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

import { useChat } from "@/hooks/useChat";
import { ALL_SESSIONS, AGENTS } from "@/constants/mockData";
import {
  ArrowRight,
  Bot, Brain,
  Zap,
  Target,
  Globe,
  Bell, Wifi
} from "lucide-react";
import { env } from "@/lib/env";
import { useQueryClient } from "@tanstack/react-query";
import { useCheckSession } from "@/hooks/useCheckSession";
import { useBoolStore } from "@/stores/boolStore";

// Using real chat hook - same as dashboard

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
      <div
        ref={cardRef}
        onMouseMove={handleCardMove}
        className="group relative flex flex-col w-full h-full rounded-[16px] sm:rounded-[20px] overflow-hidden border border-[var(--surface-border)] transition-all duration-300 cursor-pointer bg-[var(--surface)]/40 backdrop-blur-sm hover:border-opacity-80"
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

          <h3 className="text-base sm:text-lg font-semibold text-[var(--foreground)] mb-2">
            {agent.name}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--foreground-secondary)] leading-relaxed line-clamp-3 sm:line-clamp-4 mb-3 sm:mb-4">
            {agent.description}
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
                className="px-2 py-1 text-xs rounded text-[var(--foreground-secondary)]"
                style={{
                  backgroundColor: hexToRgba(agent.color, 0.1),
                  borderColor: hexToRgba(agent.color, 0.2),
                  border: `1px solid ${hexToRgba(agent.color, 0.2)}`,
                }}
              >
                {feature}
              </span>
            ))}
          </div>

          {/* Arrow indicator */}
          <div className="flex items-center justify-end mt-3 sm:mt-4">
            <ArrowRight
              className={`w-3 h-3 sm:w-4 sm:h-4 text-[var(--foreground-muted)] transition-all duration-300 ${isHovered ? "translate-x-1" : ""
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
            color: "text-[var(--foreground-muted)]",
            bgColor: "bg-[var(--foreground-muted)]/20",
            glowing: false,
          };
        case "transition":
          return {
            color: "text-[var(--brand-primary)]",
            bgColor: "bg-[var(--brand-primary)]/20",
            glowing: false,
          };
        case "final":
          return {
            color: "text-[var(--brand-primary)]",
            bgColor: "bg-[var(--brand-primary)]/20",
            glowing: true,
          };
        default:
          return {
            color: "text-[var(--foreground-muted)]",
            bgColor: "bg-[var(--foreground-muted)]/20",
            glowing: false,
          };
      }
    } else {
      // Disconnection sequence: green → grey
      switch (animationStage) {
        case "initial":
          return {
            color: "text-[var(--brand-primary)]",
            bgColor: "bg-[var(--brand-primary)]/20",
            glowing: false,
          };
        case "transition":
        case "final":
          return {
            color: "text-[var(--foreground-muted)]",
            bgColor: "bg-[var(--foreground-muted)]/20",
            glowing: false,
          };
        default:
          return {
            color: "text-[var(--foreground-muted)]",
            bgColor: "bg-[var(--foreground-muted)]/20",
            glowing: false,
          };
      }
    }
  };

  const { color, bgColor, glowing } = getWifiIconProps();

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl sm:rounded-2xl p-6 sm:p-8 max-w-sm w-full backdrop-blur-md shadow-2xl transform transition-all duration-500 ease-out scale-100">
        <div className="text-center">
          {/* Enhanced Animation Icon */}
          <div className="mb-4 sm:mb-6 relative">
            <div
              className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-full flex items-center justify-center transition-all duration-500 ease-out ${bgColor}`}
            >
              <Wifi
                className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-500 ease-out ${color} ${glowing ? "drop-shadow-lg filter" : ""
                  }`}
                style={
                  glowing
                    ? {
                      filter:
                        "drop-shadow(0 0 8px rgb(4 166 106 / 0.6)) drop-shadow(0 0 16px rgb(4 166 106 / 0.4))",
                    }
                    : {}
                }
              />

              {/* Dynamic glow effects */}
              {glowing && (
                <>
                  <div className="absolute inset-0 bg-[var(--brand-primary)]/30 rounded-full animate-ping" />
                  <div className="absolute inset-0 bg-[var(--brand-primary)]/20 rounded-full animate-pulse" />
                </>
              )}
            </div>
          </div>

          {/* Enhanced Status Text with smooth transitions */}
          <div className="transition-all duration-300 ease-out">
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-2 transition-all duration-300">
              Fi-Account {isConnected ? "Connected" : "Disconnected"}
            </h3>
            <p className="text-xs sm:text-sm text-[var(--foreground-muted)] mb-4 sm:mb-6 transition-all duration-300">
              {isConnected
                ? "Your financial data is now syncing securely."
                : "Your Fi account has been safely disconnected."}
            </p>
          </div>

          {/* Enhanced Close Button */}
          <button
            onClick={onClose}
            className="px-4 py-1.5 sm:px-6 sm:py-2 bg-[var(--surface-hover)] hover:bg-[var(--surface-active)] border border-[var(--surface-border)] rounded-lg text-[var(--foreground-secondary)] text-xs sm:text-sm transition-all duration-300 hover:scale-105 transform"
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
  const [showFiTooltip, setShowFiTooltip] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const queryClient = useQueryClient();
  // const router = useRouter();

  const { data } = useCheckSession(sessionId);

  const { setFiConnection, fiConnection } = useBoolStore();

  useEffect(() => {
    setFiConnection(data?.valid || false);
  }, [data?.valid]);

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

  return (
    <>
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex items-center space-x-2 sm:space-x-3">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangDropdown(!showLangDropdown)}
            className="flex items-center space-x-1 px-2 py-1.5 sm:px-3 sm:py-2 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg backdrop-blur-sm hover:bg-[var(--surface-hover)] transition-all duration-200"
          >
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--foreground-secondary)]" />
            <span className="text-xs sm:text-sm text-[var(--foreground-secondary)]">{language}</span>
          </button>

          {showLangDropdown && (
            <div className="absolute top-full mt-2 right-0 w-36 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg backdrop-blur-sm shadow-xl">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setShowLangDropdown(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-sm hover:bg-[var(--surface-hover)] transition-colors ${language === lang.code
                    ? "text-[var(--brand-primary)]"
                    : "text-[var(--foreground-secondary)]"
                    } ${lang.code === languages[0].code ? "rounded-t-lg" : ""} ${lang.code === languages[languages.length - 1].code
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

        {/* Fi Toggle - Circular Design */}
        <div
          className="relative"
          onMouseEnter={() => setShowFiTooltip(true)}
          onMouseLeave={() => setShowFiTooltip(false)}
        >
          <button
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 backdrop-blur-sm transition-all duration-200 flex items-center justify-center ${fiConnection
              ? "bg-[var(--brand-primary)]/20 border-[var(--brand-primary)]/50 hover:bg-[var(--brand-primary)]/30"
              : "bg-[var(--error)]/20 border-[var(--error)]/50 hover:bg-[var(--error)]/30"
              }`}
          >
            {/* Outer glow ring */}
            <div
              className={`absolute inset-0 rounded-full animate-pulse ${fiConnection ? "bg-[var(--brand-primary)]/20" : "bg-[var(--error)]/20"
                }`}
            />

            {/* Fi icon in center */}
            <div className="relative z-10 flex items-center justify-center">
              <img
                src={
                  fiConnection
                    ? "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IehfPx9KyJ8jNPpV24cHROwYQuxMUoLIv9n6S"
                    : "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IVSvVCH71tHP9Q3GfOo7m650V8qacgeNAFTyE"
                }
                alt={fiConnection ? "Fi Connected" : "Fi DisconfiConnected"}
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
                  fallback.className = `text-sm font-bold ${fiConnection ? "text-[var(--brand-primary)]" : "text-[var(--error)]"
                    }`;
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>

            {/* Status dot at bottom border */}
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full border border-[var(--background)] ${fiConnection ? "bg-[var(--brand-primary)]" : "bg-[var(--error)]"
                }`}
            />
          </button>

          {showFiTooltip && (
            <div
              className="absolute top-full mt-3 right-0 w-72 bg-[var(--surface)] border border-[var(--surface-border)] rounded-xl backdrop-blur-md shadow-2xl z-60 overflow-hidden"
              onMouseEnter={() => setShowFiTooltip(true)}
              onMouseLeave={() => setShowFiTooltip(false)}
            >
              {/* Header */}
              <div className="px-4 py-3 bg-[var(--surface-hover)] border-b border-[var(--surface-border)]">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${fiConnection ? "bg-[var(--brand-primary)]" : "bg-[var(--error)]"
                      } animate-pulse shadow-lg`}
                  />
                  <span className="text-sm font-semibold text-[var(--foreground)]">
                    Fi Account Status
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="mb-4">
                  <div
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${fiConnection
                      ? "bg-[var(--brand-primary)]/20 text-[var(--brand-primary)] border border-[var(--brand-primary)]/30"
                      : "bg-[var(--error)]/20 text-[var(--error)] border border-[var(--error)]/30"
                      }`}
                  >
                    {fiConnection ? "Connected" : "Disconnected"}
                  </div>
                </div>

                <p className="text-xs text-[var(--foreground-secondary)] leading-relaxed mb-4">
                  {fiConnection
                    ? "Your Fi account is connected and syncing financial data securely. All features are available."
                    : "Connect your Fi account to sync financial data and unlock all premium features."}
                </p>

                <button
                  onClick={handleFiToggle}
                  className={`w-full px-4 py-2.5 text-sm font-medium transition-all duration-200 rounded-lg border ${fiConnection
                    ? "bg-[var(--error)]/10 border-[var(--error)]/30 text-[var(--error)] hover:bg-[var(--error)]/20 hover:border-[var(--error)]/50"
                    : "bg-[var(--brand-primary)]/10 border-[var(--brand-primary)]/30 text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/20 hover:border-[var(--brand-primary)]/50"
                    }`}
                >
                  {fiConnection ? "Disconnect Account" : "Connect Account"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative p-1.5 sm:p-2 bg-[var(--surface)] border border-[var(--surface-border)] rounded-lg backdrop-blur-sm hover:bg-[var(--surface-hover)] transition-all duration-200">
          <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--foreground-secondary)]" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[var(--error)] rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium">3</span>
          </div>
        </button>
      </div>

      {/* Connection Status Popup */}
      <ConnectionPopup
        isVisible={showConnectionPopup}
        isConnected={fiConnection || false}
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
      className="flex flex-col h-full w-full bg-transparent overflow-hidden agents-page-container"
      style={{ pointerEvents: "auto" }}
    >
      {/* Content */}
      <div className="flex-1 relative overflow-hidden z-10 min-h-0 min-w-0">
        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-[var(--brand-primary)]/30 border-t-[var(--brand-primary)] rounded-full animate-spin"></div>
              <p className="text-sm text-[var(--foreground-secondary)]">Loading agents...</p>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="agents-section relative z-10 h-full overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full">
            {/* Header Section */}
            <div className="mb-6 lg:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 mb-4">
                <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-[var(--brand-primary)]" />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--foreground)]">
                  Agents Hub
                </h1>
              </div>
              <p className="text-base sm:text-lg lg:text-xl text-[var(--foreground-secondary)] max-w-2xl">
                Discover our specialized AI agents designed to help you with
                various aspects of financial planning and management.
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
            <div className="mt-8 lg:mt-16 p-4 sm:p-6 lg:p-8 rounded-xl lg:rounded-2xl bg-[var(--surface)]/40 border border-[var(--surface-border)] max-w-4xl w-full backdrop-blur-sm">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-[var(--foreground)] mb-3 sm:mb-4">
                Why Choose Our AI Agents?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[var(--accent-gold)]/10 border border-[var(--accent-gold)]/20 flex items-center justify-center">
                      <Brain className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--accent-gold)]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-[var(--accent-gold)]">
                      Expert Knowledge
                    </h3>
                  </div>
                  <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm">
                    Each agent is trained on domain-specific expertise to
                    provide accurate and relevant guidance.
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[var(--info)]/10 border border-[var(--info)]/20 flex items-center justify-center">
                      <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--info)]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-[var(--info)]">
                      Real-time Insights
                    </h3>
                  </div>
                  <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm">
                    Get up-to-date market data and regulatory information for
                    informed decision making.
                  </p>
                </div>
                <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-md bg-[var(--error)]/10 border border-[var(--error)]/20 flex items-center justify-center">
                      <Target className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[var(--error)]" />
                    </div>
                    <h3 className="text-base sm:text-lg font-medium text-[var(--error)]">
                      Personalized Advice
                    </h3>
                  </div>
                  <p className="text-[var(--foreground-secondary)] text-xs sm:text-sm">
                    Receive customized recommendations based on your financial
                    goals and risk profile.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
