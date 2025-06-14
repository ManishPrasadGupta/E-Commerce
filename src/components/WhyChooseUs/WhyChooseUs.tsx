"use client";
import { SeparatorHorizontal } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import '../../app/styles/why-choose-us-bg.css' 

function WhyChooseUs() {
  // Controls for Framer Motion
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  // You can adjust these values to match your button's "starting" point
  const fromBottomVariants = {
    hidden: { opacity: 0, y: 120, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 1,
        bounce: 0.2,
      },
    },
  };

  return (
    <div className="container-bg py-16 relative">
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={fromBottomVariants}
        className="relative z-10"
      >
        <h1 className="text-center text-4xl md:text-5xl font-extrabold pt-8 pb-6 text-gray-100 tracking-tight">
          Why Choose Us?
        </h1>
        <div className="flex items-center justify-center">
          <p className="text-center w-full lg:w-2/3 max-w-2xl mx-auto px-4 text-gray-200 text-lg leading-relaxed">
            At Electech, we blend innovation with trust to deliver an exceptional shopping experience. Enjoy exclusive access to the latest gadgets, unbeatable prices, and lightning-fast delivery. Our dedicated support team is always here for you, ensuring your satisfaction every step of the way. Choose us for quality, value, and peace of mind—because you deserve the best in tech!
          </p>
        </div>
        <SeparatorHorizontal className="bg-gray-200 h-[2px] w-3/4 my-10 mx-auto" />
      </motion.div>
    </div>
  );
}

export default WhyChooseUs;