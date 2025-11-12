"use client";
import { useEffect } from "react";
import Header from "@/components/Navbar/Header";
import { Toaster } from "@/components/ui/toaster";
import { usePageLoader } from "@/context/PageLoaderContext/PageLoaderContext";
import PageLoader from "./pageLoader";

export default function LoaderShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const { showLoader, hideLoader } = usePageLoader();

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => hideLoader(), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageLoader />
      <Header />
      <main>{children}</main>
      <Toaster />
    </>
  );
}
