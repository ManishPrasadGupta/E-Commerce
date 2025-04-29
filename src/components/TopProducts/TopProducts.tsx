"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { IProduct } from "@/models/Product.model";
import ProductCard from ".././ProductCard";
import Link from "next/link";
import { SeparatorHorizontal } from "lucide-react";


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
    <div>
      <div className="flex justify-center items-center min-h-screen">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <ProductCard key={product._id?.toString()} product={product} />
          ))}
        </div>
        
      </div>
      <Link
        href="/productsgallery"
       className="bg-gray-500 flex justify-center hover:bg-slate-400"
        target="_blank"
        >
          <span>View More</span>
      </Link>
      <SeparatorHorizontal className="bg-gray-300 h-[3px] w-3/4 my-6 mx-auto" />
    </div>

  );
}
