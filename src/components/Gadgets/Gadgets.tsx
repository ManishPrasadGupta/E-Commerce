"use client";

import Carousel from "@/components/ui/carousel";

export default function Gadgets() {
  const slideData = [
    {
      title: "Phones",
      button: "Explore",
      src: "https://www.zdnet.com/a/img/resize/bb5123bd92b02358f511f10e61959f05de23d226/2024/09/20/749bdace-bab4-432c-861d-bb2edb609601/img-0038.jpg?auto=webp&fit=crop&height=675&width=1200",
    },
    {
      title: "Earphones/Headphones",
      button: "Explore",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuJa2kIggo4d7Espgb35SmfQ5YQpQWAzut5A&s",
    },
    {
      title: "Accessories",
      button: "Explore",
      src: "https://5.imimg.com/data5/SELLER/Default/2021/6/EM/RB/VH/132553765/all-mobile-phone-accessories-500x500.jpg",
    },
    {
      title: "Speakers",
      button: "Explore",
      src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5X3wgLd1eYw01aAy-6lSdFT_bFrQvKzG0MA&s",
    },
  ];

  return (
    // The fix is adding `overflow-x-hidden` to this section element
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-slate-900 via-black to-slate-800 overflow-x-hidden">
      {/* Decorative glass blob */}
      <div
        aria-hidden
        className="absolute top-0 left-0 w-full h-56 bg-gradient-to-tr from-cyan-400/20 via-sky-400/10 to-transparent blur-3xl opacity-70 -z-10"
      />
      <div className="relative w-full max-w-5xl mx-auto">
        <h1 className="text-center text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-700 bg-clip-text text-transparent pt-14 pb-4 drop-shadow">
          Gadgets
        </h1>
        <p className="text-center text-lg mb-10 font-medium text-slate-400 px-4">
          Explore top tech—phones, headphones, accessories, and speakers,
          handpicked for you.
        </p>
        <div className="px-2 md:px-0 pt-2">
          <Carousel slides={slideData} />
        </div>
      </div>
    </section>
  );
}
