"use client";

import React from "react";
import Link from "next/link";
import { motion, Variants, useReducedMotion } from "framer-motion";
import { ImagesSlider } from "../ui/images-slider";
import { TypewriterEffectSmooth } from "../ui/typewriter-effect";
import { words } from "../HeroScetion/TypewriterWords";

// Typed cubic-bezier must be a 4-number tuple, not number[]
const EASE_OUT_EXPO = [0.16, 0.84, 0.44, 1] as const;

const containerVariants: Variants = {
  hidden: { opacity: 0, y: -80 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

const subVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO, delay: 0.08 },
  },
};

const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_EXPO, delay: 0.16 },
  },
};

function HeroSection() {
  const shouldReduceMotion = useReducedMotion();

  const images = [
    "https://blog.matthewgove.com/wp-content/uploads/2021/08/apple-hero-image.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqdFWaLFXTKE-KGKzZnNynBJFQQi3Ve0Brrw&s",
    "https://d585tldpucybw.cloudfront.net/sfimages/default-source/blogs/2021/2021-02/Honeydue-hero-image-design-mobile.png",
    "https://img.freepik.com/premium-psd/ivory-modern-gradient-electronic-marketplace-hero-section-template_637394-1015.jpg",
  ];

  return (
    <section aria-labelledby="hero-heading" className="w-full">
      <ImagesSlider className="relative h-[40rem] w-full mb-3" images={images}>
        {/* Legibility overlay and accent glows */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-screen opacity-60 bg-[radial-gradient(40%_40%_at_50%_50%,rgba(56,189,248,0.25),transparent)]"
        />
        <motion.div
          initial={shouldReduceMotion ? undefined : "hidden"}
          animate={shouldReduceMotion ? undefined : "show"}
          variants={containerVariants}
          className="relative z-10 h-full w-full flex flex-col items-center justify-center px-4 text-center"
        >
          <motion.h1
            id="hero-heading"
            variants={containerVariants}
            className="font-extrabold text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 leading-tight"
          >
            <span className="block mb-2 text-white">
              Discover Your Next Favorite Product
            </span>
          </motion.h1>

          <motion.div variants={subVariants} className="mt-1">
            <TypewriterEffectSmooth words={words} />
          </motion.div>

          {/* <motion.div variants={ctaVariants} className="mt-6">
            <Link
              href="/productsgallery"
              className="animated-button"
              aria-label="Start shopping now"
            >
              <span className="circle"></span>
              <span className="text">Start Shopping</span>
              <svg className="arr-1" viewBox="0 0 19 19" aria-hidden="true">
                <path d="M13.29 9.29l-4.88-4.88a1 1 0 0 0-1.41 1.41L10.17 9H3a1 1 0 1 0 0 2h7.17l-3.17 3.17a1 1 0 1 0 1.41 1.41l4.88-4.88a1 1 0 0 0 0-1.41z"></path>
              </svg>
              <svg className="arr-2" viewBox="0 0 19 19" aria-hidden="true">
                <path d="M13.29 9.29l-4.88-4.88a1 1 0 0 0-1.41 1.41L10.17 9H3a1 1 0 1 0 0 2h7.17l-3.17 3.17a1 1 0 1 0 1.41 1.41l4.88-4.88a1 1 0 0 0 0-1.41z"></path>
              </svg>
            </Link>
          </motion.div> */}
        </motion.div>
      </ImagesSlider>
    </section>
  );
}

export default HeroSection;
