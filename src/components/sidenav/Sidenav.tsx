"use client";
import React from "react";
import SidenavHeader from "./SidenavHeader";
import NewChatButton from "./NewChatButton";
import RecentChats from "./RecentChats";
import BottomActions from "./BottomActions";

type Props = {};

// Main Sidenav Component
const Sidenav = (props: Props) => {
  return (
    <div className="w-64 bg-gray-900 h-full flex flex-col text-white border-r border-gray-800">
      <SidenavHeader />
      <NewChatButton />
      <RecentChats />
      <BottomActions />
    </div>
  );
};

export default Sidenav;
