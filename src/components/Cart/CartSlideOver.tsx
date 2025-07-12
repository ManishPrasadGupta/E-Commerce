"use client";

import { useCart } from "@/context/CartContext";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartSlideOver({ open, setOpen }: { open: boolean; setOpen: (val: boolean) => void }) {
  const { cartItems, deleteItem, updateItemQuantity } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.variant.price * item.quantity, 0);
  const router = useRouter();

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0" />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
            <DialogPanel className="pointer-events-auto w-screen max-w-sm sm:max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700">
              {/* Slide over division */}
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl rounded-l-2xl">
                {/* items cards division */}
                <div className="flex-1 overflow-y-auto px-3 py-6 sm:px-6">
                  {/* Header and close button division */}
                  <div className="flex items-start justify-between mb-3">
                    <DialogTitle className="text-xl font-bold text-gray-900 tracking-tight select-none">
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
                  {/* Cart items list division */}
                  <div className="mt-4">
                    {cartItems.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-36">
                        <span className="text-gray-400 text-lg mb-2">Your cart is empty.</span>
                        <Link href="/productsgallery" passHref>
                          <button
                            onClick={() => setOpen(false)}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
                          >
                            Browse Products
                          </button>
                        </Link>
                      </div>
                    ) : (
                      <ul className="-my-6 divide-y divide-gray-200">
                        {cartItems.map((item) => (
                          <li key={item.productId + item.variant.type} className="flex py-5 sm:py-6">
                            {/* Optionally, show an image here */}
                            {/* <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-gray-100 mr-3">
                              <img
                                src={item.image || "https://via.placeholder.com/100"}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            </div> */}
                            <div className="flex flex-1 flex-col min-w-0">
                              <div className="flex justify-between items-center text-base font-medium text-gray-900">
                                <a
                                  href={item.href || `/products/${item.productId}`}
                                  className="font-bold text-indigo-700 hover:underline truncate max-w-[130px] sm:max-w-xs"
                                  title={item.name}
                                >
                                  {item.name}
                                </a>
                                <p className="ml-2 sm:ml-4 text-right">
                                  <span className="text-gray-900 font-semibold">
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
                                Color: <span className="font-semibold">{item.variant.type}</span>
                              </p>
                              <div className="flex flex-1 items-end justify-between text-sm mt-2">
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      item.quantity > 1 &&
                                      updateItemQuantity(item.productId, item.variant.type, item.quantity - 1)
                                    }
                                    className={`px-3 py-1 rounded-full font-bold text-lg border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition ${item.quantity === 1 ? "opacity-60 cursor-not-allowed" : ""}`}
                                    disabled={item.quantity === 1}
                                    aria-label="Decrease quantity"
                                  >
                                    −
                                  </button>
                                  <span className="inline-block min-w-6 text-center">{item.quantity}</span>
                                  <button
                                    onClick={() =>
                                      updateItemQuantity(item.productId, item.variant.type, item.quantity + 1)
                                    }
                                    className="px-3 py-1 rounded-full font-bold text-lg border border-gray-300 bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                                    aria-label="Increase quantity"
                                  >
                                    +
                                  </button>
                                </div>
                                <button
                                  className="text-xs text-red-600 hover:underline hover:text-red-700 transition ml-2"
                                  onClick={() => deleteItem(item.productId, item.variant.type)}
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
                </div>
                {/* Checkout and links */}
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-white">
                  <div className="flex justify-between text-base font-semibold text-gray-900">
                    <p>Subtotal</p>
                    <p className="text-indigo-700 font-bold">₹{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="mt-5 flex flex-col gap-3">
                    <button
                      className="w-full flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-blue-500 px-6 py-3 text-base font-bold text-white shadow hover:from-indigo-700 hover:to-blue-700 transition"
                      disabled={cartItems.length === 0}
                      onClick={() => {
                        setOpen(false);
                        // Delay navigation to allow the drawer to close smoothly
                        setTimeout(() => router.push("/checkout"), 250);
                      }}
                      style={{ opacity: cartItems.length === 0 ? 0.6 : 1, pointerEvents: cartItems.length === 0 ? "none" : "auto" }}
                    >
                      Checkout
                    </button>

                    <Link href="/cart" passHref>
                      <button
                        className="w-full flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-base font-bold text-white hover:bg-indigo-700 transition"
                        onClick={() => setOpen(false)}
                      >
                        View Full Cart
                      </button>
                    </Link>
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-500">
                    <span>
                      or{" "}
                      <Link href="/productsgallery" passHref>
                        <button
                          onClick={() => setOpen(false)}
                          className="font-semibold text-indigo-600 hover:text-indigo-500 transition underline"
                        >
                          Continue Shopping &rarr;
                        </button>
                      </Link>
                    </span>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}