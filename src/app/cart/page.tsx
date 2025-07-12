"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cartItems, loading, loadCart, deleteItem, updateItemQuantity } = useCart();
  const subtotal = cartItems.reduce((total, item) => total + item.variant.price * item.quantity, 0);

   

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-10 px-2 flex justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 md:p-10 space-y-7">
        <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
          <span role="img" aria-label="cart">🛒</span> Cart Items
        </h1>
        <div className="flex space-x-4">
          <button
            onClick={loadCart}
            className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-600 transition"
          >
            Fetch Items
          </button>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-6">
            <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span className="ml-3 text-blue-700 font-medium">Loading...</span>
          </div>
        )}

        <div className="space-y-4">
          {Array.isArray(cartItems) && cartItems.length === 0 && !loading && (
            <div className="text-center py-8">
              <p className="text-gray-400 text-lg">Your cart is empty.</p>
              <Link href="/" className="inline-block mt-4 px-5 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition">
                Shop Now
              </Link>
            </div>
          )}

          {Array.isArray(cartItems) && cartItems.map((item) => (
            <div
              key={item.productId + item.variant.type}
              className="border border-gray-200 bg-blue-50 rounded-xl shadow flex flex-col sm:flex-row justify-between items-center p-4 hover:shadow-lg transition"
            >
              <div className="flex-1 w-full">
                <a
                  href={item.href || `/products/${item.productId}`}
                  className="font-bold text-indigo-700 hover:underline text-lg"
                >
                  {item.name}
                </a>
                <p className="text-gray-500 text-sm mt-1">Color: <span className="font-medium">{item.variant.type}</span></p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateItemQuantity(item.productId, item.variant.type, item.quantity - 1)
                    }
                    className={`px-3 py-1 font-bold rounded-full shadow-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition ${item.quantity === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={item.quantity === 1}
                  >
                    −
                  </button>
                  <span className="inline-block w-8 text-center font-semibold text-lg">{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateItemQuantity(item.productId, item.variant.type, item.quantity + 1)
                    }
                    className="px-3 py-1 font-bold rounded-full shadow-sm border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-end mt-4 sm:mt-0 sm:ml-4 min-w-[100px]">
                <p className="text-xl font-bold text-blue-700">₹ {item.variant.price * item.quantity}</p>
                <button
                  onClick={() => deleteItem(item.productId, item.variant.type)}
                  className="text-red-600 text-xs mt-3 hover:underline hover:text-red-700 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center text-base font-semibold text-gray-800 border-t pt-4 mt-2">
          <p>Subtotal</p>
          <p className="text-xl text-blue-700 font-extrabold">₹{subtotal.toFixed(2)}</p>
        </div>

        <Link href="/checkout" passHref>
          <button
            className="flex w-full items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 px-6 py-3 text-lg font-bold text-white shadow hover:from-indigo-700 hover:to-blue-700 transition mt-2"
            disabled={cartItems.length === 0}
            style={{ opacity: cartItems.length === 0 ? 0.5 : 1, pointerEvents: cartItems.length === 0 ? 'none' : 'auto' }}
          >
            Proceed to Checkout
          </button>
        </Link>
      </div>
    </div>
  );
}