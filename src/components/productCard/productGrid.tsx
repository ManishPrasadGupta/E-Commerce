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
        <div className="flex justify-center w-full">
        <div className={`grid grid-cols-2 sm:grid-cols md:grid-cols lg:grid-cols xl:grid-cols gap-2 sm:gap-4 p-2 sm:p-4 ${className} ${products.length < 5 ? "justify-items-center" : ""}`}>
          {products.map((product) => (
            <ProductCard key={product._id?.toString() || "default-key"} product={product} />
          ))}
        </div>
      </div>
    );
  }