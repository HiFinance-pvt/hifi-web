"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSessionStore } from "@/stores/sessionStore";
import { SessionCreationLoader } from "@/components/ui/CustomLoader";

export default function DashboardRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createSession, checkUserChange } = useSessionStore();
  const [isCreatingSession, setIsCreatingSession] = useState(false);

  // Refs to dedupe in-flight requests and avoid setting state after unmount
  const createSessionPromiseRef = useRef<Promise<any> | null>(null);
  const unmountedRef = useRef(false);

  // Extract query parameters
  const agent = searchParams.get("agent");

  // Create a session exactly once (deduped) and return the promise
  const createNewSession = async () => {
    if (createSessionPromiseRef.current) return createSessionPromiseRef.current;

    setIsCreatingSession(true);

    const p = (async () => {
      try {
        const newSession = await createSession();
        return newSession;
      } catch (err) {
        throw err;
      } finally {
        createSessionPromiseRef.current = null;
        if (!unmountedRef.current) setIsCreatingSession(false);
      }
    })();

    createSessionPromiseRef.current = p;
    return p;
  };

  useEffect(() => {
    unmountedRef.current = false;

    // Ensure session store state is reset/validated for the current user
    // checkUserChange();

    // Immediately create a session when landing on /dashboard
    // We intentionally don't fetch existing sessions here — the UX required
    // is to always create a fresh session and redirect to it.
    createNewSession()
      .then((newSession) => {
        if (newSession && newSession.id) {
          const queryString = agent ? `?agent=${encodeURIComponent(agent)}` : "";
          router.replace(`/dashboard/${newSession.id}${queryString}`);
        } else {
          console.error("❌ createSession returned no session or missing id");
        }
      })
      .catch((err) => {
        console.error("❌ Failed to create session on dashboard arrival:", err);
      });

    return () => {
      unmountedRef.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      {isCreatingSession ? (
        <SessionCreationLoader />
      ) : (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Creating new session...</p>
        </div>
      )}
    </div>
  );
}
