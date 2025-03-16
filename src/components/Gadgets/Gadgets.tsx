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
    <div className="relative overflow-hidden w-full h-full py-20">
  
      <Carousel slides={slideData} />
    </div>
  );
}
