"use client";

import { useKiteRedirect } from "@/hooks/useKite";
import { useRouter, useSearchParams } from "next/navigation";

export default function KiteRedirect() {
  const params = useSearchParams();
  const router = useRouter();
  const requestToken = params.get("request_token");
  if (!requestToken) {
    router.push("/dashboard");
    return null;
  }
  const { data, isPending } = useKiteRedirect(requestToken);

  if (data) {
    router.push("/dashboard");
  }

  if (isPending) {
    return (
      <div className="min-h-screen min-w-screen bg-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-teal-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-teal-400 rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }
}
