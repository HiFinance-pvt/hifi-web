"use client";

import React from "react";
import ChromaGrid from "@/ui/components/ChromaGrid";

const items = [
  {
    image: "./profiles/adharbattulwar.jpg",
    title: "Adhar Battulwar",
    subtitle: "Full Stack Developer",
    handle: "@adhar_battulwar",
    location: "Online",
    borderColor: "#10B981",
    gradient: "linear-gradient(145deg,  #0df4ff , #000)",
    url: "https://github.com/adharbattulwar",
  },
  {
    image: "https://i.pravatar.cc/300?img=2",
    title: "Harsh Duche",
    subtitle: "Full Stack Developer",
    handle: "@harshduche",
    location: "Online",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://github.com/harshduche",
  },
  {
    image: "https://i.pravatar.cc/300?img=3",
    title: "Mayank Bhatagare",
    subtitle: "AI/ML Specialist",
    handle: "@rohanml",
    location: "Away",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(225deg, #8B5CF6, #000)",
    url: "https://github.com/rohanml",
  },
  {
    image: "https://i.pravatar.cc/300?img=4",
    title: "Aditya Tote",
    subtitle: "Product Designer",
    handle: "@snehadesigns",
    location: "Online",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(165deg, #F59E0B, #000)",
    url: "https://dribbble.com/snehadesigns",
  },
];

export default function DevelopedBy() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Developed By
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Meet the talented team behind HiFi - passionate developers building
            the future of financial technology
          </p>
        </div>

        <div style={{ height: "600px", position: "relative" }}>
          <ChromaGrid
            items={items}
            radius={300}
            damping={0.45}
            fadeOut={0.6}
            ease="power3.out"
          />
        </div>

        {/* Additional team info */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center px-6 py-3 bg-gray-800/50 rounded-full border border-gray-700/50">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse mr-3" />
            <span className="text-gray-300 text-sm">
              Building with passion • Open source • Made in India 🇮🇳
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
