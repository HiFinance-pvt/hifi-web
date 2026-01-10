"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { useCheckSession } from "@/hooks/useCheckSession";
import { env } from "@/lib/env";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

const HeaderControls: React.FC = () => {
  const [language, setLanguage] = useState("EN");
  const [showFiTooltip, setShowFiTooltip] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const queryClient = useQueryClient();

  const { data } = useCheckSession(sessionId);

  const languages = [
    { code: "EN", name: "English" },
    { code: "HI", name: "हिंदी" },
    { code: "GU", name: "ગુજરાતી" },
    { code: "MR", name: "मराठी" },
  ];

  const handleFiToggle = () => {
    const newSessionId = `mcp-server-${uuidv4()}`;
    setSessionId(newSessionId);
    window.open(
      `${env.NEXT_PUBLIC_FI_MCP_SERVER_URL}/mockWebPage?sessionId=${newSessionId}`
    );
    queryClient.invalidateQueries({ queryKey: ["check-session", newSessionId] });
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* Language Selector */}
      <div className="relative">
        <button
          onClick={() => setShowLangDropdown(!showLangDropdown)}
          className="flex items-center gap-1.5 px-3 py-2.5 h-10
                     bg-[var(--surface)] border border-[var(--surface-border)] 
                     rounded-xl hover:border-[var(--brand-primary)]/30
                     transition-all duration-200"
        >
          {/* Globe icon - minimal */}
          <svg className="w-4 h-4 text-[var(--foreground-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="12" cy="12" r="10" />
            <ellipse cx="12" cy="12" rx="4" ry="10" />
            <path d="M2 12h20" />
          </svg>
          <span className="text-sm font-medium text-[var(--foreground)]">{language}</span>
        </button>

        {showLangDropdown && (
          <div className="absolute top-full mt-2 right-0 w-36 
                          bg-[var(--surface)] border border-[var(--surface-border)] 
                          rounded-xl overflow-hidden shadow-lg">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setShowLangDropdown(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm font-medium
                            hover:bg-[var(--surface-hover)] transition-colors
                            ${language === lang.code 
                              ? "text-[var(--brand-primary)]" 
                              : "text-[var(--foreground)]"}`}
              >
                {lang.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fi Connection */}
      <div
        className="relative"
        onMouseEnter={() => setShowFiTooltip(true)}
        onMouseLeave={() => setShowFiTooltip(false)}
      >
        <button
          onClick={handleFiToggle}
          className={`relative w-10 h-10 rounded-xl border
                      transition-all duration-200 
                      flex items-center justify-center
                      ${data?.valid
                        ? "bg-[var(--success-bg)] border-[var(--success)]/30"
                        : "bg-[var(--error-bg)] border-[var(--error)]/30"}`}
        >
          <img
            src={
              data?.valid
                ? "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IehfPx9KyJ8jNPpV24cHROwYQuxMUoLIv9n6S"
                : "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IVSvVCH71tHP9Q3GfOo7m650V8qacgeNAFTyE"
            }
            alt={data?.valid ? "Connected" : "Disconnected"}
            className="w-4 h-4 object-contain"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
            }}
          />
          
          {/* Status dot */}
          <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full 
                          border-2 border-[var(--background)]
                          ${data?.valid ? "bg-[var(--success)]" : "bg-[var(--error)]"}`} />
        </button>

        {/* Tooltip */}
        {showFiTooltip && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 
                          px-3 py-1.5 bg-[var(--surface)] border border-[var(--surface-border)] 
                          rounded-lg text-xs font-medium text-[var(--foreground)] 
                          whitespace-nowrap shadow-md">
            {data?.valid ? "Fi Connected" : "Connect to Fi"}
          </div>
        )}
      </div>

      {/* Notification */}
      <button className="relative w-10 h-10 rounded-xl 
                        bg-[var(--surface)] border border-[var(--surface-border)] 
                        hover:border-[var(--brand-primary)]/30
                        transition-all duration-200 flex items-center justify-center">
        {/* Bell icon - minimal */}
        <svg className="w-[18px] h-[18px] text-[var(--foreground-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path d="M18 8A6 6 0 106 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        
        {/* Notification dot */}
        <div className="absolute top-2 right-2 w-2 h-2 bg-[var(--brand-primary)] rounded-full" />
      </button>
    </div>
  );
};

export default HeaderControls;
