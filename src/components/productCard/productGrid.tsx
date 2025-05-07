import { IProduct } from "@/models/Product.model";
import ProductCard from "./ProductCard";

export default function ProductGrid({ 
  products, 
  className = "" 
}: { 
  products: IProduct[],
  className?: string 
}) {
  return (
    <div className="w-full flex justify-center">
      <div
        className={`
          grid gap-4 p-4 max-w-6xl
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
          ${className}
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
  ); 
}