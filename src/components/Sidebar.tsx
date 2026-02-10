"use client";

import React, { useState, useEffect, useMemo } from "react";
import { ChatSession } from "@/types/chat";
import { NAVIGATION_ITEMS } from "@/constants/mockData";
import { useSessionStore } from "@/stores/sessionStore";
import { useDeleteSessionMutation } from "@/hooks/adk";
// Minimal SVG Icons
const PlusIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M12 5v14m-7-7h14" />
  </svg>
);

const SearchIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
);

const ChatIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const SettingsIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const LogOutIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
  </svg>
);

const StarIcon = ({
  className = "w-4 h-4",
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) => (
  <svg
    className={className}
    fill={filled ? "currentColor" : "none"}
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

const PanelLeftIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
  </svg>
);

const EditIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const TrashIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14z" />
  </svg>
);

const LoaderIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={`${className} animate-spin`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <circle cx="12" cy="12" r="10" strokeOpacity={0.25} />
    <path d="M12 2a10 10 0 019.5 7" strokeOpacity={1} />
  </svg>
);

const BotIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <rect x="4" y="4" width="16" height="16" rx="4" />
    <circle cx="9" cy="11" r="1.5" />
    <circle cx="15" cy="11" r="1.5" />
    <path d="M9 15h6" />
  </svg>
);
import { logout } from "@/lib/firebase/firebase";
import { env } from "@/lib/env";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/firebase/firebase";
import Image from "next/image";

