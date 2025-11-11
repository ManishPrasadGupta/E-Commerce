"use client";

import { SeparatorHorizontal } from "lucide-react";
import React, { useRef, useEffect } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { useInView } from "framer-motion";

const fromBottomVariants: Variants = {
  hidden: { opacity: 0, y: 120, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 1,
      bounce: 0.24,
      delay: 0.05,
    },
  },
};

function AboutUs() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-120px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section className="relative py-16 min-h-[350px] flex flex-col items-center justify-center bg-gradient-to-t from-blue-950 via-slate-900 to-blue-900/40">
      {/* Decorative glass effect / soft gradient */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle at 60% 40%,rgba(56,189,248,0.12),transparent 70%)",
        }}
      />
      <SeparatorHorizontal className="bg-gradient-to-r from-blue-300/30 via-slate-400/10 to-blue-400/30 h-[2px] w-3/4 my-8 mx-auto" />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fromBottomVariants}
        className="relative z-10 bg-white/10 backdrop-blur-md rounded-3xl shadow-lg max-w-2xl mx-auto p-8 md:p-12"
      >
        <h1 className="text-center text-4xl md:text-5xl font-extrabold py-4 tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-600 bg-clip-text text-transparent drop-shadow">
          About Us
        </h1>
        <p className="text-center text-lg md:text-xl font-medium leading-relaxed text-slate-100/90">
          At <span className="font-semibold text-cyan-300">Electech</span>, we
          are passionate about bringing you the latest trends, exclusive deals,
          and unbeatable prices—all in one place.
          <br className="hidden md:inline" /> Our mission is to make shopping
          for electronics simple, enjoyable, and accessible to everyone.
        </p>
      </motion.div>
      <SeparatorHorizontal className="bg-gradient-to-r from-blue-300/30 via-slate-400/10 to-blue-400/30 h-[2px] w-3/4 my-8 mx-auto" />
    </section>
  );
}

export default AboutUs;
