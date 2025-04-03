"use client";

import React from "react";
// import { IProduct } from "@/models/Product.model";
// import { apiClient } from "@/lib/api-client";
import HeroSection from "@/components/HeroScetion/HeroSection";
import AboutUs from "@/components/AboutUs/AboutUs";
import Blogs from "@/components/Blogs/Blogs";
import WhyChooseUs from "@/components/WhyChooseUs/WhyChooseUs";
import Footer from "@/components/Footer/Footer";
import TopProducts from "@/components/TopProducts/TopProducts";
import Gadgets from "@/components/Gadgets/Gadgets";


export default function Home() {
 

  return (
    <main>
      <HeroSection />
      <AboutUs />
      <h1 className="flex flex-wrap justify-center font-bold text-4xl m-6">Our Top Products</h1>
      <TopProducts />
      <h1 className="flex flex-wrap justify-center font-bold text-4xl m-6">Gadgets</h1>
      <Gadgets />
      <Blogs />
      <WhyChooseUs />
      <Footer />
    </main>
  );
}