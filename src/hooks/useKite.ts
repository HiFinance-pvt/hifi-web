import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query"

export function useKiteRedirect(requestToken: string) {
    return useQuery({
      queryKey: ["kiteRedirect", requestToken],
      queryFn: () => api.kite.redirect(requestToken)
    });
}