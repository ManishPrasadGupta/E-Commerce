"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "@/models/Product.model";
import { apiClient } from "@/lib/api-client";

import ProductsGallery from "@/components/Products/ProductsGallery";
import { useSearch } from "@/context/SearchContext/SearchContext";

export default function ProductsGalleryPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const { query} = useSearch(); 


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data: IProduct[] = await apiClient.getProducts(); // Expecting an array
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


  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.description?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <main>
      <ProductsGallery products={filteredProducts} />
    </main>
  );
}