"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

export default function AgentsLayout({ children }: Props) {
  const router = useRouter();
  const {
    user,
    activeSessionId,
    selectSession,
    deleteSession,
    createNewSession,
    toggleSessionStar,
  } = useChat();

  const handleSelectSession = (sessionId: string) => {
    router.push(`/dashboard/${sessionId}`);
    selectSession(sessionId);
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-[var(--background)] overflow-hidden">
      {/* Sidebar - Shared across all agent pages */}
      <div className="relative z-10 w-full lg:w-auto lg:flex-shrink-0">
        <Sidebar
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onDeleteSession={deleteSession}
          onNewSession={createNewSession}
          onToggleStar={toggleSessionStar}
        />
      </div>

      {/* Main Content - Each agent page */}
      <div className="flex-1 relative overflow-hidden z-10 min-h-0 min-w-0">
        {children}
      </div>
    </div>
  );
}
