"use client";

import React from "react";
import { motion } from "framer-motion";
import MagicBento from "@/ui/components/MagicBento";

export default function ProductOverview() {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Products Overview
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover our comprehensive suite of AI-powered financial tools
            designed to transform your investment experience
          </p>
        </motion.div>
      </div>

      {/* MagicBento Interactive Component - Full Width */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-20 w-full px-4"
      >
        <div className="flex justify-center w-full">
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={300}
            particleCount={12}
            glowColor="34, 197, 94"
          />
        </div>
      </motion.div>
    </section>
  );
}
