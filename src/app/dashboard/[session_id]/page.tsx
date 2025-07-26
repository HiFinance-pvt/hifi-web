"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Chat, ChatTheme } from "reachat";

// Custom components and hooks
import { useChat } from "@/hooks/useChat";
import { Sidebar } from "@/components/Sidebar";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { CustomSessionMessage } from "@/components/dashboard/CustomSessionMessage";
import { hiFiTheme } from "@/theme/hifi-theme";
import { QuickAction, ChatConversation } from "@/types/chat";
import { ChatInput } from "@/components/dashboard";
import { useSendMessageMutation, useSessionMessagesQuery } from "@/hooks/adk";
import { useSessionStore } from "@/stores/sessionStore";
import { SessionCreationLoader } from "@/components/ui/CustomLoader";
import Particles from "@/ui/components/Particles";

export default function HiFiDashboard() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.session_id as string;

  const [currentMessage, setCurrentMessage] = useState("");
  const [adkConversations, setAdkConversations] = useState<any[]>([]);
  const [pendingUserMsg, setPendingUserMsg] = useState<string | null>(null);
  const [pendingAssistantMsg, setPendingAssistantMsg] = useState<string | null>(
    null
  );

  // Session store
  const {
    sessions,
    currentSession,
    isLoading: sessionsLoading,
    error: sessionError,
    fetchSessions,
    fetchSession,
    createSession,
    setCurrentSession,
    startPeriodicSync,
    stopPeriodicSync,
  } = useSessionStore();

  // Track initial load state separately
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // ADK hooks
  const {
    mutate: sendAdkMessage,
    isPending: isAdkPending,
    error: adkError,
    data: adkResponse,
    reset: resetAdkMutation,
  } = useSendMessageMutation(sessionId);
  const { messages: adkMessages, loading: adkMessagesLoading } =
    useSessionMessagesQuery(sessionId);

  // Chat hook for UI state management
  const {
    sessions: allSessions,
    activeSession,
    activeSessionId,
    isLoading: chatLoading,
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

  // Sync between ADK data and chat state
  useEffect(() => {
    if (adkMessages && adkMessages.length > 0) {
      const transformedConversations = adkMessages.map(
        (msg: any, index: number) => ({
          id: msg.id || `msg-${index}`,
          question: msg.userMessage || "",
          response: msg.assistantMessage || msg.text || "",
          createdAt: new Date(msg.timestamp || Date.now()),
          updatedAt: new Date(msg.timestamp || Date.now()),
          adkMessage: msg, // Include full ADK message data for function calls
        })
      );
      setAdkConversations(transformedConversations);
    }
    setIsInitialLoad(false);
  }, [adkMessages]);

  // Handle session selection and fetching
  useEffect(() => {
    const loadSession = async () => {
      if (!sessionId || sessionId === "new") {
        if (sessionId === "new") {
          await handleNewSession();
        }
        return;
      }

      try {
        // Check if session exists in store
        const existingSession = sessions.find((s) => s.id === sessionId);
        if (existingSession) {
          setCurrentSession(existingSession);
        } else {
          // Fetch session from API
          await fetchSession(sessionId);
        }

        // Sync with chat state
        selectSession(sessionId);
      } catch (error) {
        console.error("Failed to load session:", error);
        router.push("/dashboard");
      }
    };

    loadSession();
  }, [
    sessionId,
    sessions,
    fetchSession,
    setCurrentSession,
    selectSession,
    router,
  ]);

  // Handle quick actions
  const handleQuickAction = (action: QuickAction) => {
    setCurrentMessage(action.text);
    handleSendMessage(action.text);
  };

  // Handle sending messages
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessageId = `pending-user-${Date.now()}`;
    const newConversation = {
      id: userMessageId,
      question: message,
      response: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add pending user message to display
    setAdkConversations((prev) => [...prev, newConversation]);
    setCurrentMessage("");

    try {
      // Send via ADK - just pass the message string, sessionId is already bound
      sendAdkMessage(message);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Remove pending message on error
      setAdkConversations((prev) =>
        prev.filter((conv) => conv.id !== userMessageId)
      );
    }
  };

  // Handle ADK response
  useEffect(() => {
    if (adkResponse) {
      // Extract text from ADK response structure
      let responseText = "Response received";
      if (adkResponse.content?.parts && adkResponse.content.parts.length > 0) {
        responseText =
          adkResponse.content.parts
            .map((part: any) => part.text)
            .filter(Boolean)
            .join(" ") || responseText;
      }

      // Update the last conversation with the response
      setAdkConversations((prev) => {
        const updated = [...prev];
        const lastIndex = updated.length - 1;
        if (lastIndex >= 0 && !updated[lastIndex].response) {
          updated[lastIndex] = {
            ...updated[lastIndex],
            response: responseText,
            updatedAt: new Date(),
            adkMessage: adkResponse, // Include full ADK response for function calls
          };
        }
        return updated;
      });

      resetAdkMutation();
    }
  }, [adkResponse, resetAdkMutation]);

  // Handle new session creation
  const handleNewSession = async () => {
    setIsCreatingSession(true);
    try {
      const newSession = await createSession();
      if (newSession) {
        router.push(`/dashboard/${newSession.id}`);
        setCurrentSession(newSession);
        selectSession(newSession.id);
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      router.push("/dashboard");
    } finally {
      setIsCreatingSession(false);
    }
  };

  // Handle session selection
  const handleActiveSession = (selectedSessionId: string) => {
    if (selectedSessionId !== sessionId) {
      router.push(`/dashboard/${selectedSessionId}`);
    }
  };

  // Prepare display conversations with proper typing - only show conversations with responses or the last one if loading
  const displayConversations: ChatConversation[] = adkConversations
    .filter(
      (conv, index) =>
        conv.response || // Show if there's a response
        (index === adkConversations.length - 1 && isAdkPending) // Or if it's the last conversation and we're loading
    )
    .map((conv) => ({
      ...conv,
      files: conv.files || [],
      sources: conv.sources || [],
    }));

  // Get current session info for header
  const getCurrentSessionInfo = () => {
    const session = sessions.find((s) => s.id === sessionId) || currentSession;
    return {
      title: session?.appName || session?.id?.slice(0, 8) || "New Chat",
      isActive: !!session,
    };
  };

  const sessionInfo = getCurrentSessionInfo();

  // Loading state for initial session fetch
  const isInitialLoading = isInitialLoad || adkMessagesLoading;

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Session Creation Loader */}
      {isCreatingSession && <SessionCreationLoader />}

      {/* Custom Sidebar */}
      <div className="z-10 bg-none">
        <Sidebar
          user={user}
          activeSessionId={activeSessionId}
          onSelectSession={handleActiveSession}
          onDeleteSession={deleteSession}
          onNewSession={handleNewSession}
          onToggleStar={toggleSessionStar}
        />
      </div>

      {/* Main Chat Area */}
      <Chat
        sessions={allSessions.map((session) => ({
          id: session.id,
          title: session.title,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          conversations: session.conversations.map((conv) => ({
            id: conv.id,
            question: conv.question,
            response:
              typeof conv.response === "string"
                ? conv.response
                : conv.response?.text || "",
            createdAt: conv.createdAt,
            updatedAt: conv.updatedAt,
            files: conv.files || [],
            sources: conv.sources || [],
          })),
        }))}
        activeSessionId={sessionId}
        viewType="companion"
        theme={hiFiTheme as unknown as ChatTheme}
        isLoading={isInitialLoading}
        onSelectSession={handleActiveSession}
        onDeleteSession={deleteSession}
        onNewSession={handleNewSession}
        onSendMessage={handleSendMessage}
        onStopMessage={stopMessage}
        onFileUpload={handleFileUpload}
        className="flex-1 z-10 flex flex-col"
      >
        <div className="flex-1 h-screen relative flex flex-col">
          {/* Enhanced Chat Header */}
          <div className="sticky top-0 z-20 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50">
            <div className="p-4 flex items-center justify-between">
              {/* Session Info */}
              <div className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    sessionInfo.isActive ? "bg-[#04A66A]" : "bg-gray-500"
                  }`}
                ></div>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {sessionInfo.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {sessionInfo.isActive
                      ? "Active session"
                      : "Start a new conversation"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* New Chat Button */}
                <button
                  onClick={handleNewSession}
                  disabled={isCreatingSession}
                  className="px-4 py-2 bg-[#04A66A] hover:bg-[#04A66A]/80 disabled:bg-[#04A66A]/50 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <span>{isCreatingSession ? "Creating..." : "New Chat"}</span>
                </button>

                {/* Menu Button */}
                <button className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-all duration-200">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            {/* Subtle gradient line */}
            <div className="h-px bg-gradient-to-r from-transparent via-[#04A66A]/30 to-transparent"></div>
          </div>

          {/* Initial Loading State */}
          {isInitialLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Loading session...</p>
              </div>
            </div>
          )}

          {/* Messages Container with Enhanced Custom Messages */}
          {!isInitialLoading && displayConversations.length > 0 && (
            <div className="flex-1 overflow-y-auto pb-32">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <div className="h-full w-full bg-gradient-to-br from-[#04A66A]/10 via-transparent to-blue-500/5"></div>
              </div>

              {/* Messages with Custom Component */}
              <div className="relative z-10 max-w-4xl mx-auto p-6">
                {displayConversations.map((conversation, index) => (
                  <CustomSessionMessage
                    key={conversation.id}
                    conversation={conversation}
                    isLast={index === displayConversations.length - 1}
                  />
                ))}

                {/* Loading indicator for pending response */}
                {isAdkPending && (
                  <div className="flex justify-start mt-6">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                      </div>
                      <div className="backdrop-blur-sm bg-gray-800/90 border border-gray-700/50 text-gray-100 p-4 rounded-2xl rounded-tl-md shadow-lg">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "150ms" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: "300ms" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400">
                            AI is thinking...
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enhanced Welcome Screen */}
          {!isInitialLoading && displayConversations.length === 0 && (
            <div className="flex-1 overflow-y-auto pb-32">
              <WelcomeScreen onQuickAction={handleQuickAction} />
            </div>
          )}

          {/* Error Display */}
          {adkError && (
            <div className="absolute top-20 left-0 right-0 p-6 max-w-4xl mx-auto z-30">
              <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400">Error: {adkError.message}</p>
              </div>
            </div>
          )}

          {/* Enhanced Chat Input */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
            <div className="max-w-4xl mx-auto">
              <div className="relative group">
                {/* Enhanced glowing border effect */}
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

                {/* Enhanced bottom glow */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent rounded-full opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </Chat>

      {/* Background Particles */}
      <div className="absolute inset-0 w-screen h-screen pointer-events-none">
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
