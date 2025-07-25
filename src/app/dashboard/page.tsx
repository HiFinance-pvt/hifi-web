"use client";

import { useEffect } from "react";
import {
  Chat,
  SessionMessage,
  SessionMessages,
  ChatTheme,
} from "reachat";

// Custom components and hooks
import { useChat } from "@/hooks/useChat";
import { Sidebar } from "@/components/Sidebar";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { hiFiTheme } from "@/theme/hifi-theme";
import { ALL_SESSIONS } from "@/constants/mockData";
import { QuickAction } from "@/types/chat";
import { ChatInput } from "@/components/dashboard";
import Particles from "@/ui/components/Particles";

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
