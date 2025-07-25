import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Event,
    Content,
} from '../lib/validations/adk.schema';
import { useMemo, useState, useEffect } from 'react';
import api from '@/lib/api';

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
        if (!sessionId) {
            setMessages([]);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        api.adk.getSession(sessionId)
            .then((sessionData) => {
                const events: Event[] = sessionData.data.events || [];
                const filtered = events
                    .filter((e) => e.content)
                    .map((e) => {
                        const content = e.content as Content;
                        return {
                            role: content.role,
                            parts: content.parts,
                            timestamp: e.timestamp,
                            author: e.author,
                        };
                    });
                setMessages(filtered);
                setLoading(false);
            })
            .catch((err) => {
                setError(err);
                setMessages([]);
                setLoading(false);
            });
    }, [sessionId]);

    return { messages, loading, error };
}
