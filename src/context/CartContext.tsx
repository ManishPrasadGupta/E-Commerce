"use client";

import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api-client";
import { useSession } from "next-auth/react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

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
  refetchCart: () => Promise<void>;
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

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const { status } = useSession();
  const { toast } = useToast();

  // Renamed from loadCart to refetchCart for clarity
  const refetchCart = useCallback(async () => {
    // Only fetch if the user is authenticated
    if (status === "authenticated") {
      setLoading(true);
      try {
        const data = await apiClient.fetchCart();
        setCartItems(data || []);
      } catch (err) {
        console.error("Error fetching cart", err);
        toast({
          title: "Error",
          description: "Could not load your cart.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    } else {
      // If not authenticated, ensure cart is empty and stop loading
      setCartItems([]);
      setLoading(false);
    }
  }, [status, toast]);

  // Initial load when session status changes
  useEffect(() => {
    refetchCart();
  }, [refetchCart]);

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
      // Always refetch from the server to get the single source of truth
      await refetchCart();
      toast({
        title: "Item added to cart",
        description: `${name} has been added to your cart.`,
      });
    } catch (err) {
      console.error("Error adding item to cart", err);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
      // Ensure loading is false on error
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
      // Refetch to get the updated state from the server
      await refetchCart();
    } catch (err) {
      console.error("Error updating cart item quantity", err);
      toast({
        title: "Error",
        description: "Failed to update item quantity.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const deleteItem = async (productId: string, variantType: string) => {
    setLoading(true);
    try {
      await apiClient.deleteCartItem(productId, variantType);

      await refetchCart();
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
    } catch (err) {
      console.error("Error removing item from cart", err);
      toast({
        title: "Error",
        description: "Failed to remove item from cart.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const clearCart = async () => {
    setLoading(true);
    try {
      await apiClient.clearCart();
      // Cart is empty, no need to refetch
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart", err);
      toast({
        title: "Error",
        description: "Failed to clear cart.",
        variant: "destructive",
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
        refetchCart,
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
