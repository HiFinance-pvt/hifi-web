"use client";

import { useKiteIntegration } from "@/hooks/use-kite";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function KiteRedirect() {
  const params = useSearchParams();
  const router = useRouter();
  const requestToken = params.get("request_token");
  
  const { connect, isConnecting } = useKiteIntegration();
  const hasConnected = useRef(false);

  useEffect(() => {
    if (requestToken && !hasConnected.current) {
      hasConnected.current = true;
      connect(requestToken, {
        onSuccess: () => {
          if (window.opener) {
            window.opener.postMessage("kite-connected", "*");
            window.close();
          } else {
            router.push("/dashboard");
          }
        },
        onError: () => {
             // Handle error, maybe show a message or redirect
             setTimeout(() => router.push("/settings"), 3000);
        }
      });
    } else if (!requestToken) {
        router.push("/dashboard");
    }
  }, [requestToken, connect, router]);

  if (isConnecting || (requestToken && !hasConnected.current)) {
    return (
      <div className="min-h-screen min-w-screen bg-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-teal-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-teal-400 rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }

  return null;
}
