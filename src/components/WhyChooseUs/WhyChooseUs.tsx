
import { SeparatorHorizontal } from 'lucide-react'
import React from 'react'

function WhyChooseUs() {
  return (
    <div className="py-16">
      <h1 className="text-center text-4xl md:text-5xl font-extrabold pt-8 pb-6 text-gray-800 tracking-tight">
        Why Choose Us?
      </h1>
      <div className="flex items-center justify-center">
        <p className="text-center w-full lg:w-2/3 max-w-2xl mx-auto px-4 text-gray-700 text-lg leading-relaxed">
          At Electronics, we blend innovation with trust to deliver an exceptional shopping experience. Enjoy exclusive access to the latest gadgets, unbeatable prices, and lightning-fast delivery. Our dedicated support team is always here for you, ensuring your satisfaction every step of the way. Choose us for quality, value, and peace of mind—because you deserve the best in tech!
        </p>
      </div>
      <SeparatorHorizontal className="bg-gray-200 h-[2px] w-3/4 my-10 mx-auto" />
    </div>
  )
}

export default WhyChooseUs;



