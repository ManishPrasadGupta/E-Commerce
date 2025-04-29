import { IProduct } from "@/models/Product.model";
import ProductCard from "./ProductCard";


interface ProductsGalleryProps {
  products: IProduct[];
}

export default function ProductsGallery({products = [] }: ProductsGalleryProps) {
  return (
   
    <div className="flex flex-wrap justify-center gap-6 sm:col-span-1 lg:col-span-3 xl:col-span-6">
      {products.map((product) => (
        <ProductCard key={product._id?.toString()} product={product} />
      ))}

      {products.length === 0 && (
        <div className="col-span-full text-center py-12">
          <p className="text-red-500 text-base-content/70">No product found or Please check your internet.</p>
        </div>
      )}
      
    </div>
  );
}             