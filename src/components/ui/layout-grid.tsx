"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import "../../../public/GridAd/flip-180.css";
import Image from "next/image";

type Card = {
  id: number;
  content: React.ReactNode | string;
  thumbnail: string;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const isMobile = useIsMobile();

  // For flip logic (desktop)
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  // For slider logic (mobile)
  const [sliderIndex, setSliderIndex] = useState(0);

  // Touch events for swipe on mobile
  let touchStartX = 0;
  let touchEndX = 0;

  const handleCardClick = (idx: number) => {
    if (isTouchDevice()) {
      setFlippedIndex(flippedIndex === idx ? null : idx);
    }
  };

  const goToPrev = () => setSliderIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  const goToNext = () => setSliderIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1));

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchEndX - touchStartX > 50) goToPrev();
    if (touchStartX - touchEndX > 50) goToNext();
  };

  if (isMobile) {
    // --- MOBILE SLIDER ---
    return (
      <div className="relative w-full max-w-md mx-auto">
        <div
          className="overflow-hidden rounded-xl shadow-lg bg-slate-700"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${sliderIndex * 100}%)` }}
          >
            {cards.map((card) => (
              <div
                className="w-full flex-shrink-0 flex flex-col items-center p-6"
                key={card.id}
              >
                <Image
                  src={card.thumbnail}
                  alt="thumbnail"
                  className="w-full h-48 object-cover rounded-xl mb-4"
                  width={500}
                  height={192}
                  priority
                />
                {/* <img
                  src={card.thumbnail}
                  alt="thumbnail"
                  className="w-full h-48 object-cover rounded-xl mb-4"
                /> */}
                <div className="text-center text-black">{card.content}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Navigation buttons */}
        <button
          className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-25 text-white p-2 rounded-full"
          onClick={goToPrev}
          aria-label="Previous"
        >
          &#8592;
        </button>
        <button
          className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-25 text-white p-2 rounded-full"
          onClick={goToNext}
          aria-label="Next"
        >
          &#8594;
        </button>
        {/* Dots */}
        <div className="flex justify-center mt-4 gap-2">
          {cards.map((_, i) => (
            <button
              key={i}
              className={`h-2 w-2 rounded-full ${i === sliderIndex ? "bg-blue-600" : "bg-gray-400"}`}
              onClick={() => setSliderIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // --- DESKTOP GRID WITH FLIP ---
  return (
    <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card, i) => (
        <div key={i} className="flip-container">
          <div
            className={cn(
              "flip-card",
              isTouchDevice() && flippedIndex === i && "flipped"
            )}
            onClick={() => handleCardClick(i)}
          >
            {/* Front */}
            <div className="flip-front bg-pink rounded-xl h-full w-full flex flex-col justify-center items-center ">
              <ImageComponent card={card} />
            </div>
            {/* Back */}
            <div className="flip-back bg-gradient-to-br from-pink-500 to-blue-500 text-white rounded-xl h-full w-full flex flex-col justify-center items-center">
              <SelectedCard selected={card} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail}
      height="500"
      width="500"
      className={cn(
        "object-cover object-top absolute inset-0 h-full w-full transition duration-200"
      )}
      alt="thumbnail"
    />
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-end rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.6,
        }}
        className="absolute inset-0 h-full w-full bg-black opacity-60 z-10"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{
          opacity: 0,
          y: 100,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 100,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className="relative px-8 pb-4 z-[70]"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-expect-error: msMaxTouchPoints is for IE/Edge support
    navigator.msMaxTouchPoints > 0
  );
}