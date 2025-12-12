// "use client";

import React from "react";
import AboutUs from "@/components/AboutUs/AboutUs";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Footer from "@/components/Footer/Footer";
import Gadgets from "@/components/Gadgets/Gadgets";
import HomeGridAds from "./GridAds/page";
import HeroSection from "@/components/HeroScetion/HeroSection";
import TopProductsServer from "@/components/TopProducts/TopProductsServer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TopProductsServer />
      <Gadgets />
      <HomeGridAds />
      <AboutUs />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}
