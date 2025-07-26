"use client";

import { useKiteRedirect } from "@/hooks/useKite";
import { useParams, useRouter } from "next/navigation";

export default function KiteRedirect() {
  const params = useParams<{ request_token: string }>();
  const router = useRouter();
  const requestToken = params?.request_token;

  const { data, isPending } = useKiteRedirect(requestToken ?? "");

  if (data) {
    router.push("/agents/trader-agent");
  }
}
