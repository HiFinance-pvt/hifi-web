"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useParams, useRouter } from "next/navigation";
import {
    Chat,
    ChatTheme,
} from "reachat";

// Custom components and hooks
import { useChat } from "@/hooks/useChat";
import { Sidebar } from "@/components/Sidebar";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { hiFiTheme } from "@/theme/hifi-theme";
import { QuickAction } from "@/types/chat";
import { ChatInput } from "@/components/dashboard";
import {
    useSendMessageMutation,
    useSessionMessagesQuery,
    useStreamingMessage
} from "@/hooks/adk";
import { useSessionStore } from "@/stores/sessionStore";
import { SessionCreationLoader } from "@/components/ui/CustomLoader";
import Particles from "@/ui/components/Particles";
import {
    MessageRenderer,
    GroupedMessageRenderer,
    StreamingIndicator,
    SessionRefetchingIndicator
} from "@/components/dashboard/CustomMessages";
import { ProcessedMessage } from "@/lib/validations/adk.schema";

export default function HiFiDashboard() {
    const params = useParams();
    const router = useRouter();
    const sessionId = useMemo(() => params?.session_id as string, [params?.session_id]);

    const [currentMessage, setCurrentMessage] = useState("");
    const [pendingUserMsg, setPendingUserMsg] = useState<string | null>(null);
    const [isRefetchingSession, setIsRefetchingSession] = useState(false);
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Create stable reference for setMessage to prevent re-renders
    const handleSetMessage = useCallback((value: string) => {
        setCurrentMessage(value);
    }, []);

    // Auto-scroll to bottom of chat
    const scrollToBottom = useCallback((behavior: ScrollBehavior = 'smooth') => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: behavior
            });
        }
    }, []);

    // Handle scroll events to show/hide scroll-to-bottom button
    const handleScroll = useCallback(() => {
        if (chatContainerRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold
            setShowScrollToBottom(!isAtBottom);
        }
    }, []);

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
    const { mutate: sendAdkMessage, isPending: isAdkPending, error: adkError, data: adkResponse, reset: resetAdkMutation } = useSendMessageMutation(sessionId);
    const { messages: adkMessages, loading: adkMessagesLoading, error: adkMessagesError, refetch: refetchMessages } = useSessionMessagesQuery(sessionId);
    const {
        streamingText,
        isStreaming,
        streamingError,
        startStreaming,
        stopStreaming
    } = useStreamingMessage(sessionId);

    // Custom refetch function with loading state
    const handleRefetchMessages = useCallback(async () => {
        if (sessionId) {
            console.log('🔄 Starting session refetch...');
            setIsRefetchingSession(true);
            try {
                await refetchMessages();
                console.log('✅ Session refetch completed');
            } finally {
                // Add a small delay to show the loading state
                setTimeout(() => {
                    console.log('🏁 Session refetch loading state cleared');
                    setIsRefetchingSession(false);
                }, 500);
            }
        }
    }, [sessionId, refetchMessages]);

    const {
        user,
        selectSession,
        deleteSession,
        stopMessage,
        handleFileUpload,
        toggleSessionStar,
    } = useChat();

    // Use session data from store
    const activeSessionId = sessionId;
    const sessionsByCategory = useMemo(() => ({
        starred: sessions.filter((s: any) => s.starred),
        chats: sessions.filter((s: any) => !s.starred),
    }), [sessions]);

    // Initialize session data and start periodic sync
    useEffect(() => {
        const initializeSession = async () => {
            // Fetch sessions on mount only if we don't have any
            if (sessions.length === 0) {
                await fetchSessions();
            }

            // Start periodic sync
            startPeriodicSync();

            // Mark initial load as complete
            setIsInitialLoad(false);
        };

        initializeSession();

        // Cleanup on unmount
        return () => {
            stopPeriodicSync();
        };
    }, [fetchSessions, startPeriodicSync, stopPeriodicSync, sessions.length]);

    // Check if session exists, if not create a new one
    useEffect(() => {
        if (sessionId && sessions.length > 0) {
            const sessionExists = sessions.some((session: any) => session.id === sessionId);
            if (!sessionExists) {
                setIsCreatingSession(true);
                createSession().then((newSession) => {
                    if (newSession) {
                        router.replace(`/dashboard/${newSession.id}`);
                    }
                    setIsCreatingSession(false);
                }).catch(() => {
                    setIsCreatingSession(false);
                });
            } else {
                // Set current session only if it's different
                const session = sessions.find((s: any) => s.id === sessionId);
                if (session && currentSession?.id !== sessionId) {
                    setCurrentSession(session);
                }
            }
        }
    }, [sessionId, sessions, createSession, router, setCurrentSession, currentSession?.id]);

    // Clear pending message when new messages arrive
    useEffect(() => {
        if (adkMessages.length > 0 && pendingUserMsg) {
            // Check if we have a new assistant message after our pending user message
            const lastMessage = adkMessages[adkMessages.length - 1];
            if (lastMessage.author === 'assistant' && lastMessage.timestamp > Date.now() - 15000) {
                console.log('🧹 Clearing pending message - assistant responded');
                setPendingUserMsg(null);
                return;
            }

            // Also clear pending message if we have the same user message in the session data
            const hasUserMessageInSession = adkMessages.some(msg =>
                msg.author === 'user' &&
                msg.text === pendingUserMsg &&
                msg.timestamp > Date.now() - 15000
            );

            if (hasUserMessageInSession) {
                console.log('🧹 Clearing pending message - found in session data');
                setPendingUserMsg(null);
                return;
            }
        }
    }, [adkMessages, pendingUserMsg]);

    // Clear pending message when sendMessage completes
    useEffect(() => {
        if (adkResponse && pendingUserMsg) {
            console.log('🧹 Clearing pending message - sendMessage completed');
            setPendingUserMsg(null);
        }
    }, [adkResponse, pendingUserMsg]);

    // Clear pending message when streaming completes
    useEffect(() => {
        if (!isStreaming && streamingText && pendingUserMsg) {
            console.log('🧹 Clearing pending message - streaming completed');
            // Add a small delay to ensure the session has been updated
            setTimeout(() => {
                setPendingUserMsg(null);
            }, 500);
        }
    }, [isStreaming, streamingText, pendingUserMsg]);

    // Clear pending message when session is refetched (additional safety)
    useEffect(() => {
        if (adkMessages.length > 0 && pendingUserMsg) {
            // Check if the session has been updated with our message
            const recentUserMessages = adkMessages.filter(msg =>
                msg.author === 'user' &&
                msg.timestamp > Date.now() - 30000
            );

            const hasRecentUserMessage = recentUserMessages.some(msg => msg.text === pendingUserMsg);

            if (hasRecentUserMessage) {
                console.log('🧹 Clearing pending message - session refetched with user message');
                setPendingUserMsg(null);
            }
        }
    }, [adkMessages.length, pendingUserMsg]); // Only depend on length to avoid infinite loops

    // Auto-clear pending message after timeout (safety mechanism)
    useEffect(() => {
        if (pendingUserMsg) {
            const timeout = setTimeout(() => {
                console.log('⏰ Auto-clearing pending message after timeout');
                setPendingUserMsg(null);
            }, 10000); // 10 second timeout

            return () => clearTimeout(timeout);
        }
    }, [pendingUserMsg]);

    // Auto-scroll when new messages arrive
    useEffect(() => {
        if (adkMessages.length > 0) {
            // Small delay to ensure DOM is updated
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [adkMessages.length, scrollToBottom]);

    // Auto-scroll when streaming text updates
    useEffect(() => {
        if (isStreaming && streamingText) {
            // Immediate scroll for streaming updates
            scrollToBottom('auto');
        }
    }, [streamingText, isStreaming, scrollToBottom]);

    // Auto-scroll when pending message is added
    useEffect(() => {
        if (pendingUserMsg) {
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }
    }, [pendingUserMsg, scrollToBottom]);

    // Auto-scroll when session refetching completes
    useEffect(() => {
        if (!isRefetchingSession && adkMessages.length > 0) {
            setTimeout(() => {
                scrollToBottom();
            }, 200);
        }
    }, [isRefetchingSession, adkMessages.length, scrollToBottom]);

    // Refetch messages when streaming ends
    useEffect(() => {
        if (!isStreaming && streamingText) {
            // Streaming just ended, refetch to get the final message
            setTimeout(() => {
                handleRefetchMessages();
            }, 1000); // Small delay to ensure backend has processed the message
        }
    }, [isStreaming, streamingText, handleRefetchMessages]);

    const handleQuickAction = useCallback((action: QuickAction) => {
        console.log('📝 Setting pending message from quick action:', action.text);
        setPendingUserMsg(action.text);
        sendAdkMessage(action.text);
    }, [sendAdkMessage]);

    const handleSendMessage = useCallback(async (message: string) => {
        if (message.trim()) {
            // Optimistically show user message
            console.log('📝 Setting pending message from send:', message);
            setPendingUserMsg(message);

            // Try streaming first, fallback to regular send
            try {
                await startStreaming(message, () => {
                    // Streaming completed, refetch to get the final message
                    setTimeout(() => {
                        handleRefetchMessages();
                    }, 1000);
                });
            } catch (error) {
                console.warn('Streaming failed, falling back to regular send:', error);
                sendAdkMessage(message);
            }

            setCurrentMessage(""); // Clear input after sending
        }
    }, [startStreaming, handleRefetchMessages, sendAdkMessage]);

    const handleNewSession = useCallback(() => {
        setIsCreatingSession(true);
        createSession().then((newSession) => {
            if (newSession) {
                router.push(`/dashboard/${newSession.id}`);
            }
            setIsCreatingSession(false);
        }).catch(() => {
            setIsCreatingSession(false);
        });
    }, [createSession, router]);

    const handleActiveSession = useCallback((sessionId: string) => {
        router.push(`/dashboard/${sessionId}`);
    }, [router]);

    // Create display messages including pending and streaming
    const displayMessages: ProcessedMessage[] = useMemo(() => {
        const messages = [...adkMessages];

        // Add pending user message if exists and not already in session data
        if (pendingUserMsg) {
            // More strict check for duplicates - look for exact text match within a longer time window
            const hasUserMessageInSession = adkMessages.some(msg =>
                msg.author === 'user' &&
                msg.text === pendingUserMsg &&
                msg.timestamp > Date.now() - 30000 // 30 second window
            );

            if (!hasUserMessageInSession) {
                console.log('📝 Adding pending user message to display');
                messages.push({
                    id: `pending-user-${Date.now()}`,
                    author: 'user',
                    timestamp: Date.now(),
                    type: 'user',
                    text: pendingUserMsg,
                });
            } else {
                console.log('🚫 Skipping pending user message - already in session data');
            }
        }

        // Add streaming message if active
        if (isStreaming && streamingText) {
            messages.push({
                id: `streaming-${Date.now()}`,
                author: 'assistant',
                timestamp: Date.now(),
                type: 'assistant',
                text: streamingText,
                isPartial: true,
            });
        }

        // Sort messages by timestamp
        return messages.sort((a, b) => a.timestamp - b.timestamp);
    }, [adkMessages, pendingUserMsg, isStreaming, streamingText]);

    // Create a custom ADK session for the chat interface
    const adkSession = useMemo(() => ({
        id: sessionId,
        title: "ADK Chat Session",
        createdAt: new Date(),
        updatedAt: new Date(),
        conversations: displayMessages.map(msg => ({
            id: msg.id,
            question: msg.type === 'user' ? msg.text || '' : '',
            response: msg.type === 'assistant' ? msg.text || '' : '',
            createdAt: new Date(msg.timestamp),
            updatedAt: new Date(msg.timestamp),
            files: [],
            sources: [],
        })),
    }), [sessionId, displayMessages]);

    // Transform API sessions to match the expected format
    const transformedSessions = useMemo(() => sessions.map((session: any) => ({
        id: session.id,
        title: session.appName || `Session ${session.id}`,
        createdAt: new Date(session.lastUpdateTime),
        updatedAt: new Date(session.lastUpdateTime),
        conversations: [],
    })), [sessions]);

    const allSessions = useMemo(() => [...transformedSessions, adkSession], [transformedSessions, adkSession]);

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
                    // starredSessions={sessionsByCategory.starred}
                    // chatSessions={sessionsByCategory.chats}
                    activeSessionId={activeSessionId}
                    onSelectSession={handleActiveSession}
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
                    {/* Initial Loading State */}
                    {isInitialLoading && (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                                <p className="text-gray-400">Loading session...</p>
                            </div>
                        </div>
                    )}

                    {/* Display messages using custom components */}
                    {!isInitialLoading && displayMessages.length > 0 && (
                        <div className="flex-1 overflow-y-auto p-6 pb-32" ref={chatContainerRef} onScroll={handleScroll}>
                            <div className="max-w-4xl mx-auto space-y-4">
                                <GroupedMessageRenderer messages={displayMessages} />
                                {/* Show refetch indicator */}
                                {adkMessagesLoading && displayMessages.length > 0 && (
                                    <div className="flex justify-center py-4">
                                        <div className="flex items-center space-x-2 text-gray-400">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
                                            <span className="text-sm">Loading new messages...</span>
                                        </div>
                                    </div>
                                )}

                                {/* Show session refetching indicator */}
                                {isRefetchingSession && displayMessages.length > 0 && (
                                    <SessionRefetchingIndicator />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Scroll to bottom button */}
                    {showScrollToBottom && (
                        <button
                            onClick={() => scrollToBottom()}
                            className="absolute bottom-20 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-3 shadow-lg transition-all duration-200 z-10"
                            title="Scroll to bottom"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </button>
                    )}

                    {/* Show streaming indicator if streaming but no text yet */}
                    {!isInitialLoading && isStreaming && !streamingText && (
                        <div className="flex-1 overflow-y-auto p-6 pb-32">
                            <div className="max-w-4xl mx-auto">
                                <StreamingIndicator />
                            </div>
                        </div>
                    )}

                    {/* Show welcome screen if no messages and not loading */}
                    {!isInitialLoading && displayMessages.length === 0 && !isStreaming && (
                        <div className="flex-1 overflow-y-auto pb-32">
                            <WelcomeScreen onQuickAction={handleQuickAction} />
                        </div>
                    )}

                    {/* Error Display */}
                    {(adkError || adkMessagesError || streamingError) && (
                        <div className="absolute top-20 left-0 right-0 p-6 max-w-4xl mx-auto">
                            <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4">
                                <p className="text-red-400">
                                    Error: {adkError?.message || adkMessagesError?.message || streamingError?.message}
                                </p>
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
                                        setMessage={handleSetMessage}
                                        onSend={() => handleSendMessage(currentMessage)}
                                        disabled={isAdkPending || isStreaming || isInitialLoading || isRefetchingSession}
                                    />
                                </div>

                                {/* Subtle bottom glow */}
                                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-teal-500/20 to-transparent rounded-full opacity-60"></div>

                                {/* Session loading indicator */}
                                {isInitialLoading && (
                                    <div className="flex justify-center mt-2">
                                        <p className="text-gray-400 text-sm">Loading session data...</p>
                                    </div>
                                )}
                            </div>
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