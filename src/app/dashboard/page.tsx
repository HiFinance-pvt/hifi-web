"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/sessionStore";
import { SessionCreationLoader } from "@/components/ui/CustomLoader";

export default function DashboardRedirect() {
  const router = useRouter();
  const {
    sessions,
    isLoading: sessionsLoading,
    fetchSessions,
    createSession,
  } = useSessionStore();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Use refs to track state and prevent multiple executions
  const hasRedirected = useRef(false);
  const isCreatingRef = useRef(false);
  const hasFetchedInitially = useRef(false);

  useEffect(() => {
    // Fetch sessions only once on mount
    if (
      !hasFetchedInitially.current &&
      sessions.length === 0 &&
      !sessionsLoading
    ) {
      hasFetchedInitially.current = true;
      fetchSessions();
    }
  }, [fetchSessions, sessions.length, sessionsLoading]);

  useEffect(() => {
    // Prevent multiple executions and redirects
    if (hasRedirected.current || sessionsLoading || isCreatingRef.current) {
      return;
    }

    if (sessions && sessions.length > 0) {
      // Redirect to the first available session
      hasRedirected.current = true;
      const firstSession = sessions[0];
      router.replace(`/dashboard/${firstSession.id}`);
    } else if (hasFetchedInitially.current && sessions.length === 0) {
      // Only create session if we've fetched initially and there are no sessions
      isCreatingRef.current = true;
      setIsCreatingSession(true);

      createSession()
        .then((newSession) => {
          if (newSession && !hasRedirected.current) {
            hasRedirected.current = true;
            router.replace(`/dashboard/${newSession.id}`);
          }
        })
        .catch((error) => {
          console.error("Failed to create session:", error);
        })
        .finally(() => {
          isCreatingRef.current = false;
          setIsCreatingSession(false);
        });
    }
  }, [sessions, sessionsLoading, router]); // Removed createSession from dependencies

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {isCreatingSession ? (
        <SessionCreationLoader />
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">
            {sessionsLoading
              ? "Loading dashboard..."
              : "Setting up your workspace..."}
          </p>
        </div>
      )}
    </div>
  );
}
