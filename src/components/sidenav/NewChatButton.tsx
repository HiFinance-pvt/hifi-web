import React from "react";

const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path d="M12 5v14m-7-7h14" />
  </svg>
);

const NewChatButton = () => (
  <div className="p-4">
    <button className="w-full flex items-center justify-center gap-2 p-3 
                       bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] 
                       text-white rounded-xl transition-colors">
      <PlusIcon />
      <span className="text-sm font-medium">New Chat</span>
    </button>
  </div>
);

export default NewChatButton;
