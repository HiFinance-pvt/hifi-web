import { checkMCPSession } from "@/lib/api/mcp";
import { useQuery } from "@tanstack/react-query";

export function useCheckSession(sessionId: string) {
  return useQuery({
    queryKey: ["check-session", sessionId],
    queryFn: () => checkMCPSession(sessionId),
  });
}
