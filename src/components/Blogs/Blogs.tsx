
import { SeparatorHorizontal } from 'lucide-react';
import React from 'react'

function Blogs() {
  return (
    <div className="py-16">
      <SeparatorHorizontal className="bg-gray-200 h-[2px] w-3/4 my-8 mx-auto" />
      <h1 className="text-center text-4xl md:text-5xl font-extrabold p-6 text-gray-800 tracking-tight">
        Blogs
      </h1>
      <p className="text-center text-5xl md:text-7xl font-bold text-gray-400 mb-10">
        Coming Soon...
      </p>
      <SeparatorHorizontal className="bg-gray-200 h-[2px] w-3/4 my-8 mx-auto" />
    </div>
  )
}

export default Blogs;
