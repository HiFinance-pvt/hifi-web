"use client";

import React from "react";
import { APP_CONFIG, QUICK_ACTIONS } from "@/constants/mockData";
import { QuickAction } from "@/types/chat";

interface WelcomeScreenProps {
  onQuickAction?: (action: QuickAction) => void;
}

// Minimal line icons
const icons = {
  chart: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 3v18h18M7 16l4-4 4 4 5-6" />
    </svg>
  ),
  wallet: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="6" width="20" height="14" rx="2" />
      <path d="M16 12h.01M2 10h20" />
    </svg>
  ),
  shield: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  target: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
};

const iconList = [icons.chart, icons.wallet, icons.shield, icons.target];

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onQuickAction }) => {
  return (
    <div className="flex flex-col items-center h-full justify-center min-h-[60vh] px-6 text-center">
      {/* Subtle glow background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] 
                      bg-[var(--gradient-glow)] pointer-events-none opacity-60" />
      
      {/* Welcome */}
      <div className="relative mb-10">
        <h1 className="text-4xl md:text-5xl font-semibold text-[var(--foreground)] mb-3 tracking-tight">
          {APP_CONFIG.welcomeMessage.split(" ").map((word, index) => (
            <span key={index}>
              {word === "Hi-Fi!" ? (
                <span className="text-[var(--brand-primary)]">Hi-Fi!</span>
              ) : (
                word
              )}
              {index < APP_CONFIG.welcomeMessage.split(" ").length - 1 && " "}
            </span>
          ))}
        </h1>
        
        <p className="text-lg text-[var(--foreground-muted)] font-normal">
          {APP_CONFIG.subtitle}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="relative w-full max-w-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {QUICK_ACTIONS.slice(0, 4).map((action, index) => (
            <button
              key={action.id}
              onClick={() => onQuickAction?.(action)}
              className="group flex items-start gap-3 p-4 rounded-2xl text-left
                        bg-[var(--surface)] border border-[var(--surface-border)]
                        hover:border-[var(--brand-primary)]/30
                        transition-all duration-200"
            >
              <div className="p-2 rounded-xl bg-[var(--brand-primary-muted)] text-[var(--brand-primary)]
                            group-hover:bg-[var(--brand-primary)] group-hover:text-white
                            transition-colors duration-200">
                {iconList[index % iconList.length]}
              </div>
              <p className="text-[var(--foreground-secondary)] group-hover:text-[var(--foreground)] 
                          font-medium text-sm leading-relaxed transition-colors line-clamp-2">
                {action.text}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* More suggestions */}
      {QUICK_ACTIONS.length > 4 && (
        <div className="mt-6 w-full max-w-2xl">
          <details className="group">
            <summary className="cursor-pointer text-[var(--foreground-subtle)] hover:text-[var(--brand-primary)] 
                              text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              <span>More suggestions</span>
              <svg className="w-4 h-4 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {QUICK_ACTIONS.slice(4).map((action) => (
                <button
                  key={action.id}
                  onClick={() => onQuickAction?.(action)}
                  className="text-left p-3 rounded-xl
                            border border-[var(--surface-border)]/50
                            text-[var(--foreground-muted)] 
                            hover:text-[var(--foreground)] 
                            hover:border-[var(--brand-primary)]/20 
                            transition-all duration-150 text-sm"
                >
                  {action.text}
                </button>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};
