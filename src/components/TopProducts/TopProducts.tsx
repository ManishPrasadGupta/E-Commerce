"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IProduct } from "@/models/Product.model";
import ProductCard from "../productCard/ProductCard";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

// Skeleton component for loading state
const SkeletonCard = () => (
  <div className="animate-pulse bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden flex flex-col h-[430px] w-full max-w-xs mx-auto">
    <div className="bg-gradient-to-br from-slate-300/30 to-slate-50/10 h-72 w-full" />
    <div className="p-4 flex flex-col gap-3 flex-1">
      <div className="h-5 bg-slate-300/40 rounded w-3/4" />
      <div className="h-3 bg-slate-300/30 rounded w-2/3" />
      <div className="mt-auto flex items-center gap-3">
        <div className="h-7 w-20 bg-slate-300/40 rounded" />
        <div className="h-3 w-14 bg-slate-300/30 rounded" />
      </div>
      <div className="flex gap-2">
        <div className="h-10 flex-1 bg-slate-300/30 rounded" />
        <div className="h-10 flex-1 bg-slate-300/30 rounded" />
      </div>
    </div>
  </div>
);

const containerVariants = {
  hidden: {},
  show: (i: number) => ({
    transition: {
      staggerChildren: i === 0 ? 0.12 : 0,
    },
  }),
};

// const pageVariants = {
//   hidden: { opacity: 0, y: 12 },
//   show: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.55, ease: [0.16, 0.84, 0.44, 1] },
//   },
// };

export default function TopProducts({ products }: { products: IProduct[] }) {
  // const [products, setProducts] = useState<IProduct[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // const fetchTopProducts = async () => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const fetchedProducts: IProduct[] = await apiClient.getTopProducts();
  //     if (!fetchedProducts || fetchedProducts.length === 0) {
  //       setError("No top products available right now.");
  //       setProducts([]);
  //       return;
  //     }
  //     setProducts(fetchedProducts);
  //   } catch (err) {
  //     console.error("Error fetching top products:", err);
  //     setError("Failed to fetch top products. Please check your connection.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchTopProducts();
  // }, []);

  return (
    <motion.section
      initial="hidden"
      animate="show"
      // variants={pageVariants}
      className="relative py-16 md:py-20 px-4 sm:px-6"
      aria-labelledby="top-products-heading"
    >
      {/* Atmospheric background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_30%,rgba(56,189,248,0.3),transparent_60%)] bg-black"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 mix-blend-overlay opacity-50 bg-[linear-gradient(115deg,#020617_0%,#0f172a_50%,#162b46_100%)]"
      />

      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col items-center gap-4 mb-10">
          <h1
            id="top-products-heading"
            className="text-center font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-600 text-4xl md:text-5xl tracking-tight drop-shadow-sm"
          >
            Our Top Products
          </h1>
          <p className="max-w-2xl text-center text-slate-300 text-sm md:text-base leading-relaxed">
            Explore a curated selection of customer favorites — crafted for
            performance, reliability, and design excellence.
          </p>
        </header>
        {/* 
        {loading && (
          <div
            className="grid gap-6 md:gap-8 lg:gap-10 max-w-screen-xl mx-auto grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]justify-items-center justify-center px-2"
            role="status"
            aria-label="Loading top products"
          >
            {Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))}
          </div>
        )} */}

        {/* {!loading && error && (
          <div className="flex flex-col items-center justify-center min-h-[320px]">
            <div className="bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/30 rounded-2xl p-8 backdrop-blur-md shadow-lg max-w-md w-full text-center">
              <h2 className="text-red-400 font-semibold text-lg mb-2">
                Something went wrong
              </h2>
              <p className="text-red-200 text-sm mb-6">{error}</p>
              <button
                onClick={fetchTopProducts}
                className="inline-flex items-center gap-2 rounded-lg bg-red-500/80 text-white px-5 py-2.5 text-sm font-medium shadow hover:bg-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 transition"
              >
                Retry
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 4v6h6M20 20v-6h-6M5 19A9 9 0 0 1 19 5M19 5 15 9"
                  />
                </svg>
              </button>
            </div>
          </div>
        )} */}

        {/* {!loading && !error && products.length > 0 && ( */}
        <motion.div
          variants={containerVariants}
          custom={shouldReduceMotion ? 1 : 0}
          initial="hidden"
          animate="show"
          className="grid p-2 sm:p-4
    max-w-screen-xl mx-auto
    grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]
    justify-items-center
    justify-center
    gap-5 sm:gap-6 md:gap-8 lg:gap-10"
        >
          {products.map((product) => (
            <ProductCard key={product._id?.toString()} product={product} />
          ))}
        </motion.div>
        {/* )} */}

        <div className="flex justify-center mt-12">
          <Link
            href="/productsgallery"
            className="group relative inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-slate-100
            bg-gradient-to-r from-cyan-500 via-sky-600 to-blue-700 shadow-lg shadow-sky-900/40
            hover:shadow-xl hover:shadow-sky-800/50 hover:brightness-110
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300
            transition-all"
            aria-label="View more products in the gallery"
          >
            <span className="relative z-10">View More</span>
            <svg
              className="w-4 h-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition"
            />
          </Link>
        </div>

        <hr className="mt-16 border-t border-slate-700/60 max-w-4xl mx-auto" />
      </div>
    </motion.section>
  );
}
