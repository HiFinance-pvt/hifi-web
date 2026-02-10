"use client";
import React, { useEffect } from "react";
import { useSessionStore } from "@/stores/sessionStore";
import { useRouter } from "next/navigation";

// Individual Chat Item Component
export const ChatItem = ({
  title,
  sessionId,
  onClick,
}: {
  title: string;
  sessionId: string;
  onClick: () => void;
}) => (
  <div
    className="p-3 text-sm text-gray-300 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors group"
    onClick={onClick}
  >
    <div className="truncate">{title}</div>
  </div>
);

// Recent Chats Component
const RecentChats = () => {
  const router = useRouter();
  const { sessions, isLoading, fetchSessions } = useSessionStore();

  useEffect(() => {
    if (!Array.isArray(sessions) || sessions.length === 0) {
      fetchSessions(true, true);
    }
  }, [fetchSessions, sessions]);

  const handleChatClick = (sessionId: string) => {
    router.push(`/dashboard/${sessionId}`);
  };

  return (
    <div className="flex-1 px-4 overflow-hidden">
      <div className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
        Recent
      </div>
      <div className="space-y-1 overflow-y-auto">
        {isLoading ? (
          <div className="text-sm text-gray-500 p-3">Loading chats...</div>
        ) : sessions.length === 0 ? (
          <div className="text-sm text-gray-500 p-3">No recent chats</div>
        ) : (
          sessions.map((session) => (
            <ChatItem
              key={session.id}
              sessionId={session.id}
              title={session.session_name || "Untitled Chat"}
              onClick={() => handleChatClick(session.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentChats;
