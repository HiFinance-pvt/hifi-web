"use client";

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import MobileAppSection from "@/components/MobileAppSection";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-white">
      <Navbar />
      <Hero />
      <MobileAppSection />
      <Footer />
    </main>
  );
}
