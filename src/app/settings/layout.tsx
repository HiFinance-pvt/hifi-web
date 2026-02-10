"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { useChat } from "@/hooks/useChat";
import { useRouter } from "next/navigation";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {
    activeSessionId,
    selectSession,
    deleteSession,
    createNewSession,
    toggleSessionStar,
  } = useChat();

  const handleSelectSession = (sessionId: string) => {
    router.push(`/dashboard/${sessionId}`);
    selectSession(sessionId);
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen w-screen bg-[var(--background)] overflow-hidden">
      {/* Sidebar - Shared across all pages for consistency */}
      <div className="relative z-10 w-full lg:w-auto lg:flex-shrink-0">
        <Sidebar
          activeSessionId={activeSessionId}
          onSelectSession={handleSelectSession}
          onDeleteSession={deleteSession}
          onNewSession={createNewSession}
          onToggleStar={toggleSessionStar}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-y-auto z-10 min-h-0 min-w-0 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            {children}
        </div>
      </div>
    </div>
  );
}
