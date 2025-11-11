import { IProduct } from "@/models/Product.model";
import ProductCard from "./ProductCard";

// If you use Radix UI, you can use <Card asChild> and <Dialog> for modals/details.
export default function ProductGrid({
  products,
  className = "",
}: {
  products: IProduct[];
  className?: string;
}) {
  if (!products.length) {
    return (
      <div className="text-center py-24">
        <div className="flex flex-col items-center gap-3">
          {/* Radix Icon or emoji */}
          <span className="text-4xl">😢</span>
          <span className="text-xl font-semibold text-slate-600">
            No products found.
          </span>
          <span className="text-base text-slate-400">
            Try changing your search or filters.
          </span>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full py-6">
      <div
        className={`grid gap-8 pt-4 pb-8 max-w-screen-xl mx-auto
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4
        justify-items-center
        ${className}`}
      >
        {products.map((product) => (
          // You can wrap ProductCard with Radix Card, Dialog etc. for overlays/quick views
          <ProductCard
            key={product._id?.toString() || "default-key"}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
