"use client";
import React from "react";
import Sidenav from "@/components/sidenav/Sidenav";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen flex">
        <div className="flex-1 grow h-full">{children}</div>
    </div>
  );
};

export default layout;