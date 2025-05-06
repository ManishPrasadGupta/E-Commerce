import { IProduct } from "@/models/Product.model";
import ProductGrid from "../productCard/productGrid";


interface ProductsGalleryProps {
  products: IProduct[];
}

export default function ProductsGallery({products = [] }: ProductsGalleryProps) {
  return (
    <main className="container mx-auto px-4">
      <ProductGrid products={products} />
    </main>
  );
}             