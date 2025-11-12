"use client";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import Image from "next/image";
import { useState, useRef } from "react";

interface SlideData {
  title: string;
  button: string;
  src: string;
}

interface SlideProps {
  slide: SlideData;
  offset: number; // The position relative to the current slide (-1 for left, 0 for center, 1 for right)
  handleClick: () => void;
}

const Slide = ({ slide, offset, handleClick }: SlideProps) => {
  const { src, button, title } = slide;
  const slideRef = useRef<HTMLLIElement>(null);

  // Determine active state based on offset
  const active = offset === 0;

  // Apply different transforms based on the slide's offset
  const getTransform = () => {
    if (offset === 0) {
      return "translateX(0%) scale(1)";
    }
    if (offset === 1) {
      return "translateX(35%) scale(0.8) rotateY(-45deg)";
    }
    if (offset === -1) {
      return "translateX(-35%) scale(0.8) rotateY(45deg)";
    }
    // Hide slides that are further away
    return `translateX(${offset * 35}%) scale(0.8) rotateY(${
      offset > 0 ? -45 : 45
    }deg)`;
  };

  return (
    <li
      ref={slideRef}
      className="absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out"
      onClick={handleClick}
      style={{
        transform: getTransform(),
        zIndex: Math.abs(Math.abs(offset) - 2), // Center slide has highest z-index
        opacity: Math.abs(offset) > 1 ? 0 : 1, // Hide slides that are too far
      }}
    >
      <div className="relative w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden">
          <Image
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
            style={{ opacity: active ? 1 : 0.5 }}
            src={src}
            alt={title}
            fill
            priority
          />
          {active && <div className="absolute inset-0 bg-black/30" />}
        </div>

        <article
          className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center transition-opacity duration-300 ${
            active ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <h2 className="text-lg md:text-2xl lg:text-4xl font-semibold text-white">
            {title}
          </h2>
          <div className="flex justify-center">
            <button className="mt-6 px-4 py-2 w-fit mx-auto sm:text-sm text-black bg-white h-12 border border-transparent text-xs flex justify-center items-center rounded-2xl hover:shadow-lg transition duration-200 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
              {button}
            </button>
          </div>
        </article>
      </div>
    </li>
  );
};

interface CarouselControlProps {
  type: string;
  title: string;
  handleClick: () => void;
}

const CarouselControl = ({
  type,
  title,
  handleClick,
}: CarouselControlProps) => {
  return (
    <button
      className={`w-10 h-10 flex items-center mx-2 justify-center bg-neutral-200/80 dark:bg-neutral-800/80 rounded-full focus:outline-none hover:-translate-y-0.5 active:translate-y-0.5 transition duration-200 ${
        type === "previous" ? "rotate-180" : ""
      }`}
      title={title}
      onClick={handleClick}
    >
      <IconArrowNarrowRight className="text-neutral-600 dark:text-neutral-200" />
    </button>
  );
};

interface CarouselProps {
  slides: SlideData[];
}

export default function Carousel({ slides }: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const handlePreviousClick = () => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : slides.length - 1));
  };

  const handleNextClick = () => {
    setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : 0));
  };

  // const id = useId();

  return (
    <div className="relative w-full h-[70vmin] flex flex-col items-center justify-center">
      <div
        className="relative w-[70vmin] h-full"
        style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
      >
        <ul className="relative w-full h-full">
          {slides.map((slide, index) => (
            <Slide
              key={index}
              slide={slide}
              offset={index - current}
              handleClick={() => setCurrent(index)}
            />
          ))}
        </ul>
      </div>

      <div className="mt-8 flex justify-center">
        <CarouselControl
          type="previous"
          title="Go to previous slide"
          handleClick={handlePreviousClick}
        />
        <CarouselControl
          type="next"
          title="Go to next slide"
          handleClick={handleNextClick}
        />
      </div>
    </div>
  );
}
