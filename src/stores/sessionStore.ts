import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import api from '@/lib/api';

export interface SessionData {
    id: string;
    appName: string;
    lastUpdateTime: number;
    events: any[];
    state: Record<string, any>;
    userId: string;
}

export interface SessionStore {
    // State
    sessions: SessionData[];
    currentSession: SessionData | null;
    isLoading: boolean;
    error: string | null;
    lastSyncTime: number | null;
    currentUserId: string | null; // Track current user

    // Actions
    setSessions: (sessions: SessionData[]) => void;
    setCurrentSession: (session: SessionData | null) => void;
    addSession: (session: SessionData) => void;
    updateSession: (sessionId: string, updates: Partial<SessionData>) => void;
    removeSession: (sessionId: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setCurrentUserId: (userId: string | null) => void; // Set current user
    clearUserSessions: () => void; // Clear sessions for user logout

    // API Actions
    fetchSessions: (showLoading?: boolean, forceRefresh?: boolean) => Promise<void>;
    fetchSession: (sessionId: string, showLoading?: boolean, forceRefresh?: boolean) => Promise<void>;
    createSession: () => Promise<SessionData | null>;
    syncSessions: () => Promise<void>;

    // Sync Management
    startPeriodicSync: () => void;
    stopPeriodicSync: () => void;
}

const SYNC_INTERVAL = 60000; // 1 minute (reduced frequency since we have better caching)

export const useSessionStore = create<SessionStore>()(
    persist(
        subscribeWithSelector((set, get) => ({
            // Initial state
            sessions: [],
            currentSession: null,
            isLoading: false,
            error: null,
            lastSyncTime: null,
            currentUserId: null,

            // Basic actions
            setSessions: (sessions) => set({ sessions }),
            setCurrentSession: (session) => set({ currentSession: session }),
            addSession: (session) => set((state) => ({
                sessions: [...state.sessions, session]
            })),
            updateSession: (sessionId, updates) => set((state) => ({
                sessions: state.sessions.map(session =>
                    session.id === sessionId ? { ...session, ...updates } : session
                ),
                currentSession: state.currentSession?.id === sessionId
                    ? { ...state.currentSession, ...updates }
                    : state.currentSession
            })),
            removeSession: (sessionId) => set((state) => ({
                sessions: state.sessions.filter(session => session.id !== sessionId),
                currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
            })),
            setLoading: (loading) => set({ isLoading: loading }),
            setError: (error) => set({ error }),
            setCurrentUserId: (userId) => set({ currentUserId: userId }),
            clearUserSessions: () => {
                console.log('🧹 Clearing user sessions');
                set({
                    sessions: [],
                    currentSession: null,
                    lastSyncTime: null,
                    error: null
                });
            },

            // API Actions
            fetchSessions: async (showLoading = true, forceRefresh = false) => {
                const { setLoading, setError, setSessions, sessions, lastSyncTime, currentUserId } = get();

                // Skip if we have recent data and not forcing refresh
                const now = Date.now();
                const timeSinceLastSync = lastSyncTime ? now - lastSyncTime : Infinity;
                const hasRecentData = sessions.length > 0 && timeSinceLastSync < 60000; // 1 minute cache

                if (!forceRefresh && hasRecentData) {
                    return;
                }

                if (showLoading) {
                    setLoading(true);
                }
                setError(null);

                try {
                    const response = await api.adk.listSessions();
                    const allSessions = response.data.sessions || [];

                    // Filter sessions by current user if userId is available
                    const userSessions = currentUserId
                        ? allSessions.filter(session => session.userId === currentUserId)
                        : allSessions;

                    // Convert lastUpdateTime to number if it's a string
                    const processedSessions = userSessions.map(session => ({
                        ...session,
                        lastUpdateTime: typeof session.lastUpdateTime === 'string'
                            ? parseInt(session.lastUpdateTime, 10)
                            : session.lastUpdateTime
                    }));

                    console.log(`📋 Fetched ${processedSessions.length} sessions for user: ${currentUserId || 'unknown'}`);
                    setSessions(processedSessions);
                    set({ lastSyncTime: Date.now() });
                } catch (error) {
                    setError(error instanceof Error ? error.message : 'Failed to fetch sessions');
                } finally {
                    if (showLoading) {
                        setLoading(false);
                    }
                }
            },

            fetchSession: async (sessionId: string, showLoading = true, forceRefresh = false) => {
                const { setLoading, setError, updateSession, setCurrentSession, currentSession, lastSyncTime, currentUserId } = get();

                // Skip if we have recent data for this session and not forcing refresh
                const now = Date.now();
                const timeSinceLastSync = lastSyncTime ? now - lastSyncTime : Infinity;
                const hasRecentSessionData = currentSession?.id === sessionId && timeSinceLastSync < 30000; // 30 seconds cache

                if (!forceRefresh && hasRecentSessionData) {
                    return;
                }

                if (showLoading) {
                    setLoading(true);
                }
                setError(null);

                try {
                    const response = await api.adk.getSession(sessionId);
                    const sessionData = response.data;

                    // Verify the session belongs to the current user
                    if (currentUserId && sessionData.userId !== currentUserId) {
                        throw new Error('Session does not belong to current user');
                    }

                    // Convert lastUpdateTime to number if it's a string
                    const processedSessionData = {
                        ...sessionData,
                        lastUpdateTime: typeof sessionData.lastUpdateTime === 'string'
                            ? parseInt(sessionData.lastUpdateTime, 10)
                            : sessionData.lastUpdateTime
                    };

                    // Update in sessions array
                    updateSession(sessionId, processedSessionData);

                    // Set as current session
                    setCurrentSession(processedSessionData);
                    set({ lastSyncTime: Date.now() });
                } catch (error) {
                    setError(error instanceof Error ? error.message : 'Failed to fetch session');
                } finally {
                    if (showLoading) {
                        setLoading(false);
                    }
                }
            },

            createSession: async () => {
                const { setLoading, setError, addSession, currentUserId } = get();
                setLoading(true);
                setError(null);

                try {
                    const response = await api.adk.createSession();
                    const newSession: SessionData = {
                        ...response.data,
                        events: response.data.events || [],
                        state: response.data.state || {},
                        userId: currentUserId || 'unknown', // Ensure userId is set
                        lastUpdateTime: typeof response.data.lastUpdateTime === 'string'
                            ? parseInt(response.data.lastUpdateTime, 10)
                            : response.data.lastUpdateTime
                    };
                    addSession(newSession);
                    set({ lastSyncTime: Date.now() });
                    return newSession;
                } catch (error) {
                    setError(error instanceof Error ? error.message : 'Failed to create session');
                    return null;
                } finally {
                    setLoading(false);
                }
            },

            syncSessions: async () => {
                const { fetchSessions, currentSession } = get();
                await fetchSessions(false, false); // Don't show loading, don't force refresh

                // If we have a current session, also sync it
                if (currentSession) {
                    await get().fetchSession(currentSession.id, false, false); // Don't show loading, don't force refresh
                }
            },

            // Sync Management
            startPeriodicSync: () => {
                const syncInterval = setInterval(() => {
                    get().syncSessions();
                }, SYNC_INTERVAL);

                // Store the interval ID for cleanup
                (window as any).__sessionSyncInterval = syncInterval;
            },

            stopPeriodicSync: () => {
                const intervalId = (window as any).__sessionSyncInterval;
                if (intervalId) {
                    clearInterval(intervalId);
                    (window as any).__sessionSyncInterval = null;
                }
            },
        })),
        {
            name: 'session-storage',
            partialize: (state) => ({
                sessions: state.sessions,
                currentSession: state.currentSession,
                lastSyncTime: state.lastSyncTime,
                currentUserId: state.currentUserId, // Persist current user ID
            }),
        }
    )
); 