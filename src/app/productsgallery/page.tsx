"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "@/models/Product.model";
import { apiClient } from "@/lib/api-client";
import ProductsGallery from "@/components/Products/ProductsGallery";
import { useSearch } from "@/context/SearchContext/SearchContext";

export default function ProductsGalleryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const { query } = useSearch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: IProduct[] = await apiClient.getProducts();
        if (Array.isArray(data)) {
          setProducts(data);
        } else {
          console.error("Fetched data does not contain products array:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-tr from-slate-50 via-blue-100 to-cyan-50 dark:from-slate-900 dark:via-blue-950 dark:to-cyan-900">
      <ProductsGallery products={filteredProducts} query={query} />
    </div>
  );
}
