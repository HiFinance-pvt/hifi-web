"use client";
import { ThemeProvider, theme } from "reablocks";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { usePathname } from "next/navigation";
import HeaderControls from "@/components/HeaderControls";

// Client component wrapper for client-side logic
export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const pathname = usePathname();

    // Routes that should NOT have the header
    const excludedRoutes = ["/login", "/signup", "/overview"];
    const shouldShowHeader = !excludedRoutes.includes(pathname);

    return (
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    <div className="flex h-screen bg-gray-900">
                        {/* Shared Header Controls - Excluded from login, signup, overview */}
                        {shouldShowHeader && <HeaderControls />}
                        {children}
                    </div>
                    <Toaster />
                </AuthProvider>
            </QueryClientProvider>
        </ThemeProvider>
    );
} 