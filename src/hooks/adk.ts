import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Event,
    Content,
} from '../lib/validations/adk.schema';
import { useMemo, useState, useEffect } from 'react';
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
        onSuccess: () => {
            if (sessionId) {
                queryClient.invalidateQueries({ queryKey: ['adk', 'session', sessionId] });
            }
        },
    });
}

// Utility hook: fetch session data and extract messages with roles/content from session events
export function useSessionMessagesQuery(sessionId: string | undefined) {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        console.log('ndde')
        if (!sessionId) {
            setMessages([]);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            api.adk.getSession(sessionId)
                .then((sessionData) => {
                    console.log('casd', sessionData)
                    const events: Event[] = sessionData.data.events || [];
                    const filtered = events
                        .filter((e) => e.content)
                        .map((e) => {
                            const content = e.content as Content;
                            if (e.author == 'user') {
                                return {
                                    author: e.author,
                                    text: content.parts.map((part) => part.text).join(''),
                                    timestamp: e.timestamp,
                                }
                            }
                            for (const part of content.parts) {
                                return {
                                    author: e.author,
                                    text: part.text,
                                    function_called_name: part.functionCall?.args?.agent_name || part.functionResponse?.name || part.functionCall?.name || null,
                                    function_response_content: parseStringToJson(part.functionResponse?.response?.result?.content?.map((c: any) => c.text)) || null,
                                    function_call: part.functionCall,
                                    function_response: part.functionResponse,
                                    timestamp: e.timestamp,
                                }
                            }
                        });
                    setMessages(filtered);
                    setLoading(false);
                })
                .catch((err) => {
                    setError(err);
                    setMessages([]);
                    setLoading(false);
                });
        } catch (e) {
            console.log(e);
        }
    }, [sessionId]);

    return { messages, loading, error };
}
