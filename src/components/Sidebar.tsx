"use client";

import React, { useState, useEffect } from "react";
import { User, ChatSession } from "@/types/chat";
import { NAVIGATION_ITEMS } from "@/constants/mockData";
import {
  Plus,
  Search,
  Bot,
  Settings,
  LogOut,
  Star,
  PanelLeftClose,
  Loader2,
} from "lucide-react";
import { logout } from "@/lib/firebase/firebase";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/sessionStore";

interface SidebarProps {
  user: User | null;
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
  onToggleStar?: (sessionId: string) => void;
  onRenameSession?: (sessionId: string, newTitle: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewSession,
  onToggleStar,
  onRenameSession,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Use sessionStore from main branch for real API calls
  const { sessions, isLoading, error, updateSession, fetchSessions } =
    useSessionStore();

  // Initialize sessions on mount
  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  // Add star tracking to session state (extend SessionData with star feature)
  const getSessionStarred = (sessionId: string) => {
    const session = sessions.find((s) => s.id === sessionId);
    return session?.state?.starred || false;
  };

  const setSessionStarred = (sessionId: string, starred: boolean) => {
    updateSession(sessionId, {
      state: { starred },
      lastUpdateTime: Date.now(),
    });
  };

  // Filter sessions with star feature support
  const filteredStarredSessions = sessions.filter((session) => {
    const isStarred = getSessionStarred(session.id);
    const searchText = (
      session.appName || `Session ${session.id}`
    ).toLowerCase();
    return isStarred && searchText.includes(searchQuery.toLowerCase());
  });

  const filteredChatSessions = sessions.filter((session) => {
    const isStarred = getSessionStarred(session.id);
    const searchText = (
      session.appName || `Session ${session.id}`
    ).toLowerCase();
    return !isStarred && searchText.includes(searchQuery.toLowerCase());
  });

  const formatDate = (date: Date | number) => {
    const dateObj = typeof date === "number" ? new Date(date) : date;
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - dateObj.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 24) {
      return "Today";
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const getIcon = (iconValue: string) => {
    // Check if it's a URL (for custom uploaded images)
    if (iconValue.startsWith("http")) {
      return (
        <img src={iconValue} alt="icon" className="h-9 w-9 object-contain" />
      );
    }

    // Fallback to lucide-react icons
    const iconMap: { [key: string]: React.ComponentType<any> } = {
      Bot: Bot,
      Settings: Settings,
      LogOut: LogOut,
    };

    const IconComponent = iconMap[iconValue];
    return IconComponent ? (
      <IconComponent className="h-4 w-4" />
    ) : (
      <span>{iconValue}</span>
    );
  };

  const handleSessionClick = (sessionId: string) => {
    onSelectSession(sessionId);
  };

  const handleDeleteSession = async (
    sessionId: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    onDeleteSession(sessionId);
  };

  const handleToggleStar = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const currentStarred = getSessionStarred(sessionId);
    setSessionStarred(sessionId, !currentStarred);
    onToggleStar?.(sessionId);
  };

  const SessionItem: React.FC<{ session: any; isStarred: boolean }> = ({
    session,
    isStarred,
  }) => (
    <div
      onClick={() => handleSessionClick(session.id)}
      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${
        activeSessionId === session.id
          ? "bg-teal-500/20 border border-teal-500/50"
          : "hover:bg-gray-700 border border-transparent"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm truncate ${
            activeSessionId === session.id ? "text-teal-300" : "text-gray-200"
          }`}
        >
          {session.appName || `Session ${session.id}`}
        </p>
      </div>
      <div className="flex items-center space-x-1 ml-2">
        <span className="text-xs text-gray-500">
          {formatDate(session.lastUpdateTime)}
        </span>
        <button
          onClick={(e) => handleToggleStar(session.id, e)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-yellow-500/20 transition-all duration-200"
          title={isStarred ? "Unstar chat" : "Star chat"}
        >
          <Star
            className={`w-3 h-3 transition-colors duration-200 ${
              isStarred
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-400 hover:text-yellow-400"
            }`}
          />
        </button>
        <button
          onClick={(e) => handleDeleteSession(session.id, e)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all duration-200"
          title="Delete chat"
        >
          <svg
            className="w-3 h-3 text-gray-400 hover:text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full border-r border-gray-700/20 bg-gray-900/15 backdrop-blur-sm transition-all duration-500 ease-in-out w-80">
      {/* Header with Logo and Toggle */}
      <div className="p-4 border-b border-gray-700/20 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white animate-in slide-in-from-left-2 duration-500 ease-out">
          Hi-Fi
        </h1>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 rounded-lg transition-all duration-400 ease-out transform hover:scale-125 hover:rotate-12 active:scale-95"
          style={{ backgroundColor: "#00C2AB" }}
          title="Collapse sidebar"
        >
          <PanelLeftClose className="w-4 h-4 text-white transition-transform duration-300 ease-out" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 animate-in slide-in-from-left-2 duration-500 ease-out">
        <div className="relative flex items-center gap-2 group">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 duration-300 ease-out group-focus-within:text-teal-400 z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-600/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/30 transition-all duration-400 ease-out backdrop-blur-sm relative z-0"
          />
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewSession}
          disabled={isLoading}
          className="w-full mt-3 flex items-center justify-center space-x-2 p-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 disabled:cursor-not-allowed rounded-lg text-white transition-all duration-300 ease-out hover:scale-105 disabled:hover:scale-100"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Plus className="w-4 h-4 text-white" />
          )}
          <span className="text-sm font-medium">
            {isLoading ? "Creating..." : "New Chat"}
          </span>
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Starred Sessions */}
        {!isLoading && !error && filteredStarredSessions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 transition-colors duration-300 ease-out hover:text-gray-300">
              Starred
            </h3>
            <div className="space-y-1">
              {filteredStarredSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isStarred={true}
                />
              ))}
            </div>
          </div>
        )}

        {/* Chat Sessions */}
        {!isLoading && !error && filteredChatSessions.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 transition-colors duration-300 ease-out hover:text-gray-300">
              Chats
            </h3>
            <div className="space-y-1">
              {filteredChatSessions.map((session) => (
                <SessionItem
                  key={session.id}
                  session={session}
                  isStarred={false}
                />
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-8">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Loading sessions...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* No sessions found */}
        {!isLoading &&
          !error &&
          filteredStarredSessions.length === 0 &&
          filteredChatSessions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm">No sessions found</p>
            </div>
          )}
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="border-t border-gray-700/20 p-4 animate-in slide-in-from-bottom-5 duration-600 ease-out">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm transition-colors duration-300 ease-out">
                {user.name}
              </p>
              {user.role && (
                <p className="text-teal-400 text-xs transition-colors duration-300 ease-out">
                  {user.role}
                </p>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            {NAVIGATION_ITEMS.map((item, index) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.label === "Sign Out") {
                    logout();
                    localStorage.removeItem(env.NEXT_PUBLIC_SSID);
                    router.push("/login");
                  }
                  if (item.label === "Settings") {
                    router.push("/settings");
                  }
                  if (item.label === "Agents Hub") {
                    router.push("/agents");
                  }
                }}
                className="w-full flex items-center space-x-3 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700/20 transition-all duration-400 ease-out text-sm transform hover:scale-[1.02] hover:shadow-md"
                style={{
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="transition-transform duration-300 ease-out hover:scale-125">
                  {getIcon(item.icon)}
                </div>
                <span className="transition-all duration-300 ease-out">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
