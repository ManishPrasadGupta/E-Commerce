"use client";
import { SeparatorHorizontal } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import "../../app/styles/why-choose-us-bg.css";
import type { Variants } from "framer-motion";

const fromBottomVariants: Variants = {
  hidden: { opacity: 0, y: 120, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 1,
      ease: [0.16, 0.84, 0.44, 1],
      delay: 0.05,
    },
  },
};

function WhyChooseUs() {
  // Controls for Framer Motion
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <section className="relative py-20 min-h-[350px] flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900/70">
      {/* Decorative glass gradient */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-64 bg-gradient-to-r from-cyan-400/20 via-blue-300/10 to-transparent blur-3xl opacity-80 pointer-events-none z-0"
      />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fromBottomVariants}
        className="relative z-10 w-full"
      >
        <h1 className="text-center text-4xl md:text-5xl font-extrabold py-8 tracking-tight bg-gradient-to-r from-cyan-400 via-blue-300 to-indigo-500 bg-clip-text text-transparent drop-shadow">
          Why Choose Us?
        </h1>
        <div className="flex items-center justify-center">
          <p className="text-center w-full lg:w-2/3 max-w-2xl mx-auto px-4 text-slate-50/90 text-lg md:text-xl leading-relaxed font-medium backdrop-blur-lg rounded-2xl bg-white/10 shadow-lg py-6">
            At <span className="font-semibold text-cyan-300">Electech</span>, we
            blend innovation with trust to deliver an exceptional shopping
            experience. Enjoy exclusive access to the latest gadgets, unbeatable
            prices, and lightning-fast delivery.
            <br className="hidden md:inline" /> Our dedicated support team is
            always here for you, ensuring your satisfaction every step of the
            way. <span className="font-semibold text-cyan-300">Choose us</span>{" "}
            for quality, value, and peace of mind—because you deserve the best
            in tech!
          </p>
        </div>
        <SeparatorHorizontal className="bg-gradient-to-r from-cyan-400/30 via-slate-300/10 to-blue-400/30 h-[2px] w-3/4 my-10 mx-auto" />
      </motion.div>
    </section>
  );
}

export default WhyChooseUs;