interface SidebarProps {
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
  onToggleStar?: (sessionId: string) => void;
  onRenameSession?: (sessionId: string, newTitle: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
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
  const user = getCurrentUser();

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

  // Delete session mutation
  const deleteSessionMutation = useDeleteSessionMutation();

  // Initialize sessions on mount with error handling
  useEffect(() => {
    const initializeSessions = async () => {
      try {
        // Fetch sessions only if we don't have any, or if they're stale
        // This prevents unnecessary refetches when switching between sessions
        await fetchSessions(false, false); // Don't show loading, use cache if available
      } catch (err) {
        console.error("Error initializing sessions:", err);
      }
    };

    initializeSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Transform API sessions to ChatSession format with proper error handling
  const transformedSessions: ChatSession[] = useMemo(() => {
    // Ensure sessions is an array and handle various data structures
    if (!Array.isArray(sessions)) {
      console.warn("Sessions is not an array:", sessions);
      return [];
    }

    const parseDate = (value: any): Date => {
      if (!value) return new Date();

      // If it's already a Date object, return it
      if (value instanceof Date) return value;

      // If it's a number (timestamp), convert it
      if (typeof value === "number") {
        // Check if it's in seconds (Unix timestamp) or milliseconds
        // Timestamps before year 2001 in milliseconds would be < 1000000000000
        // If the number is less than that, it's likely in seconds
        const timestamp = value < 10000000000 ? value * 1000 : value;
        return new Date(timestamp);
      }

      // If it's a string, try to parse it
      if (typeof value === "string") {
        const parsed = new Date(value);
        // Check if the date is valid
        if (!isNaN(parsed.getTime())) {
          return parsed;
        }
      }

      // Fallback to current date if parsing failed
      console.warn("Failed to parse date:", value);
      return new Date();
    };

    return sessions
      .filter(
        (session: any) => session && typeof session === "object" && session.id
      )
      .map((session: any) => {
        try {
          const timestamp =
            session.lastUpdateTime || session.updatedAt || session.createdAt;
          const parsedDate = parseDate(timestamp);

          return {
            id: session.id,
            title:
              session.session_name ||
              session.appName ||
              session.title ||
              `Session ${session.id.slice(0, 8)}`,
            category: "chats" as const,
            createdAt: parsedDate,
            updatedAt: parsedDate,
            conversations: [],
          };
        } catch (err) {
          console.warn("Error transforming session:", session, err);
          return null;
        }
      })
      .filter(Boolean) as ChatSession[];
  }, [sessions]);

  // Filter sessions based on search
  const filteredStarredSessions = transformedSessions.filter(
    (session) => session.category === "starred" && session.id
  );

  const filteredChatSessions = transformedSessions
    .filter((session) => session.category === "chats" && session.id)
    .sort((a, b) => {
      // Sort by updatedAt in descending order (newest first)
      return b.updatedAt.getTime() - a.updatedAt.getTime();
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

    // Use custom minimal icons
    const iconMap: {
      [key: string]: React.ComponentType<{ className?: string }>;
    } = {
      Bot: BotIcon,
      Settings: SettingsIcon,
      LogOut: LogOutIcon,
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
      // Call the API to delete the session
      await deleteSessionMutation.mutateAsync(sessionId);

      // Remove from local state
      removeSession(sessionId);

      // Call parent handler to update UI state
      onDeleteSession(sessionId);
    } catch (error) {
      console.error("Failed to delete session:", error);
      // You might want to show a toast notification or error message here
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
        // Update in API/store using session_name instead of appName
        await updateSession(sessionId, { session_name: editingTitle.trim() });
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
    const isDeleting =
      deleteSessionMutation.isPending &&
      deleteSessionMutation.variables === session.id;

    return (
      <div
        onClick={() => !isEditing && handleSessionClick(session.id)}
        className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-400 ease-out transform hover:scale-[1.02] ${
          activeSessionId === session.id
            ? "bg-teal-500/20 border border-[var(--brand-primary)]/50 shadow-lg shadow-teal-500/10"
            : "hover:bg-[var(--surface-hover)] border border-transparent hover:border-[var(--surface-border)]"
        } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
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
              className="w-full bg-[var(--surface)] border border-[var(--brand-primary)] rounded px-2 py-1 text-sm text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary-muted)] transition-all duration-300 ease-out"
              autoFocus
            />
          ) : (
            <p
              className={`text-sm truncate transition-colors duration-300 ease-out ${
                activeSessionId === session.id
                  ? "text-teal-300"
                  : "text-[var(--foreground)]"
              }`}
            >
              {session.title}
            </p>
          )}
        </div>
        <div className="flex items-center ml-2 relative">
          {/* Time - visible by default, hidden on hover */}
          <span className="text-xs text-[var(--foreground-subtle)] group-hover:opacity-0 transition-opacity duration-400 ease-out">
            {formatDate(session.updatedAt)}
          </span>

          {/* Action buttons - hidden by default, visible on hover */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-400 ease-out absolute right-0">
            <button
              onClick={(e) => handleToggleStar(session.id, e)}
              className="p-1 rounded hover:bg-yellow-500/20 transition-all duration-300 ease-out transform hover:scale-110"
              title={isStarred ? "Unstar chat" : "Star chat"}
              disabled={isDeleting}
            >
              <StarIcon
                className={`w-3 h-3 transition-all duration-300 ease-out ${
                  isStarred
                    ? "text-[var(--accent-gold)] fill-yellow-400 scale-110"
                    : "text-[var(--foreground-muted)] hover:text-[var(--accent-gold)] hover:scale-110"
                }`}
              />
            </button>
            <button
              onClick={(e) => handleStartRename(session.id, session.title, e)}
              className="p-1 rounded hover:bg-[var(--info-bg)] transition-all duration-300 ease-out transform hover:scale-110"
              title="Rename chat"
              disabled={isDeleting}
            >
              <EditIcon className="w-3 h-3 text-[var(--foreground-muted)] hover:text-[var(--info)] transition-all duration-300 ease-out" />
            </button>
            <button
              onClick={(e) => handleDeleteSession(session.id, e)}
              className="p-1 rounded hover:bg-red-500/20 transition-all duration-300 ease-out transform hover:scale-110"
              title="Delete chat"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <LoaderIcon className="w-3 h-3 text-[var(--foreground-muted)]" />
              ) : (
                <svg
                  className="w-3 h-3 text-[var(--foreground-muted)] hover:text-[var(--error)] transition-all duration-300 ease-out"
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
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center space-x-2 text-[var(--foreground-muted)]">
        <LoaderIcon className="w-4 h-4" />
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
      <div className="flex flex-col h-full border-r border-[var(--surface-border)] bg-[var(--background)] backdrop-blur-sm transition-all duration-500 ease-in-out w-16">
        {/* Collapsed Header with Toggle */}
        <div className="p-3 border-b border-[var(--surface-border)] flex items-center justify-center">
          <button
            onClick={() => setIsCollapsed(false)}
            className="p-2 rounded-lg transition-all duration-400 ease-out transform hover:scale-125 hover:rotate-12 active:scale-95"
            style={{ backgroundColor: "#00C2AB" }}
            title="Expand sidebar"
          >
            <PanelLeftIcon className="w-4 h-4 text-[var(--foreground)] transition-transform duration-300 ease-out" />
          </button>
        </div>

        {/* Collapsed Actions */}
        <div className="flex flex-col items-center space-y-3 p-3 animate-in slide-in-from-left-2 duration-500 ease-out">
          {/* Search Button */}
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-lg flex items-center justify-center transition-all duration-400 ease-out transform hover:scale-110 hover:shadow-lg hover:shadow-[var(--surface-border)]"
            title="Search"
          >
            <SearchIcon className="w-4 h-4 text-[var(--foreground-muted)] hover:text-[var(--brand-primary)] transition-all duration-300 ease-out" />
          </button>

          {/* Chats Button */}
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-10 h-10 bg-[var(--surface)] hover:bg-[var(--surface-hover)] rounded-lg flex items-center justify-center transition-all duration-400 ease-out transform hover:scale-110 hover:shadow-lg hover:shadow-[var(--surface-border)]"
            title="View Chats"
          >
            <ChatIcon className="w-4 h-4 text-[var(--foreground-muted)] hover:text-[var(--brand-primary)] transition-all duration-300 ease-out" />
          </button>

          {/* New Chat Button */}
          <button
            onClick={handleNewSession}
            className="w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center justify-center transition-all duration-400 ease-out transform hover:scale-110 hover:shadow-lg hover:shadow-[var(--brand-primary)]/40"
            title="New Chat"
            disabled={isLoading}
          >
            {isLoading ? (
              <LoaderIcon className="w-4 h-4 text-[var(--foreground)]" />
            ) : (
              <PlusIcon className="w-4 h-4 text-[var(--foreground)] transition-transform duration-300 ease-out hover:rotate-90" />
            )}
          </button>
        </div>

        {/* Collapsed User Profile Section */}
        {user && (
          <div className="mt-auto border-t border-[var(--surface-border)] p-3 animate-in slide-in-from-left-2 duration-500 ease-out">
            {/* User Avatar */}
            <div className="flex justify-center mb-3">
              <div className="relative group">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-[var(--brand-primary)] to-[#0ea5e9] flex items-center justify-center hover:scale-125 transition-all duration-400 ease-out hover:shadow-lg hover:shadow-[var(--brand-primary)]/40">
                  <span className="text-[var(--foreground)] font-medium text-xs transition-all overflow-hidden rounded-full duration-300 ease-out">
                    <Image
                      src={user.photoURL || ""}
                      alt="User Avatar"
                      width={40}
                      height={40}
                      className="rounded-full w-full h-full overflow-hidden object-cover"
                    />
                  </span>
                </div>
                {user.emailVerified && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-teal-500 rounded-full flex items-center justify-center transition-all duration-400 ease-out group-hover:scale-150">
                    <svg
                      className="w-2 h-2 text-[var(--foreground)]"
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
                  className="w-10 h-10 flex items-center justify-center rounded-lg text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all duration-400 ease-out transform hover:scale-110 hover:shadow-lg hover:shadow-[var(--surface-border)]"
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
    <div className="flex flex-col h-full border-r border-[var(--surface-border)] bg-[var(--background)] backdrop-blur-sm transition-all duration-500 ease-in-out w-80">
      {/* Header with Logo and Toggle */}
      <div className="p-4 border-b border-[var(--surface-border)] flex items-center justify-between">
        <h1 className="text-xl font-bold text-[var(--foreground)] animate-in slide-in-from-left-2 duration-500 ease-out">
          Hi-Fi
        </h1>
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-2 rounded-lg transition-all duration-400 ease-out transform hover:scale-125 hover:rotate-12 active:scale-95"
          style={{ backgroundColor: "#00C2AB" }}
          title="Collapse sidebar"
        >
          <PanelLeftIcon className="w-4 h-4 text-[var(--foreground)] transition-transform duration-300 ease-out" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 animate-in slide-in-from-left-2 duration-500 ease-out">
        <div className="relative flex items-center gap-2 group">
          <SearchIcon className="w-4 h-4 text-[var(--foreground-muted)] absolute left-3 top-1/2 transform -translate-y-1/2 duration-300 ease-out group-focus-within:text-[var(--brand-primary)] z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search sessions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-[var(--surface-border)] rounded-lg text-[var(--foreground)] placeholder-[var(--foreground-subtle)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-2 focus:ring-[var(--brand-primary-muted)] transition-all duration-400 ease-out backdrop-blur-sm relative z-0"
          />
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewSession}
          disabled={isLoading}
          className="w-full mt-3 flex items-center justify-center space-x-2 p-2 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-600/50 disabled:cursor-not-allowed rounded-lg text-[var(--foreground)] transition-all duration-300 ease-out hover:scale-105 disabled:hover:scale-100"
        >
          {isLoading ? (
            <LoaderIcon className="w-4 h-4 text-[var(--foreground)]" />
          ) : (
            <PlusIcon className="w-4 h-4 text-[var(--foreground)]" />
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
        {(isLoading || !Array.isArray(sessions)) &&
          transformedSessions.length === 0 && <LoadingState />}

        {/* Starred Sessions */}
        {!isLoading && !error && filteredStarredSessions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3 transition-colors duration-300 ease-out hover:text-[var(--foreground-secondary)]">
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
            <h3 className="text-xs font-medium text-[var(--foreground-muted)] uppercase tracking-wider mb-3 transition-colors duration-300 ease-out hover:text-[var(--foreground-secondary)]">
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
        {(isLoading || !Array.isArray(sessions)) && (
          <div className="text-center py-8">
            <LoaderIcon className="w-6 h-6 text-[var(--foreground-muted)] mx-auto mb-2" />
            <p className="text-[var(--foreground-subtle)] text-sm">
              Loading sessions...
            </p>
            {!Array.isArray(sessions) && sessions && (
              <p className="text-yellow-500 text-xs mt-1">
                Invalid session data format detected
              </p>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm">{error}</p>
            <button
              onClick={() => fetchSessions()}
              className="mt-2 text-xs bg-red-500/20 hover:bg-red-500/30 px-2 py-1 rounded transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        )}

        {/* No sessions found */}
        {!isLoading &&
          !error &&
          Array.isArray(sessions) &&
          filteredStarredSessions.length === 0 &&
          filteredChatSessions.length === 0 &&
          transformedSessions.length > 0 && (
            <div className="text-center py-8 animate-in fade-in duration-600 ease-out">
              <p className="text-[var(--foreground-subtle)] text-sm">
                No sessions match your search
              </p>
            </div>
          )}

        {/* Empty state */}
        {!isLoading &&
          !error &&
          Array.isArray(sessions) &&
          transformedSessions.length === 0 && (
            <div className="text-center py-8 animate-in fade-in duration-600 ease-out">
              <div className="flex flex-col items-center space-y-3">
                <ChatIcon className="w-12 h-12 text-[var(--foreground-subtle)]" />
                <div>
                  <p className="text-[var(--foreground-muted)] text-sm font-medium">
                    No chat sessions yet
                  </p>
                  <p className="text-[var(--foreground-subtle)] text-xs mt-1">
                    Start a new conversation to get started
                  </p>
                </div>
                <button
                  onClick={handleNewSession}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-[var(--foreground)] text-sm transition-colors duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating..." : "Start First Chat"}
                </button>
              </div>
            </div>
          )}
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="border-t border-[var(--surface-border)] p-4 animate-in slide-in-from-bottom-5 duration-600 ease-out">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-[var(--brand-primary)] to-[#0ea5e9] flex items-center justify-center hover:scale-125 transition-all duration-400 ease-out hover:shadow-lg hover:shadow-[var(--brand-primary)]/40">
                <span className="text-[var(--foreground)] font-medium text-sm transition-all duration-300 ease-out">
                  <Image
                    src={user.photoURL || ""}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className="rounded-full w-full h-full overflow-hidden object-cover"
                  />
                </span>
              </div>
              {user.emailVerified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center transition-all duration-400 ease-out group-hover:scale-150">
                  <svg
                    className="w-2.5 h-2.5 text-[var(--foreground)]"
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
              <p className="text-[var(--foreground)] font-medium text-sm transition-colors duration-300 ease-out">
                {user.displayName}
              </p>
              {/* {user.role && (
                <p className="text-teal-400 text-xs transition-colors duration-300 ease-out">
                  {user.role}
                </p> */}
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
                className="w-full flex items-center space-x-3 p-2 rounded-lg text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-hover)] transition-all duration-400 ease-out text-sm transform hover:scale-[1.02] hover:shadow-md"
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
