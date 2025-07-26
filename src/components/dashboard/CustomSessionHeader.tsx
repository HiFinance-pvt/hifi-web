import React from "react";
import { motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";

interface CustomSessionHeaderProps {
  onNewSession?: () => void;
}

export const CustomSessionHeader: React.FC<CustomSessionHeaderProps> = ({
  onNewSession,
}) => {
  const { activeSession, activeSessionId } = useChat();

  const handleNewSession = () => {
    if (onNewSession) {
      onNewSession();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50"
    >
      <div className="p-4 flex items-center justify-between">
        {/* Session Title */}
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-[#04A66A] rounded-full animate-pulse"></div>
          <div>
            <h2 className="text-lg font-semibold text-white">
              {activeSession?.title || "New Chat"}
            </h2>
            <p className="text-sm text-gray-400">
              {activeSession ? "Active session" : "Start a new conversation"}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {/* New Chat Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNewSession}
            className="px-4 py-2 bg-[#04A66A] hover:bg-[#04A66A]/80 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>New Chat</span>
          </motion.button>

          {/* Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-300 rounded-lg transition-all duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </motion.button>
        </div>
      </div>

      {/* Subtle gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#04A66A]/30 to-transparent"></div>
    </motion.div>
  );
}; 