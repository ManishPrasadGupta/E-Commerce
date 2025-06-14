'use client'

import { SeparatorHorizontal } from 'lucide-react'
import React, { useRef, useEffect } from 'react'
import { motion, useAnimation, Variants } from 'framer-motion'
import { useInView } from 'framer-motion'

const fromBottomVariants: Variants = {
  hidden: { opacity: 0, y: 120, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      duration: 1,
      bounce: 0.2,
    },
  },
};

function AboutUs() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <div className="py-12">
      <SeparatorHorizontal className="bg-gray-200 h-[2px] w-3/4 my-8 mx-auto" />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fromBottomVariants}
        className="relative z-10"
      >
        <h1 className="text-center text-4xl md:text-5xl font-extrabold pt-8 pb-4 text-gray-800 tracking-tight">
          About Us
        </h1>
        <div className="flex items-center justify-center">
          <p className="text-center w-full lg:w-1/2 max-w-xl mx-auto px-4 text-gray-600 text-lg">
            At Electech, we are passionate about bringing you the latest trends, exclusive deals, and unbeatable prices—all in one place. Our mission is to make shopping for electronics simple, enjoyable, and accessible to everyone.
          </p>
        </div>
      </motion.div>
      <SeparatorHorizontal className="bg-gray-200 h-[2px] w-3/4 my-8 mx-auto" />
    </div>
  )
}

export default AboutUs;