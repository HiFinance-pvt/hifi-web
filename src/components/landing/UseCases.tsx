"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ChartBarIcon,
  ShieldExclamationIcon,
  EyeIcon,
  CurrencyDollarIcon,
  BanknotesIcon,
  DocumentChartBarIcon,
} from "@heroicons/react/24/outline";
import PixelCard from "@/ui/components/PixelCard";

const useCases = [
  {
    icon: ChartBarIcon,
    title: "Track Portfolio with Trader Agent",
    description:
      "Monitor your investments across multiple platforms with real-time updates and personalized insights",
    features: [
      "Real-time portfolio tracking",
      "Multi-platform integration",
      "Performance analytics",
    ],
    color: "green",
  },
  {
    icon: ShieldExclamationIcon,
    title: "Get Regulatory Alerts with SEBI Agent",
    description:
      "Stay compliant with automated regulatory notifications and compliance monitoring",
    features: [
      "SEBI compliance alerts",
      "Regulatory updates",
      "Risk assessments",
    ],
    color: "emerald",
  },
  {
    icon: EyeIcon,
    title: "Visualize Intraday Stats Easily",
    description:
      "Access comprehensive market data with intuitive charts and analytical tools",
    features: [
      "Live market data",
      "Interactive charts",
      "Technical indicators",
    ],
    color: "teal",
  },
  {
    icon: CurrencyDollarIcon,
    title: "Smart Budget Management",
    description:
      "AI-powered budgeting that adapts to your spending patterns and financial goals",
    features: [
      "Expense categorization",
      "Budget optimization",
      "Savings recommendations",
    ],
    color: "cyan",
  },
  {
    icon: BanknotesIcon,
    title: "Investment Opportunity Scanner",
    description:
      "Discover lucrative investment opportunities with AI-driven market analysis",
    features: ["Market scanning", "Risk analysis", "Opportunity alerts"],
    color: "lime",
  },
  {
    icon: DocumentChartBarIcon,
    title: "Automated Tax Planning",
    description:
      "Streamline your tax planning with intelligent calculations and filing assistance",
    features: ["Tax optimization", "Document management", "Filing assistance"],
    color: "mint",
  },
];

export default function UseCases() {
  return (
    <section className="py-24 px-4 bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Powerful Use Cases
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how HiFi agents transform your financial workflow with
            interactive experiences
          </p>
        </motion.div>

        {/* PixelCard Grid for Use Cases */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 justify-items-center">
          {useCases.map((useCase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PixelCard variant="pink">
                <div className="absolute inset-0 p-6 flex flex-col items-center justify-center text-center group cursor-pointer">
                  {/* Icon with hover animation */}
                  <motion.div
                    className={`w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 p-4 shadow-lg mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6, ease: "backInOut" }}
                  >
                    <useCase.icon className="w-full h-full text-black" />
                  </motion.div>

                  {/* Title with reveal animation */}
                  <motion.h3
                    className="text-lg font-bold text-white mb-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-4"
                    style={{ transitionDelay: "150ms" }}
                  >
                    {useCase.title}
                  </motion.h3>

                  {/* Minimalist indicator */}
                  <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-300 mb-3" />

                  {/* Description on hover only */}
                  <motion.p
                    className="text-xs text-gray-300 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-4 max-w-[240px] leading-relaxed mb-3"
                    style={{ transitionDelay: "300ms" }}
                  >
                    {useCase.description}
                  </motion.p>

                  {/* Features list on hover */}
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-4"
                    style={{ transitionDelay: "450ms" }}
                  >
                    {useCase.features.slice(0, 2).map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center text-xs text-green-300 mb-1"
                      >
                        <div className="w-1 h-1 rounded-full bg-green-400 mr-2" />
                        {feature}
                      </div>
                    ))}
                  </motion.div>

                  {/* Interactive pulse dot */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-green-400 rounded-full opacity-60 group-hover:opacity-100 animate-pulse" />
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
