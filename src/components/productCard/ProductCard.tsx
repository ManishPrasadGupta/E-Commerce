"use client";

import { IKImage } from "imagekitio-next";
import Link from "next/link";
import { IProduct, ColorVariant } from "@/models/Product.model"; // Import ColorVariant
import { Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { motion, useReducedMotion } from "framer-motion";

interface ProductCardProps {
  product: IProduct;
  onAddToCart?: (item: {
    productId: string;
    name: string;
    quantity: number;
    variant: ColorVariant; // Replaced 'any' with 'ColorVariant'
    href: string;
  }) => void;
  requireAuthForDetail?: boolean;
}

// const cardVariants = {
//   hidden: { opacity: 0, y: 40, scale: 0.97 },
//   show: {
//     opacity: 1,
//     y: 0,
//     scale: 1,
//     transition: { duration: 0.55, ease: [0.16, 0.84, 0.44, 1] },
//   },
// };

export default function ProductCard({
  product,
  onAddToCart,
  requireAuthForDetail = false,
}: ProductCardProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  if (
    !product ||
    !Array.isArray(product?.variants) ||
    product.variants.length === 0
  ) {
    return (
      <div className="flex items-center justify-center min-h-[320px] rounded-2xl border border-dashed border-slate-600 text-slate-400 text-sm backdrop-blur-sm bg-white/5">
        Product is not available
      </div>
    );
  }

  const productVariants = product.variants ?? [];
  // Ensure numeric comparison
  const numericPrices = productVariants
    .map((v) =>
      typeof v.price === "number" ? v.price : parseFloat(String(v.price)) || 0
    )
    .filter((n) => !Number.isNaN(n));

  const lowestPrice = numericPrices.length > 0 ? Math.min(...numericPrices) : 0;

  const images = Array.isArray(product.imageUrl)
    ? product.imageUrl
    : [product.imageUrl].filter(Boolean);

  const updateCart = async () => {
    if (!product?._id || !product.variants?.[0]) {
      toast({
        title: "Error",
        description: "Refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const item = {
        productId: product._id.toString(),
        name: product.name,
        quantity: 1,
        variant: product.variants[0],
        href: `/products/${product._id}`,
      };
      await apiClient.addToCart(item);
      onAddToCart?.(item);
      toast({
        title: "Added to cart",
        description: `${product.name} has been added.`,
      });
    } catch (err) {
      console.error("Error adding to cart", err);
      toast({
        title: "Failed",
        description: "Could not add item. Try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDetailClick = (e: React.MouseEvent) => {
    if (requireAuthForDetail) {
      e.preventDefault();
      toast({
        title: "Login Required",
        description: "Please log in to access this page.",
      });
    }
  };

  return (
    <motion.div
      // variants={cardVariants}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              scale: 1.02,
              boxShadow: "0 8px 32px -4px rgba(0,199,255,0.35)",
              transition: { type: "spring", stiffness: 240, damping: 22 },
            }
      }
      className="group relative bg-gradient-to-br from-slate-800/70 to-slate-900/60 backdrop-blur-md rounded-2xl shadow-lg shadow-black/40 hover:shadow-cyan-900/50 transition-all duration-400 overflow-hidden flex flex-col h-[430px] w-full max-w-xs mx-auto border border-slate-700/60"
    >
      {/* Decorative top accent */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-cyan-400 via-sky-500 to-blue-600"
      />

      <figure className="relative w-full flex items-center justify-center overflow-hidden">
        <Link
          href={`/products/${product._id}`}
          className="block w-full"
          aria-label={`View details for ${product.name}`}
          onClick={handleDetailClick}
        >
          <div className="relative w-full aspect-[16/10] bg-slate-700/40">
            {images[0] ? (
              <IKImage
                path={images[0]}
                alt={product.name || "Product image"}
                height="600"
                width="960"
                transformation={[
                  {
                    height: "600",
                    width: "960",
                    cropMode: "extract",
                    focus: "center",
                    quality: 85,
                  },
                ]}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.06]"
                loading="lazy"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-slate-400 text-xs">
                No Image
              </div>
            )}
            {/* Gradient overlay */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-70 transition"
            />
          </div>
        </Link>

        {/* Hover action overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-3"
        >
          <Link
            href={`/products/${product._id}`}
            onClick={handleDetailClick}
            className="inline-flex items-center gap-1 rounded-lg bg-cyan-500/90 hover:bg-cyan-400 text-slate-900 font-semibold text-xs py-2 px-3 shadow-md shadow-cyan-900/40 transition"
          >
            <Eye className="w-4 h-4" />
            <span>Quick View</span>
          </Link>
        </div>
      </figure>

      <div className="flex flex-col flex-1 p-4 gap-2">
        <Link
          href={`/products/${product._id}`}
          onClick={handleDetailClick}
          className="block"
          aria-label={`Go to product ${product.name}`}
        >
          <h2 className="font-semibold text-sm md:text-base text-slate-100 leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
            {product.name}
          </h2>
        </Link>
        <p className="text-[11px] text-slate-400 line-clamp-2">
          {product.description || "No description available."}
        </p>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="inline-flex items-center rounded-md bg-cyan-500/15 text-cyan-300 font-bold text-sm px-2 py-1 backdrop-blur">
            ₹{lowestPrice.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-slate-400 tracking-wide">
            {productVariants.length} variant
            {productVariants.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex gap-2 mt-3">
          <Link
            href={`/products/${product._id}`}
            onClick={handleDetailClick}
            className="flex-1 relative inline-flex items-center justify-center gap-1 rounded-lg bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white font-semibold text-xs py-2 shadow-md shadow-sky-900/50 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 transition"
            aria-label={`Visit product page for ${product.name}`}
          >
            <Eye className="w-4 h-4" />
            <span>Details</span>
          </Link>

          <button
            onClick={updateCart}
            className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-cyan-400/50 bg-cyan-400/10 hover:bg-cyan-400/20 text-cyan-200 font-semibold text-xs py-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
            type="button"
            aria-label={`Add ${product.name} to cart`}
          >
            {loading ? (
              <svg
                className="animate-spin h-4 w-4 text-cyan-300"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8z"
                ></path>
              </svg>
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
            <span>{loading ? "Adding..." : "Add"}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
