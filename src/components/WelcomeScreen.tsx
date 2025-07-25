"use client";

import React from "react";
import { motion } from "framer-motion";
import { APP_CONFIG, QUICK_ACTIONS } from "@/constants/mockData";
import { QuickAction } from "@/types/chat";
import Particles from "@/ui/components/Particles";

interface WelcomeScreenProps {
  onQuickAction?: (action: QuickAction) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onQuickAction,
}) => {
  const handleQuickActionClick = (action: QuickAction) => {
    onQuickAction?.(action);
  };

  return (
    <div className="flex flex-col items-center h-full justify-center min-h-[60vh] bg-transparent px-6 text-center">
      {/* Welcome Message */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {APP_CONFIG.welcomeMessage.split(" ").map((word, index) => (
            <span key={index}>
              {word === "Hi-Fi!" ? (
                <span className="text-teal-400">Hi-Fi!</span>
              ) : (
                word
              )}
              {index < APP_CONFIG.welcomeMessage.split(" ").length - 1 && " "}
            </span>
          ))}
        </h1>
        <p className="text-xl text-gray-400">{APP_CONFIG.subtitle}</p>
      </div>
      {/* Quick Action Buttons */}

      {/*
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl bg-red-500">
        {QUICK_ACTIONS.slice(0, 2).map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickActionClick(action)}
            className="group relative overflow-hidden rounded-lg bg-gray-800 border border-gray-700 p-4 text-left transition-all duration-200 hover:border-teal-500 hover:bg-gray-700 hover:shadow-lg hover:shadow-teal-500/10"
          >
            <div className="relative z-10">
              <p className="text-gray-200 group-hover:text-white transition-colors">
                {action.text}
              </p>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        ))}
      </div>
      */}
      {/* Additional Actions (Hidden by default, shown on hover or expanded state) */}
      <div className="mt-6 w-full max-w-2xl">
        <details className="group">
          <summary className="cursor-pointer text-gray-400 hover:text-teal-400 transition-colors text-sm font-medium">
            More suggestions
          </summary>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {QUICK_ACTIONS.slice(2).map((action) => (
              <button
                key={action.id}
                onClick={() => handleQuickActionClick(action)}
                className="text-left p-3 rounded-md bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:text-white hover:bg-gray-700/50 hover:border-teal-500/50 transition-all duration-200 text-sm"
              >
                {action.text}
              </button>
            ))}
          </div>
        </details>
      </div>
      {/* Animated Decorative dots */}
    </div>
  );
};
