import React from "react";
import { Plus } from "lucide-react";

const NewChatButton = () => (
  <div className="p-4">
    <button className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
      <Plus className="h-4 w-4" />
      <span className="text-sm font-medium">New Chat</span>
    </button>
  </div>
);

export default NewChatButton; 