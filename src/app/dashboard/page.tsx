"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/stores/sessionStore";
import { SessionCreationLoader } from "@/components/ui/CustomLoader";

export default function DashboardRedirect() {
  const router = useRouter();
  const { sessions, isLoading: sessionsLoading, fetchSessions, createSession, checkUserChange } = useSessionStore();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

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
      if (sessions && sessions.length > 0) {
        // Redirect to the first available session
        const firstSession = sessions[0];
        router.replace(`/dashboard/${firstSession.id}`);
      } else {
        // Create a new session if none exist
        setIsCreatingSession(true);
        createSession().then((newSession) => {
          if (newSession) {
            router.replace(`/dashboard/${newSession.id}`);
          }
          setIsCreatingSession(false);
        }).catch(() => {
          setIsCreatingSession(false);
        });
      }
    }
  }, [sessions, sessionsLoading, createSession, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {isCreatingSession ? (
        <SessionCreationLoader />
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">
            {sessionsLoading ? "Loading dashboard..." : "Creating new session..."}
          </p>
        </div>
      )}
    </div>
  );
}
