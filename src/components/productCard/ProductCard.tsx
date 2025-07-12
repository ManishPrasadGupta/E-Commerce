import { IKImage } from "imagekitio-next";
import Link from "next/link";
import { IProduct } from "@/models/Product.model";
import { Eye } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export default function ProductCard({ product }: { product: IProduct }) {
  const [loading, setLoading] = useState(false);
  const {toast} = useToast();

  if (!product || !product.variants || product.variants?.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gray-50 rounded-xl text-gray-500">
        Product is not available
      </div>
    );
  }

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
      toast({
        title: "Error",
        description: "Please refresh the page and try again.",
      }); 
      return;
    }
    setLoading(true);
    try {
      const item = {
        productId: product._id?.toString(),
        name: product.name,
        quantity: 1,
        variant: product.variants?.[0],
        href: `/products/${product?._id}`,
      };
      await apiClient.addToCart(item);
      toast({
        title: "Success",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (err) {
      console.error("Error adding to cart", err);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };




  return (
    <div 
    className="group bg-slate-200 rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 overflow-hidden flex flex-col h-[430px] w-full max-w-xs mx-auto border border-zinc-600 hover:scale-105">
      <figure className="relative w-full h-72 bg-gray-100 flex items-center justify-center overflow-hidden">
        <Link href={`/products/${product._id}`} className="block w-full h-full">
          <IKImage
            path={images[0]}
            alt={product?.name}
            height="500"
            width="500"
            transformation={[
              {
                height: "500",
                width: "500",
                cropMode: "extract",
                focus: "center",
                quality: 85,
              },
            ]}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>
      </figure>

      <div className="flex flex-col flex-1 p-3 gap-1">
        <Link
          href={`/products/${product?._id}`}
          className="block hover:underline"
          aria-label={`View details for ${product?.name}`}
        >
          <h2 className="font-bold text-base truncate mb-0.5 text-gray-900">
            {product?.name}
          </h2>
        </Link>
        <p className="text-xs text-gray-600 truncate mb-1">
          {product?.description}
        </p>

        <div className="flex items-center justify-between mt-auto mb-1">
          <span className="text-base font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">
            ₹{lowestPrice}
          </span>
          <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
            {productVariants.length} variants
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            href={`/products/${product._id}`}
            className="flex-1 bg-blue-600 text-white font-semibold rounded-lg px-0 py-2 shadow hover:bg-blue-700 transition text-xs flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            aria-label={`Buy ${product?.name} now`}
          >
            <Eye className="w-4 h-4" />
            <span>Buy Now</span>
          </Link>
          <button
            onClick={updateCart}
            className={`flex-1 border border-blue-600 text-blue-700 font-semibold rounded-lg px-0 py-2 shadow hover:bg-blue-50 transition text-xs flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300`}
            disabled={loading}
            aria-label={`Add ${product?.name} to cart`}
            type="button"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 mr-1 text-blue-700" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8z"></path>
              </svg>
            ) : null}
            <span>{loading ? "Adding..." : "Add To Cart"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}