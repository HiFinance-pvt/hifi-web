import React from "react";

// Suggestion Button Component
const SuggestionButton = ({ 
  suggestion, 
  onClick, 
  variant = "primary" 
}: { 
  suggestion: string; 
  onClick: () => void;
  variant?: "primary" | "secondary";
}) => {
  const baseClasses = "rounded-lg text-sm transition-colors cursor-pointer";
  const variants = {
    primary: "px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white border border-gray-600 hover:border-gray-500",
    secondary: "px-3 py-1 bg-gray-700/50 hover:bg-gray-600/50 text-gray-400 hover:text-gray-300 text-xs border border-gray-600/50"
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]}`}
    >
      {suggestion}
    </button>
  );
};

// Top Suggestions Component
export const TopSuggestions = ({ 
  suggestions, 
  onSuggestionClick 
}: { 
  suggestions: string[]; 
  onSuggestionClick: (suggestion: string) => void; 
}) => (
  <div className="flex flex-wrap justify-center gap-3">
    {suggestions.slice(0, 2).map((suggestion, index) => (
      <SuggestionButton
        key={index}
        suggestion={suggestion}
        onClick={() => onSuggestionClick(suggestion)}
        variant="primary"
      />
    ))}
  </div>
);

// Bottom Suggestions Component
export const BottomSuggestions = ({ 
  suggestions, 
  onSuggestionClick 
}: { 
  suggestions: string[]; 
  onSuggestionClick: (suggestion: string) => void; 
}) => (
  <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
    <div className="flex gap-3">
      {suggestions.slice(2).map((suggestion, index) => (
        <SuggestionButton
          key={index + 2}
          suggestion={suggestion}
          onClick={() => onSuggestionClick(suggestion)}
          variant="secondary"
        />
      ))}
    </div>
  </div>
);

export default SuggestionButton; 