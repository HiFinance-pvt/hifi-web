import React from "react";

// Individual Chat Item Component
export const ChatItem = ({ title }: { title: string }) => (
  <div className="p-3 text-sm text-gray-300 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors group">
    <div className="truncate">{title}</div>
  </div>
);

// Recent Chats Component
const RecentChats = () => {
  const recentChats = [
    "Market Analysis Q4",
    "Investment Portfolio",
    "Budget Planning",
    "Expense Tracking",
    "Savings Goals",
  ];

  return (
    <div className="flex-1 px-4 overflow-hidden">
      <div className="text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider">
        Recent
      </div>
      <div className="space-y-1 overflow-y-auto">
        {recentChats.map((chat, index) => (
          <ChatItem key={index} title={chat} />
        ))}
      </div>
    </div>
  );
};

export default RecentChats;
