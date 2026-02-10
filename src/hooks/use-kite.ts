import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "sonner";

export const useKiteConnect = () => {
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
        
        window.open(
          data.data.url,
          "zerodha_login",
          `width=${width},height=${height},left=${left},top=${top}`
        );
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
