'use client'
import React from 'react'
import { motion } from "framer-motion";
import { ImagesSlider } from "../ui/images-slider";
import Link from 'next/link';
import { TypewriterEffectSmooth } from '../ui/typewriter-effect';
import { words } from '../HeroScetion/TypewriterWords';



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
          <motion.p className="font-bold text-lg md:text-5xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
            <span className="block mb-2 text-white animate-fadeInUp delay-150">Discover Your Next Favorite Product</span>
          </motion.p>
          <TypewriterEffectSmooth words={words} />
            <Link href="/productsgallery" passHref className="animated-button">
              <span className="circle"></span>
              <span className="text">Start Shopping</span>
              <svg className="arr-1" viewBox="0 0 19 19">
                <path d="M13.29 9.29l-4.88-4.88a1 1 0 0 0-1.41 1.41L10.17 9H3a1 1 0 1 0 0 2h7.17l-3.17 3.17a1 1 0 1 0 1.41 1.41l4.88-4.88a1 1 0 0 0 0-1.41z"></path>
              </svg>
              <svg className="arr-2" viewBox="0 0 19 19">
                <path d="M13.29 9.29l-4.88-4.88a1 1 0 0 0-1.41 1.41L10.17 9H3a1 1 0 1 0 0 2h7.17l-3.17 3.17a1 1 0 1 0 1.41 1.41l4.88-4.88a1 1 0 0 0 0-1.41z"></path>
              </svg>
            </Link>
          </motion.div>
         </ImagesSlider>
         
      );
}

export default HeroSection;
