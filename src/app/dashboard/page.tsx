"use client";

import { useEffect, useState } from "react";
import {
  Chat,
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
import { useCreateSessionMutation, useGetSessionQuery, useListSessionsQuery, useSendMessageMutation, useSessionMessagesQuery } from "@/hooks/adk";

export default function HiFiDashboard() {
  const sessionId = "1802999508192198656";
  const [currentMessage, setCurrentMessage] = useState("");
  const [adkConversations, setAdkConversations] = useState<any[]>([]);
  const [pendingUserMsg, setPendingUserMsg] = useState<string | null>(null);
  const [pendingAssistantMsg, setPendingAssistantMsg] = useState<string | null>(null);

  // ADK hooks
  const { mutate: sendAdkMessage, isPending: isAdkPending, error: adkError, data: adkResponse, reset: resetAdkMutation } = useSendMessageMutation(sessionId);
  const { messages: adkMessages, loading: adkMessagesLoading } = useSessionMessagesQuery(sessionId);
  const { data: sessionData, isLoading: isSessionLoading } = useGetSessionQuery(sessionId);

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

  // Convert ADK messages to chat conversations format (from backend)
  useEffect(() => {
    if (adkMessages.length > 0) {
      const conversations = [];
      for (let i = 0; i < adkMessages.length; i += 2) {
        const userMsg = adkMessages[i];
        const assistantMsg = adkMessages[i + 1];
        if (userMsg && userMsg.author === 'user') {
          conversations.push({
            id: `adk-${i}`,
            question: userMsg.text,
            response: assistantMsg ? assistantMsg.text : '',
            createdAt: new Date(userMsg.timestamp).toISOString(),
            updatedAt: new Date(userMsg.timestamp).toISOString(),
            files: [],
            sources: [],
          });
        }
      }
      setAdkConversations(conversations);
      setPendingUserMsg(null);
      setPendingAssistantMsg(null);
    }
  }, [adkMessages]);

  // When adkResponse arrives, show assistant response immediately
  useEffect(() => {
    if (adkResponse && pendingUserMsg) {
      // Try to extract the assistant's response text from adkResponse
      let assistantText = "";
      if (adkResponse.author !== 'user' && adkResponse.content && adkResponse.content.parts && adkResponse.content.parts.length > 0) {
        assistantText = adkResponse.content.parts.map((part: any) => part.text).join('');
      }
      setPendingAssistantMsg(assistantText);
    }
  }, [adkResponse, pendingUserMsg]);

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
    if (message.trim()) {
      // Optimistically show user message
      setPendingUserMsg(message);
      setPendingAssistantMsg(null);
      sendAdkMessage(message);
      setCurrentMessage(""); // Clear input after sending
    }
  };

  const handleNewSession = () => {
    createNewSession();
  };

  const handleActiveSession = (sessionId: string) => {
    selectSession(sessionId);
  };

  // Create a custom ADK session for the chat interface
  let displayConversations = [...adkConversations];
  if (pendingUserMsg) {
    displayConversations = [
      ...adkConversations,
      {
        id: `pending-user` + adkConversations.length,
        question: pendingUserMsg,
        response: pendingAssistantMsg || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        files: [],
        sources: [],
      },
    ];
  }

  const adkSession = {
    id: sessionId,
    title: "ADK Chat Session",
    createdAt: new Date(),
    updatedAt: new Date(),
    conversations: displayConversations,
  };

  const allSessions = [...sessions, adkSession];

  // Loading state for initial session fetch
  const isInitialLoading = isSessionLoading || adkMessagesLoading;

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
        sessions={allSessions.map((session) => ({
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
        activeSessionId={sessionId}
        viewType="companion"
        theme={hiFiTheme as unknown as ChatTheme}
        isLoading={isLoading || isInitialLoading}
        onSelectSession={selectSession}
        onDeleteSession={deleteSession}
        onNewSession={handleNewSession}
        onSendMessage={handleSendMessage}
        onStopMessage={stopMessage}
        onFileUpload={handleFileUpload}
        className="flex-1 z-10 flex flex-col"
      >
        <div className="flex-1 h-screen relative">
          {/* Initial Loading State */}
          {isInitialLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading session...</p>
              </div>
            </div>
          )}

          {/* Display ADK conversations */}
          {!isInitialLoading && displayConversations.length > 0 && (
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {displayConversations.map((conversation, index) => (
                  <div key={conversation.id} className="space-y-4">
                    {/* User message */}
                    <div className="flex justify-end">
                      <div className="bg-emerald-600 text-white rounded-lg px-4 py-2 max-w-md">
                        <p>{conversation.question}</p>
                      </div>
                    </div>
                    {/* Assistant response */}
                    {conversation.response && (
                      <div className="flex justify-start">
                        <div className="bg-gray-700 text-white rounded-lg px-4 py-2 max-w-md">
                          <p>{conversation.response}</p>
                        </div>
                      </div>
                    )}
                    {/* Loading indicator for pending assistant response */}
                    {conversation.id.includes('pending-user') && !conversation.response && isAdkPending && (
                      <div className="flex justify-start">
                        <div className="bg-gray-700 text-white rounded-lg px-4 py-2 max-w-md">
                          <div className="flex items-center space-x-2">
                            <div className="animate-pulse">●</div>
                            <div className="animate-pulse">●</div>
                            <div className="animate-pulse">●</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Show welcome screen if no conversations and not loading */}
          {!isInitialLoading && displayConversations.length === 0 && (
            <WelcomeScreen onQuickAction={handleQuickAction} />
          )}

          {/* Error Display */}
          {adkError && (
            <div className="absolute top-20 left-0 right-0 p-6 max-w-4xl mx-auto">
              <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400">Error: {adkError.message}</p>
              </div>
            </div>
          )}

          {/* Chat Input at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/30 to-blue-500/30 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

                {/* Main input container */}
                <div className="relative z-10 bg-gray-800/95 backdrop-blur-md border border-gray-600 rounded-2xl shadow-2xl hover:border-teal-400/60 hover:shadow-teal-500/10 transition-all duration-300">
                  <ChatInput
                    message={currentMessage}
                    setMessage={setCurrentMessage}
                    onSend={() => handleSendMessage(currentMessage)}
                    disabled={isAdkPending || isInitialLoading}
                  />
                </div>

                {/* Subtle bottom glow */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent rounded-full opacity-60"></div>
              </div>

              {/* Send button with loading state */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => handleSendMessage(currentMessage)}
                  disabled={isAdkPending || !currentMessage.trim() || isInitialLoading}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center space-x-2"
                >
                  {isAdkPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </div>

              {/* Session loading indicator */}
              {isInitialLoading && (
                <div className="flex justify-center mt-2">
                  <p className="text-gray-400 text-sm">Loading session data...</p>
                </div>
              )}
            </div>
          </div>
        </div>
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
