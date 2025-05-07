"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IProduct } from "@/models/Product.model";
import Link from "next/link";
import { SeparatorHorizontal } from "lucide-react";
import ProductCard from "../productCard/ProductCard";


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
  if (error) return <p className=" flex justify-center text-red-500">{error}</p>;

  
  return (
    <div className="py-12">
      <h1 className="text-center font-extrabold text-4xl md:text-5xl mb-8 text-gray-800 tracking-tight">
        Our Top Products
      </h1>
      
      <div className="w-full flex justify-center">
            <div
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
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id?.toString() || "default-key"}
                  product={product}
                />
              ))}
            </div>
          </div>
      <div className="flex justify-center mt-10">
        <Link
          href="/productsgallery"
          className="inline-flex items-center px-6 py-3 rounded-md bg-gray-700 text-white font-semibold hover:bg-gray-500 transition-colors shadow-md"
          target="_blank"
        >
          <span>View More</span>
        </Link>
      </div>
      <SeparatorHorizontal className="bg-gray-200 h-[2px] w-3/4 my-8 mx-auto" />
    </div>

  );
}
