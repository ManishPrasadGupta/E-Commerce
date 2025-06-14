"use client";
import React, { useState, useEffect } from "react";
import { LayoutGrid } from "../ui/layout-grid";
import { getAds } from "@/lib/api-client"; 

type Card = {
  id: number;
  content: React.ReactNode | string;
  thumbnail: string;
};

type AdResponse = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
};

const Skeleton = ({ title, description }: { title: string; description: string }) => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">{title}</p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">{description}</p>
  </div>
);

export default function LayoutGridDemo() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAds() {
      try {
        const data = await getAds();
        // `data.gridAds` is the array returned from your backend
        const formatted = data.gridAds.map((ad: AdResponse, idx: number) => ({
          id: ad._id || idx,
          content: (
            <Skeleton
              title={ad.title}
              description={ad.description}
            />
          ),
          thumbnail: ad.thumbnail,
        }));
        setCards(formatted);
      } catch (err) {
        // Use a type guard for error
        if (err instanceof Error) {
          setError(err.message || "Error loading ads");
        } else {
          setError("Error loading ads");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchAds();
  }, []);

  if (loading) return <div className="text-center text-white">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="h-screen py-20 w-full bg-black">
      <LayoutGrid cards={cards} />
    </div>
  );
}

