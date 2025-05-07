"use client";

import { IKImage } from "imagekitio-next";
import { IProduct, ColorVariant } from "@/models/Product.model";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(null);

  const images = Array.isArray(product?.imageUrl)
    ? product.imageUrl
    : product?.imageUrl
    ? [product.imageUrl]
    : [];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleBuyNow = async () => {
    if (!product?._id || !selectedVariant) return;
    router.push(
      `/checkout?productId=${product?._id}&variantType=${selectedVariant.type}`
    );
  };

  const handleAddToCart = async () => {
    if (!product?._id || !selectedVariant) return;
    const productId =
      typeof product._id === "string" ? product._id : product._id.toString();
    await addItem(
      productId,
      selectedVariant.type,
      1,
      product.name,
      selectedVariant.price,
      `/products/${productId}`
    );
  };

  const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT || "";

  useEffect(() => {
    const id = params?.id?.toString();
    if (!id) {
      setError("Product ID is missing");
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await apiClient.getProduct(id.toString());
        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load product"
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params?.id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="alert alert-error max-w-md mx-auto my-8 flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded shadow">
        <AlertCircle className="w-6 h-6" />
        <span>{error || "Product not found"}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16">
        {/* Image Section */}
        <div
          id="product-carousel"
          className="relative w-full rounded-xl shadow-md bg-white p-6"
        >
          {/* Carousel Wrapper */}
          <div className="relative h-[420px] md:h-[500px] overflow-hidden rounded-xl">
            {images.length ? (
              images.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-700 ${
                    index === activeIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                  aria-hidden={index !== activeIndex}
                >
                  <IKImage
                    urlEndpoint={urlEndpoint}
                    path={img}
                    alt={product?.name}
                    width="500"
                    height="500"
                    priority
                    className="w-full h-full object-contain rounded-xl"
                  />
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <ImageIcon className="w-12 h-12" />
                <span>No image available</span>
              </div>
            )}
          </div>

          {/* Slider Indicators */}
          {images.length > 1 && (
            <div className="absolute z-30 flex -translate-x-1/2 bottom-6 left-1/2 space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Slide ${index + 1}`}
                  className={`w-3 h-3 rounded-full border-2 border-primary transition-all duration-200 
                    ${activeIndex === index ? "bg-primary" : "bg-white opacity-60"}`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          )}

          {/* Slider Controls */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                type="button"
                className="absolute top-1/2 left-2 z-30 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow transition"
                aria-label="Previous image"
              >
                <svg
                  className="w-5 h-5 text-primary"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 1 1 5l4 4"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                type="button"
                className="absolute top-1/2 right-2 z-30 -translate-y-1/2 flex items-center justify-center h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow transition"
                aria-label="Next image"
              >
                <svg
                  className="w-5 h-5 text-primary"
                  aria-hidden="true"
                  fill="none"
                  viewBox="0 0 6 10"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 9 4-4-4-4"
                  />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-3 text-gray-900">
              {product?.name}
            </h1>
            <p className="text-gray-700 text-lg mb-2">{product?.description}</p>
          </div>

          {/* Variants Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-1 text-gray-800">
              Available variants
            </h2>
            <div className="flex flex-col gap-3">
              {product?.variants?.map((variant) => (
                <div
                  key={variant.type}
                  className={`rounded-lg border transition-all cursor-pointer bg-base-100 
                  ${
                    selectedVariant?.type === variant.type
                      ? "border-primary ring-2 ring-primary bg-blue-50"
                      : "border-gray-200 hover:border-primary"
                  }`}
                  onClick={() => setSelectedVariant(variant)}
                >
                  <div className="flex justify-between items-center py-4 px-5">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5 text-primary" />
                      <span className="font-medium text-gray-900 text-base">{variant.type}</span>
                    </div>
                    <span className="text-xl font-bold text-primary">
                      {variant.price ? `$${variant.price.toFixed(2)}` : "N/A"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {selectedVariant && (
              <div className="mt-2 flex gap-2 items-center">
                <span className="text-sm text-gray-600">Selected:</span>
                <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {selectedVariant.type}
                </span>
              </div>
            )}
            {/* Unified Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition disabled:opacity-60"
                onClick={handleAddToCart}
                disabled={!selectedVariant}
              >
                Add to Cart
              </button>
              <button
                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition disabled:opacity-60"
                onClick={handleBuyNow}
                disabled={!selectedVariant}
              >
                Buy Now
              </button>
            </div>
            {!selectedVariant && (
              <div className="text-xs text-red-500 mt-2">Please select a variant first.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}