'use client';

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext/SearchContext";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SearchProvider>
      <SessionProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </SessionProvider>
    </SearchProvider>
  );
}