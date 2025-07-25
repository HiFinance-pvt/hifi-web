import React from "react";
import { MessageCircle, Send, Command, CornerDownLeft } from "lucide-react";

// Keyboard Shortcut Component
const KeyboardShortcut = () => (
  <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
    <Command className="h-3 w-3" />
    <CornerDownLeft className="h-3 w-3" />
  </div>
);

// Send Button Component
const SendButton = () => (
  <button className="p-3 text-emerald-400 hover:text-emerald-300 transition-colors">
    <Send className="h-6 w-6" />
  </button>
);

// Chat Input Component
const ChatInput = ({
  message,
  setMessage,
}: {
  message: string;
  setMessage: (value: string) => void;
}) => (
  <div className="mb-8">
    <div className="relative w-full mx-auto">
      <div className="flex items-center bg-gray-700 rounded-lg border border-gray-600 focus-within:border-emerald-500 transition-colors">
        <div className="flex-1 flex items-center px-4 py-3">
          <MessageCircle className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            defaultValue={message}
            // value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask questions, or type '@' to call Agent."
            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
          />
          <KeyboardShortcut />
        </div>
        <SendButton />
      </div>
    </div>
  </div>
);

export default ChatInput;
