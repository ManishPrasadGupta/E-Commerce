import { IKImage } from "imagekitio-next";
import Link from "next/link";
import { IProduct } from "@/models/Product.model";
import { Eye } from "lucide-react";


export default function ProductCard({ product }: { product: IProduct }) {
  // console.log("Rendering Product:", product); 

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

          <Link
            href={`/products/${product._id}`}
            className="btn btn-primary btn-sm gap-2"
          >
            <Eye className="w-4 h-4" />
            View Option/Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
}

