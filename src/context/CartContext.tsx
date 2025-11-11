"use client";

import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  productId: string;
  name: string;
  quantity: number;
  variant: {
    type: string;
    price: number;
  };
  href?: string;
};

type CartContextType = {
  cartItems: CartItem[];
  loading: boolean;
  loadCart: () => Promise<void>;
  deleteItem: (productId: string, variantType: string) => Promise<void>;
  updateItemQuantity: (
    productId: string,
    variantType: string,
    quantity: number
  ) => Promise<void>;
  addItem: (
    productId: string,
    variantType: string,
    quantity: number,
    name: string,
    price: number,
    href?: string
  ) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const { toast } = useToast();

  useEffect(() => {
    if (isLoggedIn) {
      loadCart();
    }
  }, [isLoggedIn]);

  const loadCart = async () => {
    setLoading(true);
    try {
      const data = await apiClient.fetchCart();
      setCartItems(data || []);
    } catch (err) {
      console.error("Error fetching cart", err);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (
    productId: string,
    variantType: string,
    quantity: number,
    name: string,
    price: number,
    href?: string
  ) => {
    setLoading(true);
    try {
      await apiClient.addToCart({
        productId,
        name,
        quantity,
        variant: { type: variantType, price },
        href,
      });

      // Check if item already exists in cart
      setCartItems((prev) => {
        const idx = prev.findIndex(
          (item) =>
            item.productId === productId && item.variant.type === variantType
        );
        if (idx !== -1) {
          // Item exists, update quantity
          const updated = [...prev];
          updated[idx] = {
            ...updated[idx],
            quantity: updated[idx].quantity + quantity,
          };
          return updated;
        } else {
          // New item
          return [
            ...prev,
            {
              productId,
              name,
              quantity,
              variant: { type: variantType, price },
              href,
            },
          ];
        }
      });
      toast({
        title: "Item added to cart",
        description: `${name} has been added to your cart.`,
      });
    } catch (err) {
      console.error("Error adding item to cart", err);
      // alert("Failed to add item to cart.");
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateItemQuantity = async (
    productId: string,
    variantType: string,
    quantity: number
  ) => {
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
      // alert("Failed to update item quantity.");
      toast({
        title: "Error",
        description: "Failed to update item quantity.",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (productId: string, variantType: string) => {
    setLoading(true);
    try {
      await apiClient.deleteCartItem(productId, variantType);
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(item.productId === productId && item.variant.type === variantType)
        )
      );
      // alert("Item removed from cart!");
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } catch (err) {
      console.error("Error removing item from cart", err);
      // alert("Failed to remove item from cart.");
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await apiClient.clearCart();
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart", err);
      // alert("Failed to clear cart.");
      toast({
        title: "Error",
        description: "Failed to clear cart.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        loadCart,
        deleteItem,
        updateItemQuantity,
        addItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
