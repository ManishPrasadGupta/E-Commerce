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
      <div className={`flex flex-wrap justify-center gap-2 sm:gap-4 p-2 sm:p-4 ${className}`}>
        {products.map((product) => (
          <div 
            className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1rem)] xl:w-[calc(16.666%-1rem)]" 
            key={product._id?.toString() || "default-key"}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    ); 
  }