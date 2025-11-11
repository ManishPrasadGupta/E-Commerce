"use client";

import { useCart } from "@/context/CartContext";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartSlideOver({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (val: boolean) => void;
}) {
  const { cartItems, deleteItem, updateItemQuantity } = useCart();
  const subtotal = cartItems.reduce(
    (total, item) => total + item.variant.price * item.quantity,
    0
  );
  const router = useRouter();

  return (
    <Dialog open={open} onClose={setOpen} className="z-50 fixed inset-0">
      <DialogBackdrop className="fixed inset-0 bg-gradient-to-br from-blue-900/60 via-cyan-300/20 to-indigo-100/20 backdrop-blur transition-opacity duration-500" />
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          className="relative w-full max-w-sm sm:max-w-md h-full bg-white/80 backdrop-blur-xl rounded-l-3xl shadow-2xl flex flex-col animate-slidein z-50"
          style={{ borderLeft: "2px solid #6366f1" }}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-100/30 via-white/70 to-blue-100/40">
            <DialogTitle className="text-xl font-bold text-blue-800 tracking-tight select-none flex items-center gap-2">
              🛒 Shopping Cart
            </DialogTitle>
            <button
              onClick={() => setOpen(false)}
              className="-m-2 p-2 text-gray-400 hover:text-gray-600 rounded-full transition"
              aria-label="Close cart"
            >
              <XMarkIcon className="size-6" />
            </button>
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto px-3 py-6 sm:px-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-36">
                <span className="text-slate-400 text-lg mb-2">
                  Your cart is empty.
                </span>
                <Link href="/productsgallery" passHref>
                  <button
                    onClick={() => setOpen(false)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition shadow"
                  >
                    Browse Products
                  </button>
                </Link>
              </div>
            ) : (
              <ul className="-my-6 divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li
                    key={item.productId + item.variant.type}
                    className="flex py-6"
                  >
                    <div className="flex flex-1 flex-col min-w-0">
                      <div className="flex justify-between items-center text-base font-medium text-gray-900">
                        <a
                          href={item.href || `/products/${item.productId}`}
                          className="font-bold text-blue-600 hover:underline truncate max-w-[130px] sm:max-w-xs"
                          title={item.name}
                        >
                          {item.name}
                        </a>
                        <p className="ml-2 sm:ml-4 text-right">
                          <span className="text-blue-700 font-semibold">
                            ₹{item.variant.price}
                          </span>
                          <span className="text-gray-500 text-xs ml-1">
                            × {item.quantity}
                          </span>
                          <span className="block text-indigo-700 font-bold text-sm">
                            ₹{item.variant.price * item.quantity}
                          </span>
                        </p>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Color:{" "}
                        <span className="font-semibold">
                          {item.variant.type}
                        </span>
                      </p>
                      <div className="flex flex-1 items-end justify-between text-sm mt-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              item.quantity > 1 &&
                              updateItemQuantity(
                                item.productId,
                                item.variant.type,
                                item.quantity - 1
                              )
                            }
                            className={`px-3 py-1 rounded-full font-bold text-lg border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition ${
                              item.quantity === 1
                                ? "opacity-60 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={item.quantity === 1}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="inline-block min-w-6 text-center font-semibold text-lg">
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
                            className="px-3 py-1 rounded-full font-bold text-lg border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <button
                          className="text-xs text-red-600 hover:underline hover:text-red-700 transition ml-2"
                          onClick={() =>
                            deleteItem(item.productId, item.variant.type)
                          }
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Subtotal and Actions */}
          <div className="border-t border-gray-200 px-4 py-8 sm:px-6 bg-white/80 backdrop-blur rounded-b-3xl shadow">
            <div className="flex justify-between text-base font-bold text-blue-800 mb-4">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex flex-col gap-3">
              <button
                className="w-full flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 px-6 py-3 text-base font-bold text-white shadow-lg hover:from-indigo-700 hover:to-blue-700 transition"
                disabled={cartItems.length === 0}
                onClick={() => {
                  setOpen(false);
                  setTimeout(() => router.push("/checkout"), 250);
                }}
                style={{
                  opacity: cartItems.length === 0 ? 0.6 : 1,
                  pointerEvents: cartItems.length === 0 ? "none" : "auto",
                }}
              >
                Checkout
              </button>
              <Link href="/cart" passHref>
                <button
                  className="w-full flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-bold text-white hover:bg-indigo-700 transition shadow"
                  onClick={() => setOpen(false)}
                >
                  View Full Cart
                </button>
              </Link>
            </div>
            <div className="mt-4 text-center text-sm text-slate-500">
              <span>
                or{" "}
                <Link href="/productsgallery" passHref>
                  <button
                    onClick={() => setOpen(false)}
                    className="font-semibold text-blue-600 hover:text-indigo-500 transition underline"
                  >
                    Continue Shopping &rarr;
                  </button>
                </Link>
              </span>
            </div>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
