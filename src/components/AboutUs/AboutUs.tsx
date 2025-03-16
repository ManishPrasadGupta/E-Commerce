'use client'


import { SeparatorHorizontal } from 'lucide-react'
import React from 'react'

function AboutUs() {
  return (
    <div>
      <SeparatorHorizontal className="bg-gray-300 h-[3px] w-3/4 my-6 mx-auto" />
      <h1 className='flex justify-center text-4xl pt-14 pb-6 font-bold'>About Us</h1>
      <div className='flex items-center justify-center'>
        <p className=' text-center w-1/2 '>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p>

      </div>
      <SeparatorHorizontal className="bg-gray-300 h-[2px] w-3/4 my-6 mx-auto" />
    </div>
  )
}

export default AboutUs
