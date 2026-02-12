"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import TextPressure from "@/ui/components/TextPressure";
import TextType from "@/ui/components/TextType";

export default function Hero() {
  const router = useRouter();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, #10b981 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, #059669 0%, transparent 50%)",
              "radial-gradient(circle at 40% 80%, #10b981 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, #10b981 0%, transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full opacity-30"
            animate={{
              y: [-20, -100, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* TextPressure Component for HiFi */}
          <div className="mb-8 relative h-[200px] w-full max-w-4xl mx-auto">
            <TextPressure
              text="HiFi"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={false}
              textColor="#10b981"
              minFontSize={60}
              className="h-full w-full"
            />
          </div>

          {/* <h1 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-green-200 to-green-400 bg-clip-text text-transparent">
            Welcome to
          </h1>
          <p className="text-3xl md:text-4xl font-light mb-4 text-green-400">
            Your AI Financial Assistant
          </p> */}
          <TextType
            text={["Welcome to", "Your AI Financial Assistant"]}
            typingSpeed={75}
            textColors={["#c7fcce "]}
            pauseDuration={1500}
            showCursor={true}
            cursorCharacter="_"
            className="text-[64px] text-center"
          />
        </motion.div>

        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Automate your finance journey with secure, smart agents powered by
          cutting-edge AI technology
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button
            onClick={() => router.push("/dashboard")}
            className="group relative px-12 py-4 text-xl font-semibold text-black bg-gradient-to-r from-green-400 to-green-500 rounded-full hover:from-green-300 hover:to-green-400 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/25"
          >
            <span className="relative z-10">Get Started</span>
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-green-300 to-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </button>
        </motion.div>

        {/* Security badge */}
        <motion.div
          className="mt-16 flex items-center justify-center space-x-2 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
          <span>SEBI Compliant • Bank-Grade Security • AI Powered</span>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-green-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-green-400 rounded-full mt-2 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
}
