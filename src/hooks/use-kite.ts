import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";
import { useEffect } from "react";
export const useKiteConnect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return await api.kite.connect();
    },
    onSuccess: (data) => {
      if (data?.data?.url) {
        const width = 600;
        const height = 800;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;

        const popup = window.open(
          data.data.url,
          "zerodha_login",
          `width=${width},height=${height},left=${left},top=${top}`
        );

        // Poll for status changes after backend processes the callback
        const pollInterval = setInterval(async () => {
          const result = await queryClient.fetchQuery({
            queryKey: ["kite-status"],
            queryFn: async () => {
              try {
                return await api.kite.getIntegrationStatus();
              } catch (error) {
                return { status: "disconnected" };
              }
            },
          });

          const connectedStatus = result?.status || result?.data?.status;

          // Stop polling if connected or popup is closed
          if (connectedStatus === "connected" || popup?.closed) {
            clearInterval(pollInterval);
            if (connectedStatus === "connected") {
              toast.success("Successfully connected to Zerodha");
              queryClient.invalidateQueries({ queryKey: ["kite-status"] });
            }
          }
        }, 2000); // Check every 2 seconds

        // Cleanup polling after 5 minutes to prevent infinite polling
        setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
      } else {
        toast.error("Failed to get connection URL");
      }
    },
    onError: (error) => {
      console.error("Kite connection error:", error);
      toast.error("Failed to initiate connection to Zerodha");
    },
  });
};

export const useKiteIntegration = () => {
  const { data: status, refetch: refetchStatus } = useQuery({
    queryKey: ["kite-status"],
    queryFn: async () => {
      try {
        return await api.kite.getIntegrationStatus();
      } catch (error) {
        return { status: "disconnected" };
      }
    },
    // Don't refetch too aggressively, let user actions drive updates or page loads
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "kite-connected") {
        refetchStatus();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [refetchStatus]);

  const connectMutation = useMutation({
    mutationFn: async ({
      requestToken,
      userId,
    }: {
      requestToken: string;
      userId: string;
    }) => {
      return await api.kite.redirect(requestToken, userId);
    },
    onSuccess: () => {
      toast.success("Successfully connected to Zerodha");
      refetchStatus();
    },
    onError: (error) => {
      console.error("Kite connection error:", error);
      toast.error("Failed to connect to Zerodha");
    },
  });

  const disconnectMutation = useMutation({
    mutationFn: async () => {
      return await api.kite.disconnect();
    },
    onSuccess: () => {
      toast.success("Disconnected from Zerodha");
      refetchStatus();
    },
    onError: (error) => {
      console.error("Kite disconnect error:", error);
      toast.error("Failed to disconnect");
    },
  });

  const currentStatus =
    status?.status || status?.data?.status || "disconnected";
  const lastVerified = status?.lastVerifiedAt || status?.data?.lastVerifiedAt;

  return {
    status: currentStatus,
    lastVerifiedAt: lastVerified,
    connect: connectMutation.mutate,
    isConnecting: connectMutation.isPending,
    disconnect: disconnectMutation.mutate,
    isDisconnecting: disconnectMutation.isPending,
  };
};
