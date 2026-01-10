import { create } from "zustand";
import { persist } from "zustand/middleware";
import { subscribeWithSelector } from "zustand/middleware";
import api from "@/lib/api";
import { getCurrentUser } from "@/lib/firebase/firebase";

export interface SessionData {
  id: string;
  appName: string;
  session_name?: string | null;
  lastUpdateTime: string | number;
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
  currentUserId: string | null;

  // Actions
  setSessions: (sessions: SessionData[]) => void;
  setCurrentSession: (session: SessionData | null) => void;
  addSession: (session: SessionData) => void;
  updateSession: (sessionId: string, updates: Partial<SessionData>) => void;
  removeSession: (sessionId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setCurrentUserId: (userId: string | null) => void;
  clearSessions: () => void;
  checkUserChange: () => void;

  // API Actions
  fetchSessions: (
    showLoading?: boolean,
    forceRefresh?: boolean
  ) => Promise<void>;
  fetchSession: (
    sessionId: string,
    showLoading?: boolean,
    forceRefresh?: boolean
  ) => Promise<void>;
  createSession: () => Promise<SessionData | null>;
  syncSessions: () => Promise<void>;

  // Sync Management
  startPeriodicSync: () => void;
  stopPeriodicSync: () => void;
}

const SYNC_INTERVAL = 60000; // 1 minute (reduced frequency since we have better caching)
// createSession stale/dedupe configuration
const CREATE_SESSION_STALE_MS = 30 * 1000; // 30 seconds

// Closure-scoped dedupe state (not persisted)
let createSessionPromise: Promise<SessionData | null> | null = null;
let lastCreateTimestamp: number | null = null;
let lastCreatedSession: SessionData | null = null;

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
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),
      updateSession: (sessionId, updates) =>
        set((state) => ({
          sessions: state.sessions.map((session) =>
            session.id === sessionId ? { ...session, ...updates } : session
          ),
          currentSession:
            state.currentSession?.id === sessionId
              ? { ...state.currentSession, ...updates }
              : state.currentSession,
        })),
      removeSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter(
            (session) => session.id !== sessionId
          ),
          currentSession:
            state.currentSession?.id === sessionId
              ? null
              : state.currentSession,
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setCurrentUserId: (userId) => set({ currentUserId: userId }),
      clearSessions: () => set({ sessions: [] }),

      // Check if user has changed and clear sessions if needed
      checkUserChange: () => {
        const { currentUserId, clearSessions, setCurrentUserId } = get();
        const currentUser = getCurrentUser();

        if (currentUser) {
          const newUserId = currentUser.uid;
          if (currentUserId && currentUserId !== newUserId) {

            clearSessions();
            setCurrentUserId(newUserId);
          } else if (!currentUserId) {
            setCurrentUserId(newUserId);
          }
        } else {
          if (currentUserId) {
            clearSessions();
            setCurrentUserId(null);
          }
        }
      },

      // API Actions
      fetchSessions: async (showLoading = true, forceRefresh = false) => {
        const {
          setLoading,
          setError,
          setSessions,
          sessions,
          lastSyncTime,
          currentUserId,
        } = get();

        // Get current user ID if not already set
        let userId = currentUserId;
        if (!userId) {
          const currentUser = getCurrentUser();
          if (currentUser) {
            userId = currentUser.uid;
            set({ currentUserId: userId });
          } else {
            console.warn("No current user found, cannot fetch sessions");
            setError("No authenticated user found");
            return;
          }
        }

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

          // Filter sessions by current user ID
          const userSessions = allSessions.filter(
            (session: any) => session.userId === userId
          );

          // Normalize session objects to match SessionData shape (ensure lastUpdateTime is defined)
          const normalizedSessions: SessionData[] = userSessions.map(
            (s: any) => ({
              id: s.id,
              appName: s.appName ?? "",
              session_name: s.session_name ?? null,
              lastUpdateTime:
                s.lastUpdateTime ?? s.updatedAt ?? s.createdAt ?? Date.now(),
              events: s.events ?? [],
              state: s.state ?? {},
              userId: s.userId ?? userId,
            })
          );

          setSessions(normalizedSessions);
          set({ lastSyncTime: Date.now() });
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Failed to fetch sessions"
          );
        } finally {
          if (showLoading) {
            setLoading(false);
          }
        }
      },

      fetchSession: async (
        sessionId: string,
        showLoading = true,
        forceRefresh = false
      ) => {
        const {
          setLoading,
          setError,
          updateSession,
          setCurrentSession,
          currentSession,
          lastSyncTime,
        } = get();

        // Skip if we have recent data for this session and not forcing refresh
        const now = Date.now();
        const timeSinceLastSync = lastSyncTime ? now - lastSyncTime : Infinity;
        const hasRecentSessionData =
          currentSession?.id === sessionId && timeSinceLastSync < 30000; // 30 seconds cache

        if (!forceRefresh && hasRecentSessionData) {
          return;
        }

        if (showLoading) {
          setLoading(true);
        }
        setError(null);

        try {
          const response = await api.adk.getSession(sessionId);
          const raw = response.data as any;

          // Normalize into our SessionData shape, ensuring lastUpdateTime is never null
          const fullSession: SessionData = {
            id: raw.id ?? sessionId,
            appName: raw.appName ?? "",
            session_name: raw.session_name ?? null,
            lastUpdateTime:
              raw.lastUpdateTime ??
              raw.updatedAt ??
              raw.createdAt ??
              Date.now(),
            events: raw.events ?? [],
            state: raw.state ?? {},
            userId: raw.userId ?? get().currentUserId ?? "",
          };

          // Update in sessions array
          updateSession(sessionId, fullSession);

          // Set as current session
          setCurrentSession(fullSession);
          set({ lastSyncTime: Date.now() });
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "Failed to fetch session"
          );
        } finally {
          if (showLoading) {
            setLoading(false);
          }
        }
      },

      createSession: async () => {
        const { setLoading, setError, addSession, currentUserId, clearSessions } = get();

        // ALWAYS get the current user from Firebase to ensure we have the correct user
        const currentUser = getCurrentUser();
        if (!currentUser) {
          console.warn("No current user found, cannot create session");
          setError("No authenticated user found");
          return null;
        }

        const userId = currentUser.uid;
        
        // Check if user has changed and clear stale data
        if (currentUserId && currentUserId !== userId) {
          console.log("User changed, clearing stale session data");
          clearSessions();
          // Also clear the closure-scoped cache
          lastCreateTimestamp = null;
          lastCreatedSession = null;
        }
        
        // Update currentUserId in store
        if (currentUserId !== userId) {
          set({ currentUserId: userId });
        }

        // If there's an in-flight create, return the same promise
        if (createSessionPromise) {
          return createSessionPromise;
        }

        // If we recently created a session and it's still within the stale window, return cached session
        // But only if the cached session belongs to the current user
        if (
          lastCreateTimestamp &&
          Date.now() - lastCreateTimestamp < CREATE_SESSION_STALE_MS &&
          lastCreatedSession &&
          lastCreatedSession.userId === userId
        ) {
          return Promise.resolve(lastCreatedSession);
        }

        // Otherwise start a new create request and store the promise for deduping
        createSessionPromise = (async () => {
          setLoading(true);
          setError(null);

          try {
            const response = await api.adk.createSession();

            // Normalize different response shapes into our SessionData shape
            const raw = response.data as any;
            const id =
              raw.id ?? raw.sessionId ?? (raw.data && raw.data.sessionId) ?? "";
            const userIdFromResp =
              raw.userId ?? (raw.data && raw.data.userId) ?? null;
            const appName = raw.appName ?? (raw.data && raw.data.appName) ?? "";
            const events = raw.events ?? (raw.data && raw.data.events) ?? [];
            const state = raw.state ?? (raw.data && raw.data.state) ?? {};
            const session_name =
              raw.session_name ?? (raw.data && raw.data.session_name) ?? null;
            const lastUpdateTime =
              raw.lastUpdateTime ??
              raw.updatedAt ??
              raw.createdAt ??
              Date.now();

            if (!id) {
              console.error(
                "createSession: could not determine session id from response",
                raw
              );
              setError("Session creation failed - invalid response");
              return null;
            }

            const newSession: SessionData = {
              id,
              appName,
              session_name,
              lastUpdateTime,
              events,
              state,
              userId: userIdFromResp ?? userId,
            };

            // Verify the session belongs to the current user
            if (newSession.userId !== userId) {
              console.warn("Created session does not belong to current user", {
                newSessionUserId: newSession.userId,
                currentUserId: userId,
              });
              setError("Session creation failed - user mismatch");
              return null;
            }

            addSession(newSession);
            set({ lastSyncTime: Date.now() });

            // Cache the successful creation
            lastCreateTimestamp = Date.now();
            lastCreatedSession = newSession;

            return newSession;
          } catch (error) {
            setError(
              error instanceof Error
                ? error.message
                : "Failed to create session"
            );
            return null;
          } finally {
            setLoading(false);
            // clear the in-flight promise so subsequent calls can start a new request after stale window
            createSessionPromise = null;
          }
        })();

        return createSessionPromise;
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
      name: "session-storage",
      partialize: (state) => ({
        sessions: state.sessions,
        currentSession: state.currentSession,
        lastSyncTime: state.lastSyncTime,
        currentUserId: state.currentUserId,
      }),
    }
  )
);
