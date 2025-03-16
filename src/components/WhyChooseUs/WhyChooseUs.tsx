
import { SeparatorHorizontal } from 'lucide-react'
import React from 'react'

function WhyChooseUs() {
  return (
    <div className="flex flex-col ">
      <h1 className='flex text-4xl p-4 pl-60 font-bold '>Why Choose Us?</h1>
      <div className='flex justify-start w-[55%] pl-60 '>
        <p className=' text-left text-wrap'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.</p>
      </div>

        
      <SeparatorHorizontal className="bg-gray-300 h-[3px] w-3/4 my-6 mx-auto" />
    </div>
  )
}

export default WhyChooseUs
