"use client";

import React, { useState, useEffect } from "react";
import { User, ChatSession } from "@/types/chat";
import { NAVIGATION_ITEMS } from "@/constants/mockData";
import { useSessionStore } from "@/stores/sessionStore";
import {
  Plus,
  Search,
  Bot,
  Settings,
  LogOut,
  Star,
  PanelLeftOpen,
  PanelLeftClose,
  MessageSquare,
  Edit2,
  Loader2,
} from "lucide-react";
import { logout } from "@/lib/firebase/firebase";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";

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
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Use sessionStore from main branch for real API calls
  const {
    sessions,
    isLoading,
    error,
    updateSession,
    fetchSessions,
    createSession,
    removeSession,
  } = useSessionStore();

  // Initialize sessions on mount
  useEffect(() => {
    const initializeSessions = async () => {
      // Fetch sessions if we don't have any
      if (sessions.length === 0) {
        await fetchSessions();
      }
    };

    initializeSessions();
  }, [fetchSessions, sessions.length]);

  // Transform API sessions to ChatSession format
  const transformedSessions: ChatSession[] = sessions.map((session: any) => ({
    id: session.id,
    title: session.appName || `Session ${session.id.slice(0, 8)}`,
    category: "chats" as const, // Default to chats, you can add starring logic later
    createdAt: new Date(session.lastUpdateTime),
    updatedAt: new Date(session.lastUpdateTime),
    conversations: [], // You can transform events to conversations if needed
  }));

  // Filter sessions based on search
  const filteredStarredSessions = transformedSessions.filter(
    (session) =>
      session.category === "starred" &&
      session.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChatSessions = transformedSessions.filter(
    (session) =>
      session.category === "chats" &&
      session.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    try {
      await removeSession(sessionId);
      onDeleteSession(sessionId);
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
  };

  const handleToggleStar = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // For now, just call the parent handler since starring logic needs to be implemented
    onToggleStar?.(sessionId);
  };

  const handleStartRename = (
    sessionId: string,
    currentTitle: string,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    setEditingSessionId(sessionId);
    setEditingTitle(currentTitle);
  };

  const handleSaveRename = async (sessionId: string) => {
    if (onRenameSession && editingTitle.trim()) {
      try {
        // Update in API/store - you might need to modify the updateSession to handle appName
        await updateSession(sessionId, { appName: editingTitle.trim() });
        onRenameSession(sessionId, editingTitle.trim());
      } catch (error) {
        console.error("Failed to rename session:", error);
      }
    }
    setEditingSessionId(null);
    setEditingTitle("");
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
    setEditingTitle("");
  };

  const handleNewSession = async () => {
    try {
      const newSession = await createSession();
      if (newSession) {
        onSelectSession(newSession.id);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      // Fallback to the parent's new session handler
      onNewSession();
    }
  };

  const SessionItem: React.FC<{ session: ChatSession; isStarred: boolean }> = ({
    session,
    isStarred,
  }) => {
    const isEditing = editingSessionId === session.id;

    return (
      <div
        onClick={() => !isEditing && handleSessionClick(session.id)}
        className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-400 ease-out transform hover:scale-[1.02] ${
          activeSessionId === session.id
            ? "bg-teal-500/20 border border-teal-500/50 shadow-lg shadow-teal-500/10"
            : "hover:bg-gray-700/30 border border-transparent hover:border-gray-600/30"
        }`}
      >
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={() => handleSaveRename(session.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveRename(session.id);
                if (e.key === "Escape") handleCancelRename();
              }}
              className="w-full bg-gray-800 border border-teal-500 rounded px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all duration-300 ease-out"
              autoFocus
            />
          ) : (
            <p
              className={`text-sm truncate transition-colors duration-300 ease-out ${
                activeSessionId === session.id
                  ? "text-teal-300"
                  : "text-gray-200"
              }`}
            >
              {session.title}
            </p>
          )}
        </div>
        <div className="flex items-center ml-2 relative">
          {/* Time - visible by default, hidden on hover */}
          <span className="text-xs text-gray-500 group-hover:opacity-0 transition-opacity duration-400 ease-out">
            {formatDate(session.updatedAt)}
          </span>

          {/* Action buttons - hidden by default, visible on hover */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out absolute right-0">
            <button
              onClick={(e) => handleToggleStar(session.id, e)}
              className="p-1 rounded hover:bg-yellow-500/20 transition-all duration-300 ease-out transform hover:scale-110"
              title={isStarred ? "Unstar chat" : "Star chat"}
            >
              <Star
                className={`w-3 h-3 transition-all duration-300 ease-out ${
                  isStarred
                    ? "text-yellow-400 fill-yellow-400 scale-110"
                    : "text-gray-400 hover:text-yellow-400 hover:scale-110"
                }`}
              />
            </button>
            <button
              onClick={(e) => handleStartRename(session.id, session.title, e)}
              className="p-1 rounded hover:bg-blue-500/20 transition-all duration-300 ease-out transform hover:scale-110"
              title="Rename chat"
            >
              <Edit2 className="w-3 h-3 text-gray-400 hover:text-blue-400 transition-all duration-300 ease-out" />
            </button>
            <button
              onClick={(e) => handleDeleteSession(session.id, e)}
              className="p-1 rounded hover:bg-red-500/20 transition-all duration-300 ease-out transform hover:scale-110"
              title="Delete chat"
            >
              <svg
                className="w-3 h-3 text-gray-400 hover:text-red-400 transition-all duration-300 ease-out"
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
      </div>
    );
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center space-x-2 text-gray-400">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Loading sessions...</span>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="px-4 py-4">
      <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
        <div className="flex items-center space-x-2 text-red-400 mb-2">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <span className="text-sm font-medium">Error loading sessions</span>
        </div>
        <p className="text-xs text-red-300 mb-3">{error}</p>
        <button
          onClick={() => fetchSessions()}
          className="text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded transition-colors duration-200"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (isCollapsed) {
    return (
      <div className="flex flex-col h-full border-r border-gray-700/15 bg-gray-900/20 backdrop-blur-sm transition-all duration-500 ease-in-out w-16">
        {/* Collapsed Header with Toggle */}
        <div className="p-3 border-b border-gray-700/20 flex items-center justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg transition-all duration-400 ease-out transform hover:scale-125 hover:rotate-12 active:scale-95"
            style={{ backgroundColor: "#00C2AB" }}
            title="Expand sidebar"
          >
            <PanelLeftOpen className="w-4 h-4 text-white transition-transform duration-300 ease-out" />
          </button>
        </div>

        {/* Collapsed Actions */}
        <div className="flex flex-col items-center space-y-3 p-3 animate-in slide-in-from-left-2 duration-500 ease-out">
          {/* Search Button */}
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/20 rounded-lg flex items-center justify-center transition-all duration-400 ease-out transform hover:scale-110 hover:shadow-lg hover:shadow-gray-700/30"
            title="Search"
          >
            <Search className="w-4 h-4 text-gray-400 hover:text-teal-400 transition-all duration-300 ease-out" />
          </button>

          {/* Chats Button */}
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 bg-gray-800/50 hover:bg-gray-700/20 rounded-lg flex items-center justify-center transition-all duration-400 ease-out transform hover:scale-110 hover:shadow-lg hover:shadow-gray-700/30"
            title="View Chats"
          >
            <MessageSquare className="w-4 h-4 text-gray-400 hover:text-teal-400 transition-all duration-300 ease-out" />
          </button>

          {/* New Chat Button */}
          <button
            onClick={handleNewSession}
            className="w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center justify-center transition-all duration-400 ease-out transform hover:scale-110 hover:shadow-lg hover:shadow-teal-500/40"
            title="New Chat"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Plus className="w-4 h-4 text-white transition-transform duration-300 ease-out hover:rotate-90" />
            )}
          </button>
        </div>

        {/* Collapsed User Profile Section */}
        {user && (
          <div className="mt-auto border-t border-gray-700/20 p-3 animate-in slide-in-from-left-2 duration-500 ease-out">
            {/* User Avatar */}
            <div className="flex justify-center mb-3">
              <div className="relative group">
                <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center hover:scale-125 transition-all duration-400 ease-out hover:shadow-lg hover:shadow-teal-500/40">
                  <span className="text-white font-medium text-xs transition-all duration-300 ease-out">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                {user.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500 rounded-full flex items-center justify-center transition-all duration-400 ease-out group-hover:scale-150">
                    <svg
                      className="w-2 h-2 text-white"
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
            </div>

            {/* Navigation Icons */}
            <div className="space-y-2">
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
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/20 transition-all duration-400 ease-out transform hover:scale-110 hover:shadow-lg hover:shadow-gray-700/30"
                  title={item.label}
                  style={{
                    transitionDelay: `${index * 50}ms`,
                  }}
                >
                  <div className="transition-transform duration-300 ease-out hover:scale-110">
                    {getIcon(item.icon)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

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
      <div className="flex-1 overflow-y-auto px-4 pb-4 animate-in slide-in-from-left-2 duration-500 ease-out">
        {/* Error State */}
        {error && <ErrorState />}

        {/* Loading State */}
        {isLoading && transformedSessions.length === 0 && <LoadingState />}

        {/* Starred Sessions */}
        {!isLoading && !error && filteredStarredSessions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3 transition-colors duration-300 ease-out hover:text-gray-300">
              Starred
            </h3>
            <div className="space-y-1">
              {filteredStarredSessions.map((session, index) => (
                <div
                  key={session.id}
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                  className="animate-in slide-in-from-left-5 duration-500 ease-out"
                >
                  <SessionItem session={session} isStarred={true} />
                </div>
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
              {filteredChatSessions.map((session, index) => (
                <div
                  key={session.id}
                  style={{
                    animationDelay: `${
                      (index + filteredStarredSessions.length) * 100
                    }ms`,
                  }}
                  className="animate-in slide-in-from-left-5 duration-500 ease-out"
                >
                  <SessionItem session={session} isStarred={false} />
                </div>
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
          filteredChatSessions.length === 0 &&
          transformedSessions.length > 0 && (
            <div className="text-center py-8 animate-in fade-in duration-600 ease-out">
              <p className="text-gray-500 text-sm">
                No sessions match your search
              </p>
            </div>
          )}

        {/* Empty state */}
        {!isLoading && !error && transformedSessions.length === 0 && (
          <div className="text-center py-8 animate-in fade-in duration-600 ease-out">
            <div className="flex flex-col items-center space-y-3">
              <MessageSquare className="w-12 h-12 text-gray-600" />
              <div>
                <p className="text-gray-400 text-sm font-medium">
                  No chat sessions yet
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Start a new conversation to get started
                </p>
              </div>
              <button
                onClick={handleNewSession}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white text-sm transition-colors duration-200"
              >
                Start First Chat
              </button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="border-t border-gray-700/20 p-4 animate-in slide-in-from-bottom-5 duration-600 ease-out">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center hover:scale-125 transition-all duration-400 ease-out hover:shadow-lg hover:shadow-teal-500/40">
                <span className="text-white font-medium text-sm transition-all duration-300 ease-out">
                  {user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center transition-all duration-400 ease-out group-hover:scale-150">
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
