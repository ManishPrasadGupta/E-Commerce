"use client";
import dynamic from "next/dynamic";

// Dynamic import with ssr: false is allowed in client components
const GridAds = dynamic(
  () => import("@/components/GridAdsShowCase/GridAds").then((mod) => mod.default),
  { ssr: false }
);

export default function GridAdsClientWrapper() {
  return <GridAds />;
}