"use client";

import React from "react";
import Hero from "@/components/landing/Hero";
import ProductOverview from "@/components/landing/ProductOverview";
import UseCases from "@/components/landing/UseCases";
import Footer from "@/components/landing/Footer";
import DevelopedBy from "@/components/landing/DevelopedBy";

export default function OverviewPage() {
  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">
      <Hero />
      <ProductOverview />
      <UseCases />
      {/* <Testimonials /> */}
      <DevelopedBy />
      {/* <ContactForm /> */}
      <Footer />
    </div>
  );
}
