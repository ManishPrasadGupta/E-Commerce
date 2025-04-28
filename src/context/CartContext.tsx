'use client'

import { apiClient } from '@/lib/api-client';
import { createContext, useContext, useEffect, useState } from 'react'

export type CartItem = {
  productId: string
  name: string
  quantity: number
  variant: {
    type: string
    price: number
  };
};

type CartContextType = {
  cartItems: CartItem[];
  loading: boolean;
  loadCart: () => Promise<void>;
  deleteItem: (productId: string) => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

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
    <CartContext.Provider value={{ cartItems, loading, loadCart, deleteItem }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
