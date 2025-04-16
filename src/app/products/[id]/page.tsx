"use client";

import { IKImage } from "imagekitio-next";
import {
  IProduct,
  ColorVariant,

} from "@/models/Product.model";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";

import { useNotification } from "@/components/Notification";
import { useSession } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { showNotification } = useNotification();

  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ColorVariant | null>(null);




  const images = Array.isArray(product?.imageUrl) ? product.imageUrl : [product?.imageUrl];

  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
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
        console.log("Fetching product with id:", id);
        const data = await apiClient.getProduct(id.toString());
        // console.log("API Response:", data);
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  // console.log("Fetched product state:", product);


  const handlePurchase = async (variant: ColorVariant) => {
    if (!session) {
      showNotification("Please login to make a purchase", "error");
      router.push("/login");
      return;
    }

    if (!product?._id) {
      showNotification("Invalid product", "error");
      return;
    }

    try {
      // console.log("Creating order for:", product?._id, "Variant:", variant);
      const { orderId, amount } = await apiClient.createOrder({
        productId: product?._id,
        variant: variant,
      });

      if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
        showNotification("Razorpay key is missing", "error");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency: "INR",
        name: "Electronics",
        description: `${product?.name} - ${variant?.type} Version`,
        order_id: orderId,
        handler: function () {
          showNotification("Payment successful!", "success");
          router.push("/orders");
        },
        prefill: {
          email: session.user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };


      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      showNotification(
        error instanceof Error ? error.message : "Payment failed",
        "error"
      );
    }
  };

  
  if (loading) {
    return (
      <div className="min-h-[70vh] flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="alert alert-error max-w-md mx-auto my-8">
        <AlertCircle className="w-6 h-6" />
        <span>{error || "Product not found"}</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Image Section */}
        <div id="product-carousel" className="relative w-full" data-carousel="slide">
          
          {/* Carousel Wrapper */}
          <div className="relative h-[500px] overflow-hidden rounded-lg">
          {images.map((img, index) => (
            <div
              key={index}
              className={`${index === activeIndex ? "block" : "hidden"} duration-700 ease-in-out`}
              data-carousel-item
            >
              <IKImage
                urlEndpoint={urlEndpoint}
                path={img}
                alt={product?.name}
                width="500"
                height="500"
                priority
                className="w-full h-auto object-contain"
              />

            </div>
          ))}
          </div>

          
          {/* Slider Indicators */}
          <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                className="w-3 h-3 rounded-full"
                aria-label={`Slide ${index + 1}`}
                data-carousel-slide-to={index}
                onClick={() => setActiveIndex(index)}
              ></button>
            ))}
          </div>
          
          {/* Slider Controls */}
          <button
          onClick={prevSlide}
            type="button"
            className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-prev
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30">
              <svg
                className="w-4 h-4 text-white"
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
              <span className="sr-only">Previous</span>
            </span>
          </button>
          <button
          onClick={nextSlide}
            type="button"
            className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
            data-carousel-next
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30">
              <svg
                className="w-4 h-4 text-white"
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
              <span className="sr-only">Next</span>
            </span>
          </button>
        </div>  
        
        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product?.name}</h1>
            <p className="text-base-content/80 text-lg">
            {product?.description}
            </p>
        </div>

          {/* Variants Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Available variants</h2>
            {product?.variants?.map((variant) => (
              <div
                key={variant.type}
                className={`card bg-base-200 cursor-pointer hover:bg-base-300 transition-colors ${
                  selectedVariant?.type === variant.type
                    ? "ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => setSelectedVariant(variant)}
              >
                <div className="card-body p-4">
                  <div className="flex justify-between items-center">
                    
                    <div className="flex items-center gap-3">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div>
                      {variant.type}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xl font-bold">
                        <span className="text-xl font-bold">
                            ${variant.price ? variant.price.toFixed(2) : "N/A"}
                        </span>
                      </span>
                      <button
                        className="btn btn-primary bg-blue-600 btn-sm rounded p-2 hover:bg-blue-400"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePurchase(variant);
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}



