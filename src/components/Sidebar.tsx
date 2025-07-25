"use client";

import React, { useState } from "react";
import { User, ChatSession } from "@/types/chat";
import { NAVIGATION_ITEMS } from "@/constants/mockData";
import { Plus, Search } from "lucide-react";
import { logout } from "@/lib/firebase/firebase";
import { env } from "@/lib/env/env";
import { useRouter } from "next/navigation";

interface SidebarProps {
  user: User | null;
  starredSessions: ChatSession[];
  chatSessions: ChatSession[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewSession: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  user,
  starredSessions,
  chatSessions,
  activeSessionId,
  onSelectSession,
  onDeleteSession,
  onNewSession,
}) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStarredSessions = starredSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChatSessions = chatSessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return "Today";
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d`;
    }
  };

  const handleSessionClick = (sessionId: string) => {
    onSelectSession(sessionId);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteSession(sessionId);
  };

  const SessionItem: React.FC<{ session: ChatSession }> = ({ session }) => (
    <div
      onClick={() => handleSessionClick(session.id)}
      className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all duration-200 ${
        activeSessionId === session.id
          ? "bg-teal-500/20 border border-teal-500/50"
          : "hover:bg-gray-700 border border-transparent"
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${
          activeSessionId === session.id ? "text-teal-300" : "text-gray-200"
        }`}>
          {session.title}
        </p>
      </div>
      <div className="flex items-center space-x-2 ml-2">
        <span className="text-xs text-gray-500">
          {formatDate(session.updatedAt)}
        </span>
        <button
          onClick={(e) => handleDeleteSession(session.id, e)}
          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 transition-all duration-200"
        >
          <svg className="w-3 h-3 text-gray-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-80 border-r border-gray-700">
      {/* Header with Logo */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-white">Hi-Fi</h1>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"/>
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-colors"
          />
        </div>
        
        {/* New Chat Button */}
        <button
          onClick={onNewSession}
          className="w-full mt-3 flex items-center justify-center space-x-2 p-2 bg-teal-600 hover:bg-teal-700 rounded-lg text-white transition-colors relative"
        >
          <Plus className="w-4 h-4 text-white absolute left-3 top-1/2 transform -translate-y-1/2"/>
          <span className="text-sm font-medium">New Chat</span>
        </button>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Starred Sessions */}
        {filteredStarredSessions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Starred
            </h3>
            <div className="space-y-1">
              {filteredStarredSessions.map(session => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          </div>
        )}

        {/* Chat Sessions */}
        {filteredChatSessions.length > 0 && (
          <div>
            <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
              Chats
            </h3>
            <div className="space-y-1">
              {filteredChatSessions.map(session => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          </div>
        )}

        {/* No sessions found */}
        {filteredStarredSessions.length === 0 && filteredChatSessions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">No sessions found</p>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      {user && (
        <div className="border-t border-gray-700 p-4">
          {/* User Info */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              {user.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-teal-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{user.name}</p>
              {user.role && (
                <p className="text-teal-400 text-xs">{user.role}</p>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <div className="space-y-1">
            {NAVIGATION_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.label === "Sign Out") {
                    logout();
                    localStorage.removeItem(env.NEXT_PUBLIC_SSID);
                    router.push("/login");
                  }
                  if (item.label === "Settings") {
                    router.push("/settings");
                  }
                  if (item.label === "Agents Hub") {
                    router.push("/agents");
                  }
                }}
                className="w-full flex items-center space-x-3 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-700 transition-colors text-sm"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 