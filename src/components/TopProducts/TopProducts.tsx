"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IProduct } from "@/models/Product.model";
import Link from "next/link";
import { SeparatorHorizontal } from "lucide-react";
import ProductCard from "../productCard/ProductCard";
import { motion } from "framer-motion";
import "../../../public/TopProductsCSS/animated-button.css";
import "../../app/styles/rain-bg.css";

// Animation variants for staggered card entrance
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export default function TopProducts() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        const fetchedProducts: IProduct[] = await apiClient.getTopProducts();
        if (!fetchedProducts || fetchedProducts.length === 0) {
          setError("No top products available.");
          return;
        }
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching top products:", error);
        setError("Failed to fetch top products.Check Your Internet");
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="flex justify-center text-red-500">{error}</p>;

  return (
    <div className="py-12 relative min-h-[600px]">
      {/* Rain background with unique class */}
      <div className="rain-bg-container absolute inset-0 w-full h-full pointer-events-none select-none" style={{ zIndex: 0 }} />
      {/* Content must be relatively positioned to stack above rain bg */}
      <div className="relative z-10">
        <h1 className="text-center font-extrabold text-4xl md:text-5xl mb-8 text-white tracking-tight">
          Our Top Products
        </h1>
        <div className="w-full flex justify-center">
          <motion.div
            className={`
              grid p-4 max-w-6xl
              grid-cols-2
              sm:grid-cols-2
              md:grid-cols-3
              gap-4
              sm:gap-6
              md:gap-8
              lg:gap-12
              xl:gap-16
            `}
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {products.map((product, i) => (
              <motion.div
                key={product._id?.toString() || `default-key-${i}`}
                variants={cardVariants}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 32px #09f3" }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="flex justify-center mt-10">
          <Link href="/productsgallery" className="animated-button">
            <span className="circle"></span>
            <span className="text">View More</span>
            <svg className="arr-1" viewBox="0 0 19 19">
              <path d="M13.29 9.29l-4.88-4.88a1 1 0 0 0-1.41 1.41L10.17 9H3a1 1 0 1 0 0 2h7.17l-3.17 3.17a1 1 0 1 0 1.41 1.41l4.88-4.88a1 1 0 0 0 0-1.41z"></path>
            </svg>
            <svg className="arr-2" viewBox="0 0 19 19">
              <path d="M13.29 9.29l-4.88-4.88a1 1 0 0 0-1.41 1.41L10.17 9H3a1 1 0 1 0 0 2h7.17l-3.17 3.17a1 1 0 1 0 1.41 1.41l4.88-4.88a1 1 0 0 0 0-1.41z"></path>
            </svg>
          </Link>
        </div>
        <SeparatorHorizontal className="bg-gray-200 h-[2px] w-3/4 my-8 mx-auto" />
      </div>
    </div>
  );
}