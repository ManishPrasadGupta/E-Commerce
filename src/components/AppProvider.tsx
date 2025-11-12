"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";
import { SearchProvider } from "@/context/SearchContext/SearchContext";
import { PageLoaderProvider } from "@/context/PageLoaderContext/PageLoaderContext";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SearchProvider>
      <SessionProvider>
        <PageLoaderProvider>
          <CartProvider>{children}</CartProvider>
        </PageLoaderProvider>
      </SessionProvider>
    </SearchProvider>
  );
}
