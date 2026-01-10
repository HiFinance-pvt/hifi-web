"use client";

import { ThemeProvider as ReablocksThemeProvider, theme } from "reablocks";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { usePathname } from "next/navigation";
import HeaderControls from "@/components/HeaderControls";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();

  // Routes that should NOT have the header
  const excludedRoutes = ["/login", "/signup", "/overview"];
  const shouldShowHeader = !excludedRoutes.includes(pathname);

  return (
    <ThemeProvider>
      <ReablocksThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <div className="flex h-screen bg-[var(--background)] transition-colors duration-300">
              {/* Shared Header Controls */}
              {shouldShowHeader && <HeaderControls />}
              {children}
            </div>
            <Toaster 
              theme="dark"
              toastOptions={{
                style: {
                  background: 'var(--surface)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--surface-border)',
                },
              }}
            />
          </AuthProvider>
        </QueryClientProvider>
      </ReablocksThemeProvider>
    </ThemeProvider>
  );
}
