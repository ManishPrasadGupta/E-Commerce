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
  // const [products, setProducts] = useState<IProduct[]>([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const data: IProduct[] = await apiClient.getProducts(); // Expect an array
  //       // console.log("Fetched products:", data);

  //       if (Array.isArray(data)) {
  //         setProducts(data); // Now accessing `products` key inside object
  //       } else {
  //         console.error("Fetched data does not contain products array:", data);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching products:", error);
  //     }
  //   };
  
  //   fetchProducts();
  // }, []); 
  
  // {products.length > 0 && (
  //   <div className="flex flex-wrap justify-center gap-4 p-4">
  //     {products.map((product) => (
  //       <div key={product._id?.toString()} className="border p-4 rounded-lg shadow-md">
  //         <h2 className="font-semibold">{product.name}</h2>
  //       </div>
  //     ))}
  //   </div>
  // )}


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