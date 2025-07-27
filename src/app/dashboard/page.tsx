"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore } from "@/stores/sessionStore";
import { SessionCreationLoader } from "@/components/ui/CustomLoader";

export default function DashboardRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    sessions,
    isLoading: sessionsLoading,
    fetchSessions,
    createSession,
    checkUserChange
  } = useSessionStore();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Extract query parameters
  const agent = searchParams?.get("agent");

  useEffect(() => {
    // Check if user has changed and clear sessions if needed
    checkUserChange();

    // Fetch sessions on mount only if we don't have any
    if (sessions.length === 0) {
      fetchSessions();
    }
  }, [fetchSessions, sessions.length, checkUserChange]);

  useEffect(() => {
    if (!sessionsLoading) {
      if (agent) {
        // Always create a new session when coming from an agent page
        console.log(`🤖 Creating new session for agent: ${agent}`);
        setIsCreatingSession(true);
        createSession()
          .then((newSession) => {
            if (newSession) {
              const queryString = `?agent=${encodeURIComponent(agent)}`;
              console.log(
                `✅ New session created for ${agent}, redirecting to: /dashboard/${newSession.id}${queryString}`
              );
              router.replace(`/dashboard/${newSession.id}${queryString}`);
            }
            setIsCreatingSession(false);
          })
          .catch(() => {
            console.error(`❌ Failed to create session for agent: ${agent}`);
            setIsCreatingSession(false);
          });
      } else if (sessions && sessions.length > 0) {
        // Redirect to the first available session when no agent specified
        const firstSession = sessions[0];
        router.replace(`/dashboard/${firstSession.id}`);
      } else {
        // Create a new session if none exist and no agent specified
        setIsCreatingSession(true);
        createSession()
          .then((newSession) => {
            if (newSession) {
              router.replace(`/dashboard/${newSession.id}`);
            }
            setIsCreatingSession(false);
          })
          .catch(() => {
            setIsCreatingSession(false);
          });
      }
    }
  }, [sessions, sessionsLoading, createSession, router, agent]);

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
              : "Creating new session..."}
          </p>
        </div>
      )}
    </div>
  );
}
