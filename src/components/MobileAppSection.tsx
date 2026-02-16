"use client";

import React from "react";
import { Download, Smartphone, Apple } from "lucide-react";
import { motion } from "framer-motion";

const ANDROID_APK_LINK = "https://d3u0uf6tnodpp9.cloudfront.net/mobile/android/app-release.apk"; 
const IOS_APP_LINK = "#"; // Placeholder for future iOS link

export default function MobileAppSection() {
  return (
    <section className="py-32 px-6 md:px-12 relative overflow-hidden bg-gradient-to-b from-black to-[var(--background)]">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--brand-primary)]/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[var(--accent-gold)]/5 blur-[100px] rounded-full pointer-events-none" />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left Content */}
        <div className="space-y-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Finance on the <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-primary)] to-emerald-300">
                Go. Anywhere.
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              HiFi is a privacy-first, India-specific AI financial multi-agent system that connects your real-time financial footprint to AI — enabling it to reason, simulate, and act.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button 
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl 
                       bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-hover)] 
                       text-white font-semibold transition-all duration-300 
                       shadow-[0_10px_30px_-10px_rgba(4,166,106,0.5)] 
                       hover:shadow-[0_20px_40px_-10px_rgba(4,166,106,0.6)]
                       hover:-translate-y-1"
              onClick={() => window.open(ANDROID_APK_LINK, "_blank")}
            >
              <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <div className="text-left">
                <div className="text-[10px] uppercase opacity-80 font-bold tracking-wider">Download for</div>
                <div className="text-sm font-bold">Android</div>
              </div>
            </button>

            <button 
              className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl 
                       bg-[var(--surface)] border border-[var(--surface-border)] 
                       text-gray-400 cursor-not-allowed opacity-60
                       hover:bg-[var(--surface)]"
              disabled
            >
              <Apple className="w-5 h-5" />
              <div className="text-left">
                <div className="text-[10px] uppercase opacity-60 font-medium tracking-wider">Coming Soon</div>
                <div className="text-sm font-bold">iOS Store</div>
              </div>
            </button>
          </motion.div>
        </div>

        {/* Right Preview - Phone Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative flex justify-center lg:justify-end"
        >
          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 -left-10 z-20 bg-[var(--surface)]/90 backdrop-blur-xl border border-[var(--surface-border)] p-4 rounded-2xl shadow-xl max-w-[200px]"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 rounded-full bg-[var(--brand-primary)] animate-pulse" />
              <div className="text-xs text-gray-400 font-mono uppercase tracking-wider">Agent Active</div>
            </div>
            <div className="text-sm text-white font-medium">
              Simulating <span className="text-[var(--brand-primary)]">tax-saving</span> scenarios...
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-40 -right-4 z-20 bg-[var(--surface)]/90 backdrop-blur-xl border border-[var(--surface-border)] p-4 rounded-2xl shadow-xl"
          >
             <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                AI
              </div>
              <div className="text-xs text-gray-400">Assistant</div>
            </div>
            <div className="text-sm text-white font-medium">
              "Rebalancing suggested."
            </div>
          </motion.div>

          {/* The Phone */}
          <div className="relative w-[320px] h-[640px] bg-black rounded-[48px] border-[8px] border-[#2a2a2a] shadow-2xl overflow-hidden z-10 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
             {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#2a2a2a] rounded-b-2xl z-20" />
            
            {/* Screen Content */}
            <div className="w-full h-full bg-[var(--background)] flex flex-col relative">
              {/* Header inside phone */}
              <div className="p-6 pt-12 flex justify-between items-center">
                 <div className="w-8 h-8 rounded-lg bg-[var(--brand-primary)]/20 flex items-center justify-center text-[var(--brand-primary)] font-bold">H</div>
                 <div className="w-8 h-8 rounded-full bg-gray-800" />
              </div>

              {/* Chart Mock */}
              <div className="px-6 mt-4">
                 <div className="text-2xl font-bold text-white">$124,592<span className="text-gray-500 text-lg font-normal">.00</span></div>
                 <div className="text-sm text-[var(--success)] flex items-center gap-1 mt-1">
                   <span>▲ 2.4%</span>
                   <span className="text-gray-500">today</span>
                 </div>
                 
                 {/* CSS Chart Line */}
                 <div className="h-24 mt-6 w-full flex items-end justify-between gap-1">
                    {[40, 60, 45, 70, 65, 80, 50, 90, 75, 100].map((h, i) => (
                      <div key={i} className="w-full bg-[var(--brand-primary)]/20 rounded-t-sm relative group">
                        <div 
                          className="absolute bottom-0 w-full bg-[var(--brand-primary)] rounded-t-sm transition-all duration-500 group-hover:bg-[var(--brand-primary-hover)]"
                          style={{ height: `${h}%` }}
                        />
                      </div>
                    ))}
                 </div>
              </div>

               {/* Sections */}
              <div className="mt-8 px-6 space-y-4">
                <div className="h-20 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] p-4 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                     <Smartphone className="w-5 h-5" />
                   </div>
                   <div>
                     <div className="text-white font-medium">Apple Inc.</div>
                     <div className="text-xs text-gray-500">AAPL • Nasdaq</div>
                   </div>
                   <div className="ml-auto text-right">
                     <div className="text-white font-medium">$172.5</div>
                     <div className="text-xs text-[var(--success)]">+1.2%</div>
                   </div>
                </div>

                 <div className="h-20 rounded-2xl bg-[var(--surface)] border border-[var(--surface-border)] p-4 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center">
                     <div className="font-bold">₿</div>
                   </div>
                   <div>
                     <div className="text-white font-medium">Bitcoin</div>
                     <div className="text-xs text-gray-500">BTC • Crypto</div>
                   </div>
                   <div className="ml-auto text-right">
                     <div className="text-white font-medium">$42.1k</div>
                     <div className="text-xs text-[var(--error)]">-0.4%</div>
                   </div>
                </div>
              </div>

               {/* Bottom Nav */}
               <div className="mt-auto p-4 border-t border-[var(--surface-border)] bg-[var(--surface)]/50 backdrop-blur-md">
                 <div className="flex justify-around text-gray-400">
                    <div className="text-[var(--brand-primary)] flex flex-col items-center gap-1">
                      <div className="w-5 h-5 bg-[var(--brand-primary)] rounded-full" />
                    </div>
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className="w-5 h-5 bg-gray-700 rounded-full opacity-50" />
                    ))}
                 </div>
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
