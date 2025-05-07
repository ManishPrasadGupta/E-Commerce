"use client";

import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartItems, loading, loadCart, deleteItem, updateItemQuantity } = useCart();

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
            key={item.productId + item.variant.type}
            className="border p-4 rounded shadow-sm flex justify-between"
          >
            <div>
              <a
                href={item.href || `/products/${item.productId}`}
                className="font-bold text-blue-600 hover:underline"
              >
                {item.name}
              </a>
              <p>Color: {item.variant.type}</p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    item.quantity > 1 &&
                    updateItemQuantity(item.productId, item.variant.type, item.quantity - 1)
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                  disabled={item.quantity === 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateItemQuantity(item.productId, item.variant.type, item.quantity + 1)
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <p>₹ {item.variant.price * item.quantity}</p>
              <button
                onClick={() => deleteItem(item.productId, item.variant.type)}
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