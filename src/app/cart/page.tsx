'use client';

import CartSlideOver from "@/components/Cart/CartSlideOver";
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
  // image?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(true);


  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await apiClient.fetchCart();
      // console.log("Cart data:", data);

      setCartItems(data || []);
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  
  const deleteItem = async (productId: string) => {
    setLoading(true);
    try {

    await apiClient.deleteCartItem(productId);
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
    alert("Item removed from cart!");
        
    } catch (err) {
        console.error("Error removing item from cart", err);
        alert("Failed to remove item from cart.");
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

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

        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          View Cart
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

      <CartSlideOver open={isCartOpen} setOpen={setIsCartOpen} />
    </div>
  );
}
