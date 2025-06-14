"use client";

import React from "react";
import HeroSection from "@/components/HeroScetion/HeroSection";
import AboutUs from "@/components/AboutUs/AboutUs";
// import Blogs from "@/components/Blogs/Blogs";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Footer from "@/components/Footer/Footer";
import TopProducts from "@/components/TopProducts/TopProducts";
import Gadgets from "@/components/Gadgets/Gadgets";
import HomeGridAds from "./GridAds/page";


export default function Home() {
  return (
    <main>
      <HeroSection />
      <TopProducts />
      <Gadgets />
      <HomeGridAds />
      <AboutUs />
      {/* <Blogs /> */}
      <WhyChooseUs />
      <Footer />
    </main>
  );
}