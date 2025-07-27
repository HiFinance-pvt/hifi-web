import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Send, Command, CornerDownLeft, Bot } from "lucide-react";
import { AGENTS } from "@/constants/mockData";

// Keyboard Shortcut Component
const KeyboardShortcut = () => (
  <div className="flex items-center gap-1 text-xs text-gray-500 ml-2">
    <Command className="h-3 w-3" />
    <CornerDownLeft className="h-3 w-3" />
  </div>
);

// Send Button Component
const SendButton = ({ onSend, disabled }: { onSend: () => void; disabled: boolean }) => (
  <button
    onClick={onSend}
    disabled={disabled}
    className="p-3 text-emerald-400 hover:text-emerald-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
  >
    <Send className="h-6 w-6" />
  </button>
);

// Agent Suggestion Item Component
const AgentSuggestionItem = ({ 
  agent, 
  onSelect, 
  isSelected 
}: { 
  agent: (typeof AGENTS)[0]; 
  onSelect: (agent: (typeof AGENTS)[0]) => void;
  isSelected: boolean;
}) => (
  <div
    onClick={() => onSelect(agent)}
    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
      isSelected 
        ? 'bg-emerald-500/20 border-emerald-500/50' 
        : 'hover:bg-gray-700/50 border-transparent'
    } border-l-2`}
  >
    <div 
      className="w-8 h-8 rounded-lg border flex items-center justify-center"
      style={{
        backgroundColor: `${agent.color}20`,
        borderColor: `${agent.color}40`,
      }}
    >
      <img
        src={agent.icon}
        alt={agent.name}
        className="w-4 h-4 object-contain"
      />
    </div>
    <div className="flex-1">
      <div className="font-medium text-white">{agent.name}</div>
      <div className="text-sm text-gray-400 truncate">{agent.description}</div>
    </div>
  </div>
);

// Agent Suggestions Dropdown Component
const AgentSuggestions = ({ 
  agents, 
  onSelect, 
  selectedIndex,
  onClose 
}: { 
  agents: (typeof AGENTS)[0][];
  onSelect: (agent: (typeof AGENTS)[0]) => void;
  selectedIndex: number;
  onClose: () => void;
}) => (
  <div className="absolute bottom-full left-0 right-0 mb-2 bg-gray-800 rounded-lg border border-gray-600 shadow-xl max-h-64 overflow-y-auto z-50">
    <div className="p-2">
      <div className="text-xs text-gray-400 px-4 py-2 border-b border-gray-700">
        Select an agent to call:
      </div>
      {agents.map((agent, index) => (
        <AgentSuggestionItem
          key={agent.id}
          agent={agent}
          onSelect={onSelect}
          isSelected={index === selectedIndex}
        />
      ))}
    </div>
  </div>
);

// Chat Input Component
const ChatInput = ({
  message,
  setMessage,
  onSend,
  disabled = false,
  onAgentSelect,
}: {
  message: string;
  setMessage: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  onAgentSelect?: (agent: (typeof AGENTS)[0]) => void;
}) => {
  const [showAgentSuggestions, setShowAgentSuggestions] = useState(false);
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check if message contains @ and show agent suggestions
  useEffect(() => {
    const hasAtSymbol = message.includes('@');
    setShowAgentSuggestions(hasAtSymbol);
    if (hasAtSymbol) {
      setSelectedAgentIndex(0);
    }
  }, [message]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showAgentSuggestions) {
        // Select the currently highlighted agent
        const selectedAgent = AGENTS[selectedAgentIndex];
        handleAgentSelect(selectedAgent);
      } else {
        onSend();
      }
    } else if (e.key === 'Escape') {
      setShowAgentSuggestions(false);
      setMessage(message.replace(/@$/, ''));
    } else if (showAgentSuggestions) {
      // Handle arrow key navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedAgentIndex((prev) => (prev + 1) % AGENTS.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedAgentIndex((prev) => (prev - 1 + AGENTS.length) % AGENTS.length);
      }
    }
  };

  const handleAgentSelect = (agent: (typeof AGENTS)[0]) => {
    // Replace @ with the agent name
    const newMessage = message.replace(/@.*$/, `@${agent.name} `);
    setMessage(newMessage);
    setShowAgentSuggestions(false);
    
    // Call the onAgentSelect callback if provided
    if (onAgentSelect) {
      onAgentSelect(agent);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    // If user types something after @, hide suggestions
    if (newValue.includes('@') && !newValue.match(/@\s*$/)) {
      setShowAgentSuggestions(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="relative w-full mx-auto">
        <div className="flex items-center bg-gray-700 rounded-lg border border-gray-600 focus-within:border-emerald-500 transition-colors">
          <div className="flex-1 flex items-center px-4 py-3">
            <MessageCircle className="h-5 w-5 text-gray-400 mr-3" />
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Ask questions, or type '@' to call Agent."
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
              disabled={disabled}
            />
            <KeyboardShortcut />
          </div>
          <SendButton onSend={onSend} disabled={disabled || !message.trim()} />
        </div>
        
        {/* Agent Suggestions Dropdown */}
        {showAgentSuggestions && (
          <AgentSuggestions
            agents={AGENTS}
            onSelect={handleAgentSelect}
            selectedIndex={selectedAgentIndex}
            onClose={() => setShowAgentSuggestions(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ChatInput;
