"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Chat, ChatTheme } from "reachat";

// Custom components and hooks
import { Sidebar } from "@/components/Sidebar";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { hiFiTheme } from "@/theme/hifi-theme";
import { QuickAction } from "@/types/chat";
import { ChatInput } from "@/components/dashboard";
import {
  useSendMessageMutation,
  useSessionMessagesQuery,
  useStreamingMessage,
} from "@/hooks/adk";
import { useSessionStore } from "@/stores/sessionStore";
import { useDebtSquasherStore } from "@/stores/debtSquasherStore";
import { useTaxTraderStore } from "@/stores/taxTraderStore";
import { SessionCreationLoader } from "@/components/ui/CustomLoader";
import { AGENTS } from "@/constants/mockData";
import { getAgentDefaultPrompt } from "@/constants/agentPrompts";
import {
  GroupedMessageRenderer,
  StreamingIndicator,
} from "@/components/dashboard/CustomMessages";
import { ProcessedMessage } from "@/lib/validations/adk.schema";

export default function HiFiDashboard() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = params.session_id as string;

  // Query parameters
  const agent = searchParams.get("agent");
  const messageParam = searchParams.get("message");

  // UI State
  const [currentMessage, setCurrentMessage] = useState("");
  const [pendingUserMsg, setPendingUserMsg] = useState<string | null>(null);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [hasAutoSentMessage, setHasAutoSentMessage] = useState(false);

  // Refs
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const pendingMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastStreamingCompleteRef = useRef<number>(0);

  // Session store
  const {
    sessions,
    currentSession,
    fetchSessions,
    fetchSession,
    createSession,
    setCurrentSession,
    startPeriodicSync,
    stopPeriodicSync,
    checkUserChange,
  } = useSessionStore();

  // ADK hooks
  const {
    mutate: sendAdkMessage,
    isPending: isAdkPending,
    error: adkError,
  } = useSendMessageMutation(sessionId);

  const {
    messages: adkMessages,
    loading: adkMessagesLoading,
    error: adkMessagesError,
    refetch: refetchMessages,
  } = useSessionMessagesQuery(sessionId);

  const {
    streamingText,
    isStreaming,
    streamingError,
    startStreaming,
    stopStreaming,
  } = useStreamingMessage(sessionId);

  // Agent-specific stores
  const debtSquasherStore = useDebtSquasherStore();
  const taxTraderStore = useTaxTraderStore();

  // ============================================================================
  // SCROLL HANDLING
  // ============================================================================

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100;
      setShowScrollToBottom(!isAtBottom);
    }
  }, []);

  // ============================================================================
  // MESSAGE HANDLING
  // ============================================================================

  const handleSendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      // Show optimistic user message
      setPendingUserMsg(message);
      setCurrentMessage("");

      try {
        await startStreaming(message, () => {
          // Mark when streaming completed to avoid immediate refetch
          lastStreamingCompleteRef.current = Date.now();
          // Single refetch after streaming completes
          setTimeout(() => {
            refetchMessages();
          }, 800);
        });
      } catch (error) {
        console.warn("Streaming failed, falling back to regular send:", error);
        sendAdkMessage(message);
      }
    },
    [startStreaming, refetchMessages, sendAdkMessage]
  );

  const handleQuickAction = useCallback(
    (action: QuickAction) => {
      handleSendMessage(action.text);
    },
    [handleSendMessage]
  );

  const handleAgentSelect = useCallback(
    (selectedAgent: (typeof AGENTS)[0]) => {
      const defaultPrompt = getAgentDefaultPrompt(selectedAgent.id);
      handleSendMessage(defaultPrompt);
    },
    [handleSendMessage]
  );

  // ============================================================================
  // SESSION HANDLING
  // ============================================================================

  const handleNewSession = useCallback(() => {
    setIsCreatingSession(true);
    createSession()
      .then((newSession) => {
        if (newSession) {
          router.push(`/dashboard/${newSession.id}`);
        }
      })
      .finally(() => setIsCreatingSession(false));
  }, [createSession, router]);

  const handleActiveSession = useCallback(
    (sessionId: string) => {
      router.push(`/dashboard/${sessionId}`);
    },
    [router]
  );

  // ============================================================================
  // CONSOLIDATED EFFECTS
  // ============================================================================

  // Effect 1: Initialize session on mount
  useEffect(() => {
    const initializeSession = async () => {
      checkUserChange();

      if (sessions.length === 0) {
        await fetchSessions();
      }

      if (sessionId) {
        await fetchSession(sessionId, false);
      }

      startPeriodicSync();
      setIsInitialLoad(false);
    };

    initializeSession();

    return () => {
      stopPeriodicSync();
    };
    // Only run on mount and sessionId change
  }, [sessionId]);

  // Effect 2: Handle session validation and creation
  useEffect(() => {
    if (!sessionId || sessions.length === 0) return;

    const sessionExists = sessions.some((s) => s.id === sessionId);

    if (!sessionExists) {
      setIsCreatingSession(true);
      createSession()
        .then((newSession) => {
          if (newSession) {
            router.replace(`/dashboard/${newSession.id}`);
          }
        })
        .finally(() => setIsCreatingSession(false));
    } else {
      const session = sessions.find((s) => s.id === sessionId);
      if (session && currentSession?.id !== sessionId) {
        setCurrentSession(session);
      }
    }
  }, [sessionId, sessions, currentSession?.id, createSession, router, setCurrentSession]);

  // Effect 3: Clear pending message when messages arrive or streaming ends
  useEffect(() => {
    if (!pendingUserMsg) return;

    // Clear if we have the message in session data
    const hasMessage = adkMessages.some(
      (msg) => msg.author === "user" && msg.text === pendingUserMsg
    );

    // Clear if streaming just completed
    const streamingJustCompleted = !isStreaming && streamingText;

    if (hasMessage || streamingJustCompleted) {
      setPendingUserMsg(null);
      return;
    }

    // Safety timeout - clear after 10 seconds
    if (pendingMessageTimeoutRef.current) {
      clearTimeout(pendingMessageTimeoutRef.current);
    }
    pendingMessageTimeoutRef.current = setTimeout(() => {
      setPendingUserMsg(null);
    }, 10000);

    return () => {
      if (pendingMessageTimeoutRef.current) {
        clearTimeout(pendingMessageTimeoutRef.current);
      }
    };
  }, [pendingUserMsg, adkMessages, isStreaming, streamingText]);

  // Effect 4: Auto-scroll on new content
  useEffect(() => {
    if (adkMessages.length > 0 || pendingUserMsg || (isStreaming && streamingText)) {
      requestAnimationFrame(() => scrollToBottom(isStreaming ? "auto" : "smooth"));
    }
  }, [adkMessages.length, pendingUserMsg, isStreaming, streamingText, scrollToBottom]);

  // Effect 5: Handle auto-send messages from URL params (agent or message)
  useEffect(() => {
    // Skip if already sent, still loading, or has messages
    if (hasAutoSentMessage || isInitialLoad || adkMessages.length > 0 || isAdkPending) {
      return;
    }

    // Handle direct message parameter
    if (messageParam && sessionId) {
      const decodedMessage = decodeURIComponent(messageParam);
      setHasAutoSentMessage(true);

      setTimeout(() => {
        handleSendMessage(decodedMessage);
        router.replace(`/dashboard/${sessionId}`, { scroll: false });
      }, 300);
      return;
    }

    // Handle agent-specific prompts
    if (agent && sessionId) {
      let defaultPrompt = getAgentPromptForType(agent, debtSquasherStore, taxTraderStore);

      if (defaultPrompt) {
        setHasAutoSentMessage(true);
        setTimeout(() => {
          handleSendMessage(defaultPrompt);
          router.replace(`/dashboard/${sessionId}`, { scroll: false });
        }, 300);
      }
    }
  }, [
    hasAutoSentMessage,
    isInitialLoad,
    adkMessages.length,
    isAdkPending,
    messageParam,
    agent,
    sessionId,
    handleSendMessage,
    router,
    debtSquasherStore,
    taxTraderStore,
  ]);

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const displayMessages: ProcessedMessage[] = useMemo(() => {
    const messages = [...adkMessages];

    // Add pending user message if not already in session
    if (pendingUserMsg) {
      const exists = adkMessages.some(
        (msg) => msg.author === "user" && msg.text === pendingUserMsg
      );

      if (!exists) {
        messages.push({
          id: `pending-${Date.now()}`,
          author: "user",
          timestamp: Date.now(),
          type: "user",
          text: pendingUserMsg,
        });
      }
    }

    // Add streaming message
    if (isStreaming && streamingText) {
      messages.push({
        id: `streaming-${Date.now()}`,
        author: "assistant",
        timestamp: Date.now(),
        type: "assistant",
        text: streamingText,
        isPartial: true,
      });
    }

    return messages.sort((a, b) => a.timestamp - b.timestamp);
  }, [adkMessages, pendingUserMsg, isStreaming, streamingText]);

  const transformedSessions = useMemo(
    () =>
      sessions.map((session) => ({
        id: session.id,
        title: session.session_name || session.appName || `Session ${session.id}`,
        createdAt: new Date(session.lastUpdateTime),
        updatedAt: new Date(session.lastUpdateTime),
        conversations: [],
      })),
    [sessions]
  );

  const isInitialLoading = isInitialLoad || adkMessagesLoading;

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="flex h-screen bg-[var(--background)] transition-colors duration-300">
      {isCreatingSession && <SessionCreationLoader />}

      {/* Sidebar */}
      <div className="z-10">
        <Sidebar
          activeSessionId={sessionId}
          onSelectSession={handleActiveSession}
          onDeleteSession={() => { }}
          onNewSession={handleNewSession}
          onToggleStar={() => { }}
        />
      </div>

      {/* Main Chat Area */}
      <Chat
        sessions={transformedSessions.map((s) => ({
          id: s.id,
          title: s.title,
          createdAt: s.createdAt,
          updatedAt: s.updatedAt,
          conversations: [],
        }))}
        activeSessionId={sessionId}
        viewType="companion"
        theme={hiFiTheme as unknown as ChatTheme}
        isLoading={isInitialLoading}
        onSelectSession={handleActiveSession}
        onDeleteSession={() => { }}
        onNewSession={handleNewSession}
        onSendMessage={handleSendMessage}
        onStopMessage={stopStreaming}
        className="flex-1 z-10 flex flex-col"
      >
        <div className="flex-1 h-screen relative flex flex-col">
          {/* Loading State */}
          {isInitialLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-[var(--surface-border)] 
                                border-t-[var(--brand-primary)] mx-auto mb-4" />
                <p className="text-sm text-[var(--foreground-muted)]">Loading session...</p>
              </div>
            </div>
          )}

          {/* Messages */}
          {!isInitialLoading && displayMessages.length > 0 && (
            <div
              className="flex-1 overflow-y-auto p-6 pb-32"
              ref={chatContainerRef}
              onScroll={handleScroll}
            >
              <div className="max-w-4xl mx-auto space-y-4">
                <GroupedMessageRenderer messages={displayMessages} />
              </div>
            </div>
          )}

          {/* Scroll to bottom button */}
          {showScrollToBottom && (
            <button
              onClick={() => scrollToBottom()}
              className="absolute bottom-24 right-6 bg-[var(--surface)] border border-[var(--surface-border)]
                        text-[var(--foreground)] rounded-xl p-2.5 shadow-md
                        hover:border-[var(--brand-primary)]/40 transition-all duration-200 z-10"
              title="Scroll to bottom"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          )}

          {/* Streaming indicator (no text yet) */}
          {!isInitialLoading && isStreaming && !streamingText && (
            <div className="flex-1 overflow-y-auto p-6 pb-32">
              <div className="max-w-4xl mx-auto">
                <StreamingIndicator />
              </div>
            </div>
          )}

          {/* Welcome screen */}
          {!isInitialLoading && displayMessages.length === 0 && !isStreaming && (
            <div className="flex-1 overflow-y-auto pb-32">
              <WelcomeScreen onQuickAction={handleQuickAction} />
            </div>
          )}

          {/* Error Display */}
          {(adkError || adkMessagesError || streamingError) && (
            <div className="absolute top-20 left-0 right-0 p-6 max-w-4xl mx-auto">
              <div className="bg-[var(--error-bg)] border border-[var(--error)]/30 rounded-xl p-4">
                <p className="text-[var(--error)] text-sm">
                  {adkError?.message || adkMessagesError?.message || streamingError?.message}
                </p>
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/90 to-transparent">
            <div className="max-w-4xl mx-auto">
              <div className="bg-[var(--surface)] border border-[var(--surface-border)] rounded-2xl
                            focus-within:border-[var(--brand-primary)]/40 transition-colors duration-200">
                <ChatInput
                  message={currentMessage}
                  setMessage={setCurrentMessage}
                  onSend={() => handleSendMessage(currentMessage)}
                  disabled={isAdkPending || isStreaming || isInitialLoading}
                  onAgentSelect={handleAgentSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </Chat>
    </div>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

interface DebtSquasherStoreData {
  hasCompleteData: () => boolean;
  getDataForPrompt: () => string;
  preferences: { intensity?: string; duration_months?: number } | null;
}

interface TaxTraderStoreData {
  hasCompleteData: () => boolean;
  getDataForPrompt: () => string;
  preferences: { regime?: string } | null;
}

function getAgentPromptForType(
  agentType: string,
  debtSquasherStore: DebtSquasherStoreData,
  taxTraderStore: TaxTraderStoreData
): string {
  switch (agentType) {
    case "sebi":
      return `You are a SEBI compliance agent specialized in financial analysis and regulatory compliance. 

Welcome! I'm here to assist you with:

🏛️ **SEBI Regulations & Compliance**
- Investment guidelines and regulatory requirements
- Compliance checks for trading and investments
- SEBI disclosure requirements
- Regulatory updates and changes

📊 **Financial Analysis & Advisory**
- Investment portfolio analysis
- Risk assessment and management
- Market analysis and insights
- Investment strategy recommendations

🔍 **Anomaly Detection & Monitoring**
- Unusual market activity analysis
- Trading pattern analysis
- Compliance violation detection
- Risk monitoring guidelines

🎯 **Investment Guidance**
- Mutual fund regulations and selection
- Stock market compliance rules
- Investment planning strategies
- Regulatory best practices

How can I help you today?`;

    case "debt-squasher":
      if (debtSquasherStore.hasCompleteData()) {
        return `You are a debt management specialist focused on helping users eliminate debt efficiently. I have analyzed the user's debt situation and preferences.

${debtSquasherStore.getDataForPrompt()}

Based on this analysis, please provide:
1. A detailed debt reduction strategy tailored to their ${debtSquasherStore.preferences?.intensity} approach
2. Specific monthly payment recommendations
3. Tips for staying on track with the ${debtSquasherStore.preferences?.duration_months}-month timeline
4. Potential ways to accelerate debt payoff
5. Strategies to avoid accumulating new debt

Let's create an actionable plan to become debt-free!`;
      }
      return `You are a debt management specialist dedicated to helping people eliminate debt and achieve financial freedom.

I'm here to help you:
- Analyze your current debt situation
- Create personalized debt payoff strategies
- Recommend optimal payment approaches (snowball vs avalanche)
- Provide budgeting advice to accelerate debt elimination
- Keep you motivated on your debt-free journey

Would you like to begin by sharing details about your current debt situation?`;

    case "trader-agent":
      if (taxTraderStore.hasCompleteData()) {
        return `You are a tax planning specialist focused on helping users optimize their tax liability and maximize savings. I have analyzed the user's tax situation and preferences.

${taxTraderStore.getDataForPrompt()}

Based on this analysis, please provide:
1. A detailed tax optimization strategy for the ${taxTraderStore.preferences?.regime === "old" ? "Old" : "New"} Tax Regime
2. Specific deduction recommendations and investment suggestions
3. Tax-saving opportunities and strategies
4. Comparison between Old and New Tax Regime benefits
5. Long-term tax planning advice

Let's create an actionable tax optimization plan!`;
      }
      return `You are a tax planning specialist dedicated to helping people optimize their tax liability and maximize savings.

I'm here to help you:
- Analyze your current tax situation
- Compare Old vs New Tax Regime benefits
- Recommend optimal tax-saving strategies
- Provide investment advice for tax efficiency
- Plan for long-term tax optimization

Would you like to begin by sharing details about your income and tax situation?`;

    default:
      return "";
  }
}
