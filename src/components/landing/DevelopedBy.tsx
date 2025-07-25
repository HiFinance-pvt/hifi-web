"use client";

import React from "react";
import ChromaGrid from "@/ui/components/ChromaGrid";

const items = [
  {
    image: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IeABlBCYKyJ8jNPpV24cHROwYQuxMUoLIv9n6",
    title: "Adhar Battulwar",
    subtitle: "Full Stack Developer",
    handle: "@adhar_battulwar",
    location: "Online",
    borderColor: "#10B981",
    gradient: "linear-gradient(145deg,  #0df4ff , #000)",
    url: "https://github.com/adharbattulwar",
  },
  {
    image: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4Ihw7f4LVN7gFVroIWSOaqQP82KstjURYb5mvw",
    title: "Harsh Duche",
    subtitle: "Full Stack Developer",
    handle: "@harsh_duche",
    location: "Online",
    borderColor: "#10B981",
    gradient: "linear-gradient(180deg, #10B981, #000)",
    url: "https://github.com/ducheharsh",
  },
  {
    image: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4I2acOJnCQvEJurRil9mdqoFhpMYK1VIsO7QcB",
    title: "Mayank Bhatgare",
    subtitle: "UI/UX Designer",
    handle: "@imbhatgare",
    location: "Online",
    borderColor: "#8B5CF6",
    gradient: "linear-gradient(225deg, #8B5CF6, #000)",
    url: "https://github.com/mayankbhatgare10",
  },
  {
    image: "https://xqak5dz869.ufs.sh/f/9bPBdXjSiv4IQlAJR9cne53xFvDGlPXoSykp4miL9sfCBHMt",
    title: "Aditya Tote",
    subtitle: "Full Stack Developer",
    handle: "@AdityaTote24",
    location: "Online",
    borderColor: "#F59E0B",
    gradient: "linear-gradient(165deg, #F59E0B, #000)",
    url: "https://github.com/AdityaTote",
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

        <div className="h-[600px] relative">
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
