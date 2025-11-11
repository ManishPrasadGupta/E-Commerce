"use client";

import React from "react";
import AboutUs from "@/components/AboutUs/AboutUs";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Footer from "@/components/Footer/Footer";
import Gadgets from "@/components/Gadgets/Gadgets";
import HomeGridAds from "./GridAds/page";
import TopProducts from "@/components/TopProducts/TopProducts";
import HeroSection from "@/components/HeroScetion/HeroSection";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TopProducts />
      <Gadgets />
      <HomeGridAds />
      <AboutUs />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}
