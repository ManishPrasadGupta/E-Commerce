'use client';


import { useCart } from "@/context/CartContext";
import { apiClient } from "@/lib/api-client";
import { useEffect, useState } from "react";

export type CartItem = {
  productId: string
  name: string
  quantity: number
  variant: {
    type: string
    price: number
  }
}

export default function CartPage() {
  // const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const { cartItems, loading, loadCart, deleteItem } = useCart();
  


  


  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">🛒 Cart Items</h1>
      <div className="flex space-x-4">
        <button
          onClick={loadCart}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Fetch Cart
        </button>
      </div>

      {loading && <p>Loading...</p>}

      <div className="space-y-4">
          {Array.isArray(cartItems) && cartItems.map((item) => (
          <div
            key={item.productId ||  `${item.name}-${item.variant.type}`}
            className="border p-4 rounded shadow-sm flex justify-between"
          >
            <div>
              <p><strong>{item.name}</strong></p>
              {/* <p>Color: {item.color}</p> */}
  
              <p>Color: {item.variant.type}</p>

              <p>Quantity: {item.quantity}</p>
            </div>
            <div>
              <p>₹ {item.variant.price}</p>
              <button
                onClick={() => deleteItem(item.productId)}
                className="text-red-600 text-sm hover:underline mt-2"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
