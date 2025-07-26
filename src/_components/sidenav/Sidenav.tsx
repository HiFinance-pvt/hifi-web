"use client";
import React from "react";
import Image from "next/image";
import AnimatedContent from "@/ui/Animations/AnimatedContent/AnimatedContent";

const chatHistory = [
  {
    id: 1,
    title: "Chat 1",
    message: "Hello, how are you?",
  },
  {
    id: 2,
    title: "Chat 2",
    message: "Hello, how are you?",
  },
  {
    id: 3,
    title: "Chat 3",
    message: "Hello, how are you?",
  },
];
const Sidenav = () => {
  return (
    <div className="w-64 h-full bg-gray-900">
      <div className="flex flex-col gap-5">
        <div className="rounded-full overflow-hidden size-12">
          {/* LOGO HERE */}
          <Image
            src="https://github.com/shadcn.png"
            alt="logo"
            width={100}
            height={100}
          />
        </div>
        <hr />
        <div className="">
          {/* CHAT HISTORY HERE */}
          <div className="">
            {chatHistory.map((chat) => (
              <AnimatedContent key={chat.id}>
                <div className="flex flex-col gap-2">
                  <h3>{chat.title}</h3>
                </div>
              </AnimatedContent>
            ))}
          </div>
        </div>
        <div className="">
          <div className="">{/* settings here */}</div>
          <div className="">{/* profile here */}</div>
          <div className="">{/* help here */}</div>
        </div>
      </div>
    </div>
  );
};

export default Sidenav;
