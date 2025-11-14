import React from "react";
import { motion } from "framer-motion";
import { useChat } from "@/hooks/useChat";
import { CustomSessionHeader } from "./CustomSessionHeader";
import { CustomSessionMessage } from "./CustomSessionMessage";
import ChatInput   from "./ChatInput";

interface CustomSessionPanelProps {
  onNewSession?: () => void;
  onSendMessage?: (message: string) => void;
}

export const CustomSessionPanel: React.FC<CustomSessionPanelProps> = ({
  onNewSession,
  onSendMessage,
}) => {
  const { activeSession, createNewSession } = useChat();

  const handleNewSession = () => {
    createNewSession();
    if (onNewSession) {
      onNewSession();
    }
  };

  const handleSendMessage = (message: string) => {
    if (onSendMessage) {
      onSendMessage(message);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900/50 backdrop-blur-sm">
      {/* Session Header */}
      <CustomSessionHeader onNewSession={handleNewSession} />

      {/* Messages Container */}
      <div className="flex-1 overflow-hidden relative">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full bg-gradient-to-br from-[#04A66A]/10 via-transparent to-blue-500/5"></div>
        </div>

        {/* Messages */}
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
          {activeSession?.conversations &&
          activeSession.conversations.length > 0 ? (
            <div className="p-6 space-y-8">
              {activeSession.conversations.map((conversation, index) => (
                <CustomSessionMessage
                  key={conversation.id}
                  conversation={conversation}
                  isLast={index === activeSession.conversations.length - 1}
                />
              ))}
            </div>
          ) : (
            // Empty state
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full p-8"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-[#04A66A] to-teal-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Start a Conversation
              </h3>
              <p className="text-gray-400 text-center max-w-md">
                Begin by asking a question or starting a new topic. Hi-Fi is
                here to assist you with your financial needs.
              </p>
            </motion.div>
          )}
        </div>

        {/* Fade effect at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none"></div>
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-700/50 bg-gray-900/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative group">
            {/* Glowing border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#04A66A]/20 to-teal-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>

            {/* Input container */}
            <div className="relative bg-gray-800/90 backdrop-blur-sm border border-gray-600 rounded-xl shadow-lg hover:border-[#04A66A]/50 transition-all duration-300">
              <ChatInput
                message={""}
                setMessage={handleSendMessage}
                onSend={() => {}}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
