import { IProduct } from "@/models/Product.model";
import ProductGrid from "../productCard/productGrid";

interface ProductsGalleryProps {
  products: IProduct[];
  query?: string;
}

export default function ProductsGallery({
  products = [],
  query = "",
}: ProductsGalleryProps) {
  return (
    <main className="max-w-screen-xl mx-auto px-4 py-8">
      <div className="relative bg-gradient-to-br from-blue-100/40 via-white/70 to-transparent backdrop-blur-lg p-6 rounded-3xl shadow-xl mb-10">
        <h1 className="text-4xl font-bold text-blue-700 text-center mb-2">
          Products Gallery
        </h1>
        {query && (
          <p className="text-lg text-slate-600 text-center mb-2">
            Showing results for{" "}
            <strong className="text-blue-700">{query}</strong>
          </p>
        )}
        <p className="text-center text-slate-500 text-base">
          Explore our curated selection of tech, gadgets, & accessories.
        </p>
      </div>
      <ProductGrid products={products} />
    </main>
  );
}
