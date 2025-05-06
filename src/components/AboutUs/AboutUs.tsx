'use client'


import { SeparatorHorizontal } from 'lucide-react'
import React from 'react'

function AboutUs() {
  return (
    <div className="py-12">
  <SeparatorHorizontal className="bg-gray-200 h-[2px] w-3/4 my-8 mx-auto" />
  <h1 className="text-center text-4xl md:text-5xl font-extrabold pt-8 pb-4 text-gray-800 tracking-tight">
    About Us
  </h1>
  <div className="flex items-center justify-center">
    <p className="text-center w-full lg:w-1/2 max-w-xl mx-auto px-4 text-gray-600 text-lg">
      At Electronics, we are passionate about bringing you the latest trends, exclusive deals, and unbeatable prices—all in one place. Our mission is to make shopping for electronics simple, enjoyable, and accessible to everyone.
    </p>
  </div>
  <SeparatorHorizontal className="bg-gray-200 h-[2px] w-3/4 my-8 mx-auto" />
</div>
  )
}

export default AboutUs;
