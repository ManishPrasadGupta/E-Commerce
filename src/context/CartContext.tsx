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
  }
  href?: string
};

type CartContextType = {
  cartItems: CartItem[];
  loading: boolean;
  loadCart: () => Promise<void>;
  deleteItem: (productId: string, variantType: string) => Promise<void>;
  updateItemQuantity: (productId: string, variantType: string, quantity: number) => Promise<void>;
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

    const updateItemQuantity = async (productId: string, variantType: string, quantity: number) => {
      setLoading(true);
      try {
        await apiClient.updateCartItemQuantity(productId, variantType, quantity);
        setCartItems((prev) =>
          prev.map((item) =>
            item.productId === productId && item.variant.type === variantType
              ? { ...item, quantity }
              : item
          )
        );
      } catch (err) {
        console.error("Error updating cart item quantity", err);
        alert("Failed to update item quantity.");
      } finally {
        setLoading(false);
      }
    };


  const deleteItem = async (productId: string, variantType: string) => {
    setLoading(true);
    try {

    await apiClient.deleteCartItem(productId, variantType);
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
    <CartContext.Provider value={{ cartItems, loading, loadCart, deleteItem, updateItemQuantity }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
