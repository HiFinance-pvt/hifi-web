"use client";

import { useState, useCallback, useMemo } from "react";
import { ChatState, ChatSession, ChatConversation, User } from "@/types/chat";

const INITIAL_USER: User = {
  id: "1",
  name: "Nico Robin",
  avatar: "/avatars/nico-robin.jpg",
  isVerified: true,
  role: "Fi Verified",
};

export const useChat = () => {
  const [state, setState] = useState<ChatState>({
    sessions: [],
    activeSessionId: null,
    isLoading: false,
    user: INITIAL_USER,
  });

  // Get active session
  const activeSession = useMemo(() => {
    return (
      state.sessions.find((session) => session.id === state.activeSessionId) ||
      null
    );
  }, [state.sessions, state.activeSessionId]);

  // Get sessions by category
  const sessionsByCategory = useMemo(() => {
    const starred = state.sessions.filter(
      (session) => session.category === "starred"
    );
    const chats = state.sessions.filter(
      (session) => session.category === "chats"
    );
    return { starred, chats };
  }, [state.sessions]);

  // Create new session
  const createNewSession = useCallback(
    (title: string = "New Chat", category: "starred" | "chats" = "chats") => {
      const newSession: ChatSession = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title,
        category,
        createdAt: new Date(),
        updatedAt: new Date(),
        conversations: [],
      };

      setState((prev) => ({
        ...prev,
        sessions: [newSession, ...prev.sessions],
        activeSessionId: newSession.id,
      }));

      return newSession.id;
    },
    []
  );

  // Select session
  const selectSession = useCallback((sessionId: string) => {
    setState((prev) => ({
      ...prev,
      activeSessionId: sessionId,
    }));
  }, []);

  // Delete session
  const deleteSession = useCallback((sessionId: string) => {
    setState((prev) => {
      const updatedSessions = prev.sessions.filter(
        (session) => session.id !== sessionId
      );
      const newActiveSessionId =
        prev.activeSessionId === sessionId
          ? updatedSessions.length > 0
            ? updatedSessions[0].id
            : null
          : prev.activeSessionId;

      return {
        ...prev,
        sessions: updatedSessions,
        activeSessionId: newActiveSessionId,
      };
    });
  }, []);

  // Send message
  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim()) return;

      // If no active session, create one
      let sessionId = state.activeSessionId;
      if (!sessionId) {
        sessionId = createNewSession("New Chat");
      }

      const newConversation: ChatConversation = {
        id: Date.now().toString(),
        question: message,
        response: undefined,
        isLoading: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Add the conversation to the session
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                conversations: [...session.conversations, newConversation],
                updatedAt: new Date(),
              }
            : session
        ),
        isLoading: true,
      }));

      // Simulate API call with delay
      setTimeout(() => {
        const response = generateMockResponse(message);

        setState((prev) => ({
          ...prev,
          sessions: prev.sessions.map((session) =>
            session.id === sessionId
              ? {
                  ...session,
                  conversations: session.conversations.map((conv) =>
                    conv.id === newConversation.id
                      ? {
                          ...conv,
                          response,
                          isLoading: false,
                          updatedAt: new Date(),
                        }
                      : conv
                  ),
                }
              : session
          ),
          isLoading: false,
        }));
      }, 1500 + Math.random() * 1000); // Random delay between 1.5-2.5s
    },
    [state.activeSessionId, createNewSession]
  );

  // Stop message generation
  const stopMessage = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLoading: false,
      sessions: prev.sessions.map((session) => ({
        ...session,
        conversations: session.conversations.map((conv) => ({
          ...conv,
          isLoading: false,
        })),
      })),
    }));
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback((file: File) => {
    console.log("File uploaded:", file.name);
    // TODO: Implement file upload logic
  }, []);

  // Update session title
  const updateSessionTitle = useCallback(
    (sessionId: string, newTitle: string) => {
      setState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session) =>
          session.id === sessionId
            ? { ...session, title: newTitle, updatedAt: new Date() }
            : session
        ),
      }));
    },
    []
  );

  return {
    // State
    sessions: state.sessions,
    activeSession,
    activeSessionId: state.activeSessionId,
    isLoading: state.isLoading,
    user: state.user,
    sessionsByCategory,

    // Actions
    createNewSession,
    selectSession,
    deleteSession,
    sendMessage,
    stopMessage,
    handleFileUpload,
    updateSessionTitle,
  };
};

// Mock response generator for demo purposes
function generateMockResponse(question: string): string {
  const responses = [
    "Based on your financial profile, I'd recommend considering a diversified portfolio approach...",
    "Your current DTI ratio is within healthy limits. Here's what I found in your recent financial data...",
    "For the upcoming 30 days, based on your spending patterns, you might consider these investment opportunities...",
    "I've analyzed your financial situation and here are my recommendations...",
    "Let me help you understand your financial metrics better...",
  ];

  if (question.toLowerCase().includes("dti")) {
    return "Your current Debt-to-Income (DTI) ratio is 23%, which is considered excellent. This puts you in a strong position for additional investments or loan applications. The ideal DTI ratio is below 36%, so you have plenty of room for financial growth.";
  }

  if (
    question.toLowerCase().includes("30 days") ||
    question.toLowerCase().includes("buy")
  ) {
    return "Based on your spending patterns and available budget, here are some opportunities for the next 30 days:\n\n• **Emergency Fund**: Add $500 to reach your 6-month target\n• **Index Funds**: Consider investing $1,200 in low-cost index funds\n• **Tech Stocks**: AAPL and MSFT are showing strong fundamentals\n• **Crypto**: Allocate 5% ($300) to Bitcoin or Ethereum\n\nRemember to prioritize your emergency fund before making speculative investments.";
  }

  return responses[Math.floor(Math.random() * responses.length)];
}
