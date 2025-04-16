import { IKImage } from "imagekitio-next";
import Link from "next/link";
import { ColorVariant, IProduct } from "@/models/Product.model";
import { Eye } from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

// export type CartItem = {
//   id: string;
//     name: string;
//     quantity: number;
//     variant: ColorVariant;
// };


export default function ProductCard({ product }: { product: IProduct }) {
  // console.log("Rendering Product:", product); 

   const [loading, setLoading] = useState(false);
  //  const [cartItems, setCartItems] = useState<CartItem[]>([]);



  if (!product || !product.variants || product.variants?.length === 0) {
    return <div>Product is not available</div>;
  }
  // console.log("Product Data:", product);



  // Provide a default value if variants are missing
  const productVariants = product.variants ?? [];
  // console.log("Product Variants:", product.variants);


 
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
          variant: product.variants?.[0], // assuming you're picking the first variant
        };

        console.log("Item to add to cart:", item); // Log the item being added
    
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
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300 w-80 h-full">
      <figure className="relative px-4 pt-4">
  <Link href={`/products/${product._id}`} className="relative group w-full">
    <div className="rounded-xl overflow-hidden relative w-full" style={{ height: 200, width: 290 }}>
      {images.map((img, index) => (
        <IKImage
          key={index}
          path={img}
          alt={product?.name}
          height="500"
          width="500"
          transformation={[
            {
              height: "500",
              width: "300",
              cropMode: "extract",
              focus: "center",
              quality: "100",
            },
          ]}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="eager"
        />
      ))}
    </div>
    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-xl" />
  </Link>
</figure>



      <div className="card-body p-4">
        <Link
          href={`/products/${product?._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{product?.name}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2 min-h-[2.5rem]">
          {product?.description}
        </p>

        <div className="card-actions justify-between items-center mt-2">
          <div className="flex flex-col">
            <span className="text-lg font-bold">From ₹ {lowestPrice}</span>
            <span className="text-xs text-base-content/50">
              {productVariants.length} variants available
            </span>
          </div>
          <div className="flex gap-14">
            <Link
              href={`/products/${product._id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Eye className="w-4 h-4" />
              Buy Now
            </Link>
  
            <button
            onClick={updateCart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
            Add to Cart
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

