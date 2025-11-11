"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { IKImage } from "imagekitio-next";

// Skeleton component for the loading state
const CartItemSkeleton = () => (
  <div className="flex animate-pulse items-center space-x-4 rounded-xl border border-gray-200 bg-white/50 p-4 shadow-md">
    <div className="h-24 w-24 rounded-lg bg-gray-200"></div>
    <div className="flex-1 space-y-3">
      <div className="h-5 w-3/4 rounded bg-gray-200"></div>
      <div className="h-3 w-1/2 rounded bg-gray-200"></div>
      <div className="flex items-center space-x-2 pt-2">
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
        <div className="h-4 w-10 rounded bg-gray-200"></div>
        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
      </div>
    </div>
    <div className="h-6 w-20 rounded bg-gray-200"></div>
  </div>
);

export default function CartPage() {
  const { cartItems, loading, loadCart, deleteItem, updateItemQuantity } =
    useCart();
  const subtotal = cartItems.reduce(
    (total, item) => total + item.variant.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-blue-800">
          Your Shopping Cart
        </h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Cart Items Section */}
          <div className="space-y-6 lg:col-span-2">
            {loading ? (
              // Show skeletons while loading
              Array.from({ length: 3 }).map((_, i) => (
                <CartItemSkeleton key={i} />
              ))
            ) : cartItems.length === 0 ? (
              // Empty cart message
              <div className="flex h-full min-h-60 flex-col items-center justify-center rounded-2xl bg-white/60 p-8 text-center shadow-lg">
                <span className="text-5xl">🛒</span>
                <p className="mt-4 text-xl font-semibold text-gray-500">
                  Your cart is empty.
                </p>
                <p className="mt-2 text-gray-400">
                  Looks like you haven't added anything yet.
                </p>
                <Link
                  href="/productsgallery"
                  className="mt-6 inline-block rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-indigo-700"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              // Cart items list
              cartItems.map((item) => (
                <div
                  key={item.productId + item.variant.type}
                  className="flex flex-col items-start gap-4 rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-lg transition hover:shadow-xl sm:flex-row sm:items-center"
                >
                  <IKImage
                    urlEndpoint={process.env.NEXT_PUBLIC_URL_ENDPOINT}
                    // path={
                    //   Array.isArray(item.imageUrl)
                    //     ? item.imageUrl[0]
                    //     : item.imageUrl || ""
                    // }
                    alt={item.name}
                    className="h-28 w-28 rounded-lg border bg-white object-cover shadow-sm"
                    width="112"
                    height="112"
                  />
                  <div className="flex-1">
                    <Link
                      href={item.href || `/products/${item.productId}`}
                      className="text-lg font-bold text-indigo-700 hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-sm text-gray-500">
                      Variant:{" "}
                      <span className="font-medium text-gray-700">
                        {item.variant.type}
                      </span>
                    </p>
                    <div className="mt-3 flex items-center space-x-3">
                      <button
                        onClick={() =>
                          item.quantity > 1 &&
                          updateItemQuantity(
                            item.productId,
                            item.variant.type,
                            item.quantity - 1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border bg-white font-bold text-gray-600 shadow-sm transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={item.quantity === 1}
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-black text-lg font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateItemQuantity(
                            item.productId,
                            item.variant.type,
                            item.quantity + 1
                          )
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border bg-white font-bold text-gray-600 shadow-sm transition hover:bg-gray-100"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex w-full flex-row items-center justify-between sm:w-auto sm:flex-col sm:items-end">
                    <p className="text-xl font-bold text-blue-800">
                      ₹{(item.variant.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() =>
                        deleteItem(item.productId, item.variant.type)
                      }
                      className="text-sm font-medium text-red-500 transition hover:text-red-600"
                      aria-label="Remove from cart"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sticky Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 rounded-2xl bg-white/70 p-6 shadow-2xl backdrop-blur-lg">
              <h2 className="mb-4 text-2xl font-bold text-gray-800">
                Order Summary
              </h2>
              <div className="space-y-3 border-b pb-4">
                <div className="flex justify-between font-medium text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-xl font-extrabold text-blue-800">
                <span>Total</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <Link href="/checkout" passHref>
                <button
                  className="mt-6 flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 px-6 py-3.5 text-lg font-bold text-white shadow-lg transition hover:scale-105 hover:shadow-indigo-400/50 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
