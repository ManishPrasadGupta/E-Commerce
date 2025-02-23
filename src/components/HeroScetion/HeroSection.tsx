'use client'
import React from 'react'
import { motion } from "framer-motion";
import { ImagesSlider } from "../ui/images-slider";


function HeroSection() {
    const images = [
        "https://blog.matthewgove.com/wp-content/uploads/2021/08/apple-hero-image.jpg",
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqdFWaLFXTKE-KGKzZnNynBJFQQi3Ve0Brrw&s",
        "https://d585tldpucybw.cloudfront.net/sfimages/default-source/blogs/2021/2021-02/Honeydue-hero-image-design-mobile.png",
        "https://img.freepik.com/premium-psd/ivory-modern-gradient-electronic-marketplace-hero-section-template_637394-1015.jpg"
      ];
      return (
        <ImagesSlider className="h-[40rem] w-full mb-3" images={images}>
          <motion.div
            initial={{
              opacity: 0,
              y: -80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="z-50 flex flex-col justify-center items-center"
          >
            <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
              The hero section slideshow <br /> nobody asked for
            </motion.p>
            <button className="px-4 py-2 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20 text-white mx-auto text-center rounded-full relative mt-4">
              <span>Start Shopping →</span>
              <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-emerald-500 to-transparent" />
            </button>
          </motion.div>
          
         </ImagesSlider>
         
      );
}

export default HeroSection;
