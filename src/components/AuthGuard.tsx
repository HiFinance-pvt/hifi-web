"use client";

import { FC, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { env } from '@/lib/env';

interface AuthGuardProps {
  children: ReactNode;
}

export const AuthGuard: FC<AuthGuardProps> = ({ children }) => {
  // const { currentUser, loading } = useAuth();
  const router = useRouter();
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!currentUser || !localStorage.getItem(env.NEXT_PUBLIC_SSID) || loading) {
      router.push('/login');
    }
  }, [router]);

  // Show loading spinner while checking authentication
  if (!localStorage.getItem(env.NEXT_PUBLIC_SSID) || loading || !currentUser) {
    return (
      <div className="min-h-screen min-w-screen bg-gray-900 flex items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-teal-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-teal-400 rounded-full animate-ping"></div>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!localStorage.getItem(env.NEXT_PUBLIC_SSID) || loading || !currentUser ) {
    return null;
  }

  return <>{children}</>;
}; 