"use client";

import { useKiteRedirect } from "@/hooks/useKite";
import { useParams, useRouter } from "next/navigation";

export function KiteRedirect() {
  const params = useParams<{ request_token: string }>();
  const router = useRouter();
  const { data, isPending } = useKiteRedirect(params.request_token);

  if (data) {
    router.push("/agents/tarder-agent");
  }
}
