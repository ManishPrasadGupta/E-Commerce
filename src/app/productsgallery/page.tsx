"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "@/models/Product.model";
import { apiClient } from "@/lib/api-client";

import ProductsGallery from "@/components/ProductsGallery";

export default function ProductsGalleryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: IProduct[] = await apiClient.getProducts(); // Expect an array
        // console.log("Fetched products:", data);
  
        if (Array.isArray(data)) {
          setProducts(data); // Now accessing `products` key inside object
        } else {
          console.error("Fetched data does not contain products array:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
  
    fetchProducts();
  }, []); 
  
  return (
    <main>
      <ProductsGallery products={products} />
    </main>
  );
}