"use client";
import React from "react";
import Sidenav from "@/components/sidenav/Sidenav";
import { AuthGuard } from "@/components/AuthGuard";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <div className="w-full min-h-screen flex">
        <div className="flex-1 grow h-full">{children}</div>
      </div>
    </AuthGuard>
  );
};

export default layout;