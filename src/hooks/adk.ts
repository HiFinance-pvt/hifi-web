import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Event,
    Content,
    ProcessedMessage,
} from '../lib/validations/adk.schema';
import { useMemo, useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { parseStringToJson } from '@/utils';

// React Query hooks
export function useListSessionsQuery() {
    return useQuery({
        queryKey: ['adk', 'sessions'],
        queryFn: () => api.adk.listSessions(),
    });
}

export function useCreateSessionMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => api.adk.createSession(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adk', 'sessions'] });
        },
    });
}

export function useDeleteSessionMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (sessionId: string) => api.adk.deleteSession(sessionId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adk', 'sessions'] });
        },
    });
}

export function useGetSessionQuery(sessionId: string | undefined) {
    return useQuery({
        queryKey: ['adk', 'session', sessionId],
        queryFn: () => (sessionId ? api.adk.getSession(sessionId) : Promise.reject('No sessionId')),
        enabled: !!sessionId,
    });
}

export function useSendMessageMutation(sessionId: string | undefined) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (message: string) => {
            if (!sessionId) throw new Error('No sessionId');
            return api.adk.sendMessage(sessionId, message);
        },
        onSuccess: (data) => {
            if (sessionId) {
                // After sendMessage completes, fetch the updated session
                queryClient.invalidateQueries({ queryKey: ['adk', 'session-messages', sessionId] });
            }
        },
        onError: (error) => {
            console.error('Send message error:', error);
        },
    });
}

// Utility function to process content parts
export function processContentParts(parts: any[], eventId: string, author: string, timestamp: number): ProcessedMessage[] {
    const messages: ProcessedMessage[] = [];

    if (!Array.isArray(parts)) {
        console.warn('Parts is not an array:', parts);
        return messages;
    }

    parts.forEach((part, partIndex) => {
        if (!part || typeof part !== 'object') {
            console.warn('Invalid part at index', partIndex, part);
            return;
        }

        const messageId = `${eventId}-part-${partIndex}`;

        // Handle function calls
        if (part.functionCall && typeof part.functionCall === 'object') {
            messages.push({
                id: messageId,
                author,
                timestamp,
                type: 'function_call',
                functionName: part.functionCall.name || 'Unknown Function',
                functionArgs: part.functionCall.args || {},
                text: part.functionCall.text || `Calling function: ${part.functionCall.name || 'Unknown'}`,
            });
        }

        // Handle function responses
        if (part.functionResponse && typeof part.functionResponse === 'object') {
            const response = part.functionResponse;
            const result = response.response?.result;

            // Handle different result types
            let responseText = 'Function response received';
            let isError = false;

            if (typeof result === 'string') {
                // Result is a string
                responseText = result;
                isError = false;
            } else if (result && typeof result === 'object') {
                // Result is an object
                const resultContent = result.content;
                responseText = resultContent
                    ? resultContent.map((c: any) => c.text).join(' ')
                    : 'Function executed successfully';
                isError = result.isError || false;
            } else if (result === null || result === undefined) {
                // Result is null or undefined
                responseText = 'Function response received';
                isError = false;
            }

            messages.push({
                id: messageId,
                author,
                timestamp,
                type: 'function_response',
                functionName: response.name || 'Unknown Function',
                functionResponse: result,
                text: responseText,
                isError: isError,
            });
        }

        // Handle regular text
        if (part.text && typeof part.text === 'string') {
            messages.push({
                id: messageId,
                author,
                timestamp,
                type: author === 'user' ? 'user' : 'assistant',
                text: part.text,
            });
        }

        // Handle thoughts
        if (part.thought) {
            messages.push({
                id: messageId,
                author,
                timestamp,
                type: 'thought',
                text: typeof part.thought === 'string' ? part.thought : JSON.stringify(part.thought),
            });
        }
    });

    return messages;
}

// Enhanced hook: fetch session data and extract all message types
export function useSessionMessagesQuery(sessionId: string | undefined) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ['adk', 'session-messages', sessionId],
        queryFn: async () => {
            if (!sessionId) throw new Error('No sessionId');
            const sessionData = await api.adk.getSession(sessionId);
            const events: Event[] = sessionData.data.events || [];
            const allMessages: ProcessedMessage[] = [];

            events.forEach((event) => {
                if (event.content && event.content.parts) {
                    try {
                        const processedMessages = processContentParts(
                            event.content.parts,
                            event.id,
                            event.author,
                            event.timestamp
                        );
                        allMessages.push(...processedMessages);
                    } catch (partError) {
                        console.warn('Error processing event parts:', partError, event);
                        // Continue processing other events even if one fails
                    }
                }
            });

            // Sort messages by timestamp
            allMessages.sort((a, b) => a.timestamp - b.timestamp);

            return allMessages;
        },
        enabled: !!sessionId,
        refetchInterval: false, // No automatic refetching
        refetchOnWindowFocus: false, // Don't refetch when window gains focus
        refetchOnMount: false, // Don't refetch on component mount if data exists
        refetchOnReconnect: false, // Don't refetch on network reconnect
        staleTime: Infinity, // Data never goes stale automatically
        gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    });

    // Manual refetch function
    const refetchMessages = useCallback(() => {
        if (sessionId) {
            queryClient.invalidateQueries({ queryKey: ['adk', 'session-messages', sessionId] });
        }
    }, [sessionId, queryClient]);

    return {
        messages: query.data || [],
        loading: query.isLoading,
        error: query.error,
        refetch: refetchMessages,
    };
}

// New hook for streaming messages
export function useStreamingMessage(sessionId: string | undefined) {
    const [streamingText, setStreamingText] = useState('');
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamingError, setStreamingError] = useState<Error | null>(null);

    const startStreaming = async (message: string, onComplete?: () => void) => {
        if (!sessionId) {
            setStreamingError(new Error('No session ID'));
            return;
        }

        setStreamingText('');
        setIsStreaming(true);
        setStreamingError(null);

        try {
            for await (const chunk of api.adk.sendMessageStream(sessionId, message)) {
                setStreamingText(prev => prev + chunk);
            }
            // Streaming completed successfully
            if (onComplete) {
                onComplete();
            }
        } catch (err) {
            console.error('Streaming error:', err);
            setStreamingError(err instanceof Error ? err : new Error(String(err)));
        } finally {
            setIsStreaming(false);
        }
    };

    const stopStreaming = () => {
        setIsStreaming(false);
        setStreamingText('');
        setStreamingError(null);
    };

    return {
        streamingText,
        isStreaming,
        streamingError,
        startStreaming,
        stopStreaming,
    };
}
