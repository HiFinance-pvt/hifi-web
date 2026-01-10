import React, { useState, useEffect, useRef } from "react";
import { AGENTS } from "@/constants/mockData";

// Minimal SVG Icons
const MessageIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);

const SendIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
);

// Agent Suggestion Item
const AgentSuggestionItem = ({ 
  agent, 
  onSelect, 
  isSelected 
}: { 
  agent: (typeof AGENTS)[0]; 
  onSelect: (agent: (typeof AGENTS)[0]) => void;
  isSelected: boolean;
}) => (
  <button
    onClick={() => onSelect(agent)}
    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
      isSelected 
        ? 'bg-[var(--brand-primary-muted)]' 
        : 'hover:bg-[var(--surface-hover)]'
    }`}
  >
    <div 
      className="w-8 h-8 rounded-lg flex items-center justify-center"
      style={{
        backgroundColor: `${agent.color}15`,
      }}
    >
      <img
        src={agent.icon}
        alt={agent.name}
        className="w-4 h-4 object-contain"
      />
    </div>
    <div className="flex-1 min-w-0">
      <div className="font-medium text-sm text-[var(--foreground)]">{agent.name}</div>
      <div className="text-xs text-[var(--foreground-muted)] truncate">{agent.description}</div>
    </div>
  </button>
);

// Agent Suggestions Dropdown
const AgentSuggestions = ({ 
  agents, 
  onSelect, 
  selectedIndex 
}: { 
  agents: (typeof AGENTS)[0][];
  onSelect: (agent: (typeof AGENTS)[0]) => void;
  selectedIndex: number;
}) => (
  <div className="absolute bottom-full left-0 right-0 mb-2 bg-[var(--surface)] rounded-xl border border-[var(--surface-border)] shadow-lg overflow-hidden">
    <div className="text-xs text-[var(--foreground-subtle)] px-3 py-2 border-b border-[var(--surface-border)]">
      Select an agent
    </div>
    <div className="max-h-56 overflow-y-auto">
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
        const selectedAgent = AGENTS[selectedAgentIndex];
        handleAgentSelect(selectedAgent);
      } else {
        onSend();
      }
    } else if (e.key === 'Escape') {
      setShowAgentSuggestions(false);
      setMessage(message.replace(/@$/, ''));
    } else if (showAgentSuggestions) {
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
    const newMessage = message.replace(/@.*$/, `@${agent.name} `);
    setMessage(newMessage);
    setShowAgentSuggestions(false);
    
    if (onAgentSelect) {
      onAgentSelect(agent);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMessage(newValue);
    
    if (newValue.includes('@') && !newValue.match(/@\s*$/)) {
      setShowAgentSuggestions(false);
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <div className="flex-1 flex items-center px-4 py-3">
          <div className="text-[var(--foreground-subtle)] mr-3">
            <MessageIcon />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="Ask questions, or type '@' to call an agent..."
            className="flex-1 bg-transparent text-[var(--foreground)] placeholder-[var(--foreground-subtle)] 
                     focus:outline-none text-base"
            disabled={disabled}
          />
        </div>
        
        <button
          onClick={onSend}
          disabled={disabled || !message.trim()}
          className="p-3 mr-1 text-[var(--brand-primary)] hover:text-[var(--brand-primary-hover)] 
                    disabled:text-[var(--foreground-subtle)] disabled:cursor-not-allowed 
                    transition-colors rounded-xl hover:bg-[var(--brand-primary-muted)]"
        >
          <SendIcon />
        </button>
      </div>
      
      {showAgentSuggestions && (
        <AgentSuggestions
          agents={AGENTS}
          onSelect={handleAgentSelect}
          selectedIndex={selectedAgentIndex}
        />
      )}
    </div>
  );
};

export default ChatInput;
