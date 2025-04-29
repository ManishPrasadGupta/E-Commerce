'use client'


import { SeparatorHorizontal } from 'lucide-react'
import React from 'react'

function AboutUs() {
  return (
    <div>
      <SeparatorHorizontal className="bg-gray-300 h-[3px] w-3/4 my-6 mx-auto" />
      <h1 className='flex justify-center text-4xl pt-14 pb-6 font-bold'>About Us</h1>
      <div className='flex items-center justify-center'>
        <p className=' text-center w-1/2 '>At Electronics, we are passionate about bringing you the latest trends, exclusive deals, and unbeatable prices—all in one place. Our mission is to make shopping for electronics simple, enjoyable, and accessible to everyone.</p>

      </div>
      <SeparatorHorizontal className="bg-gray-300 h-[2px] w-3/4 my-6 mx-auto" />
    </div>
  )
}

export default AboutUs
