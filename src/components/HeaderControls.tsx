"use client";

import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQueryClient } from "@tanstack/react-query";
import { useCheckSession } from "@/hooks/useCheckSession";
import { env } from "@/lib/env";
import { Globe, Wifi, WifiOff, Bell, X } from "lucide-react";
import { LanguageSelector } from "@/components/LanguageSelector";

// Header Controls Component
const HeaderControls: React.FC = () => {
  const [showFiTooltip, setShowFiTooltip] = useState(false);
  const [showConnectionPopup, setShowConnectionPopup] = useState(false);
  const [sessionId, setSessionId] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, error, isPending } = useCheckSession(sessionId);

  const handleFiToggle = () => {
    const sessionId = `mcp-server-${uuidv4()}`;
    setSessionId(sessionId);
    window.open(
      `${env.NEXT_PUBLIC_FI_MCP_SERVER_URL}/mockWebPage?sessionId=${sessionId}`
    );
    queryClient.invalidateQueries({ queryKey: ["check-session", sessionId] });
  };

  return (
    <>
      <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50 flex items-center space-x-2 sm:space-x-3">
        {/* Functional Language Selector with Translation */}
        <LanguageSelector />

        {/* Fi Toggle - Circular Design */}
        <div
          className="relative"
          onMouseEnter={() => setShowFiTooltip(true)}
          onMouseLeave={() => setShowFiTooltip(false)}
        >
          <button
            onClick={handleFiToggle}
            className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 backdrop-blur-sm transition-all duration-200 flex items-center justify-center ${
              data?.valid
                ? "bg-emerald-500/20 border-emerald-500/50 hover:bg-emerald-500/30"
                : "bg-red-500/20 border-red-500/50 hover:bg-red-500/30"
            }`}
          >
            {/* Outer glow ring */}
            <div
              className={`absolute inset-0 rounded-full animate-pulse ${
                data?.valid ? "bg-emerald-400/20" : "bg-red-400/20"
              }`}
            />

            {/* Fi icon in center */}
            <div className="relative z-10 flex items-center justify-center">
              <img
                src={
                  data?.valid
                    ? "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IehfPx9KyJ8jNPpV24cHROwYQuxMUoLIv9n6S"
                    : "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IVSvVCH71tHP9Q3GfOo7m650V8qacgeNAFTyE"
                }
                alt={data?.valid ? "Fi Connected" : "Fi DisconfiConnected"}
                className="w-3 h-3 sm:w-4 sm:h-4 object-contain relative z-10 drop-shadow-md"
                style={{
                  filter: "brightness(1.2) contrast(1.1)",
                  maxWidth: "16px",
                  maxHeight: "16px",
                }}
                onError={(e) => {
                  // Fallback to text if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  const fallback = document.createElement("span");
                  fallback.textContent = "Fi";
                  fallback.className = `text-sm font-bold ${
                    data?.valid ? "text-emerald-400" : "text-red-400"
                  }`;
                  target.parentNode?.appendChild(fallback);
                }}
              />
            </div>

            {/* Status dot at bottom border */}
            <div
              className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full border border-gray-900 ${
                data?.valid ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
          </button>

          {/* Tooltip */}
          {showFiTooltip && (
            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-1.5 bg-gray-900/95 border border-gray-700/50 rounded-lg backdrop-blur-sm text-xs text-gray-300 whitespace-nowrap">
              {data?.valid ? "Fi Connected" : "Connect to Fi"}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-700/50" />
            </div>
          )}
        </div>

        {/* Notification Bell - Always present */}
        <div className="relative">
          <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-900/80 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-200 flex items-center justify-center">
            <Bell className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
            {/* Notification dot */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border border-gray-900" />
          </button>
        </div>
      </div>

      {/* Connection Status Popup */}
      {showConnectionPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-900/95 border border-gray-700/50 rounded-2xl p-6 max-w-md mx-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                Connection Status
              </h3>
              <button
                onClick={() => setShowConnectionPopup(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-3 mb-4">
              {data?.valid ? (
                <Wifi className="w-6 h-6 text-emerald-400" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-400" />
              )}
              <div>
                <p className="text-white font-medium">
                  {data?.valid ? "Connected to Fi" : "Disconnected from Fi"}
                </p>
                <p className="text-gray-400 text-sm">
                  {data?.valid
                    ? "All services are running normally"
                    : "Please check your connection"}
                </p>
              </div>
            </div>
            {!data?.valid && (
              <button
                onClick={handleFiToggle}
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
              >
                Reconnect to Fi
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default HeaderControls;
