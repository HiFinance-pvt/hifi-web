"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  EnvelopeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/24/outline";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });

    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <section className="py-24 px-4 bg-black" id="contact">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Have questions about HiFi? Want to learn more about our AI
              financial agents? We're here to help you start your journey to
              financial freedom.
            </p>

            {/* Contact info */}
            <div className="space-y-6 mb-12">
              <div className="flex items-center text-gray-300">
                <EnvelopeIcon className="w-6 h-6 text-green-400 mr-4" />
                <span>contact@hifi.ai</span>
              </div>
              <div className="flex items-center text-gray-300">
                <ShieldCheckIcon className="w-6 h-6 text-green-400 mr-4" />
                <span>Your data is encrypted and secure</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white mb-4">
                Why Contact Us?
              </h3>
              {[
                "Personalized demo of HiFi agents",
                "Custom investment strategy consultation",
                "Integration support for your platforms",
                "Early access to new features",
              ].map((benefit, index) => (
                <div key={index} className="flex items-center text-gray-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3" />
                  {benefit}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="relative p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
              {/* Background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5" />

              <div className="relative z-10">
                {isSubmitted ? (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <ShieldCheckIcon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-400 mb-4">
                      Message Sent Securely!
                    </h3>
                    <p className="text-gray-300">
                      We'll get back to you within 24 hours with personalized
                      insights.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <ChatBubbleLeftRightIcon className="w-8 h-8 text-green-400 mr-3" />
                      Send us a message
                    </h3>

                    {/* Name field */}
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your Name"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      />
                    </div>

                    {/* Email field */}
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Your Email"
                        required
                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-300"
                      />
                    </div>

                    {/* Message field */}
                    <div className="relative">
                      <ChatBubbleLeftRightIcon className="absolute left-4 top-6 w-5 h-5 text-gray-400" />
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your financial goals..."
                        required
                        rows={4}
                        className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 transition-all duration-300 resize-none"
                      />
                    </div>

                    {/* Submit button */}
                    <motion.button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Sending Securely...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <PaperAirplaneIcon className="w-5 h-5 mr-3" />
                          Send Message
                        </div>
                      )}
                    </motion.button>

                    {/* Security note */}
                    <p className="text-sm text-gray-400 text-center">
                      🔒 Your information is encrypted and never shared with
                      third parties
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
