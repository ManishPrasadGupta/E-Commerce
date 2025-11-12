"use client";

import { createContext, useState, useContext, ReactNode } from "react";

type PageLoaderContextType = {
  isLoading: boolean;
  showLoader: () => void;
  hideLoader: () => void;
};

const PageLoaderContext = createContext<PageLoaderContextType | undefined>(
  undefined
);

export const PageLoaderProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = () => setIsLoading(true);
  const hideLoader = () => setIsLoading(false);

  return (
    <PageLoaderContext.Provider value={{ isLoading, showLoader, hideLoader }}>
      {children}
    </PageLoaderContext.Provider>
  );
};

export const usePageLoader = () => {
  const context = useContext(PageLoaderContext);
  if (!context) {
    throw new Error("usePageLoader must be used within a PageLoaderProvider");
  }
  return context;
};
