import { IKImage } from "imagekitio-next";
import Link from "next/link";
import { IProduct } from "@/models/Product.model";
import { Eye } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function ProductCard({ product }: { product: IProduct }) {
  const [loading, setLoading] = useState(false);

  if (!product || !product.variants || product.variants?.length === 0) {
    return <div>Product is not available</div>;
  }

  // Provide a default value if variants are missing
  const productVariants = product.variants ?? [];

  const lowestPrice =
    productVariants.length > 0
      ? productVariants.reduce(
          (min, variant) => (variant.price < min ? variant.price : min),
          productVariants[0]?.price ?? "N/A"
        )
      : "N/A";

  const images = Array.isArray(product?.imageUrl) ? product.imageUrl : [product?.imageUrl];

  const updateCart = async () => {
    if (!product?._id || !product.variants?.[0]) {
      alert("Product data is incomplete.");
      return;
    }
    setLoading(true);
    try {
      const item = {
        productId: product._id?.toString(),
        name: product.name,
        quantity: 1,
        variant: product.variants?.[0],
      };

      console.log("Item to add to cart:", item);
  
      await apiClient.addToCart(item);
      alert("Added to cart!");
    } catch (err) {
      console.error("Error adding to cart", err);
      alert("Failed to add to cart.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden w-full h-full">
      {/* Image container with responsive height */}
      <figure className="relative h-40 sm:h-48">
        <Link href={`/products/${product._id}`} className="block h-full w-full">
          <div className="h-full w-full relative overflow-hidden">
            {images.map((img, index) => (
              <IKImage
                key={index}
                path={img}
                alt={product?.name}
                height="400"
                width="400"
                transformation={[
                  {
                    height: "400",
                    width: "400",
                    cropMode: "extract",
                    focus: "center",
                    quality: 85,
                  },
                ]}
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="eager"
              />
            ))}
          </div>
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300" />
        </Link>
      </figure>

      {/* Content with better spacing for small screens */}
      <div className="p-3 sm:p-4">
        <Link
          href={`/products/${product?._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="font-semibold text-sm sm:text-base line-clamp-2 mb-1">{product?.name}</h2>
        </Link>

        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-2">
          {product?.description}
        </p>

        {/* Price and variant info */}
        <div className="mb-3">
          <span className="text-base sm:text-lg font-bold">₹{lowestPrice}</span>
          <div className="text-xs text-gray-500 mt-0.5">
            {productVariants.length} variants
          </div>
        </div>

        {/* Responsive buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={`/products/${product._id}`}
            className="bg-blue-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded text-center hover:bg-blue-700 transition-colors flex items-center justify-center text-xs sm:text-sm"
          >
            <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            <span>Buy</span>
          </Link>
          
          <button
            onClick={updateCart}
            className="bg-blue-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded text-center hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-xs sm:text-sm"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}