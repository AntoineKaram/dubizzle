"use client";

import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
interface ImageCarouselProps {
  images: string[];
}

export default function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    loop: false,
    drag: true,
    slideChanged: (s) => setCurrentSlide(s.track.details.rel),
  });

  if (images.length === 0) return null;

  return (
    <div className="relative rounded-lg overflow-hidden border aspect-[4/3] cursor-grab">
      <div ref={sliderRef} className="keen-slider w-full h-full">
        {images.map((img, i) => (
          <div key={i} className="keen-slider__slide">
            <img
              src={img}
              alt={`Image ${i}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={() => slider?.current?.prev()}
            className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 p-2 rounded-full shadow transition cursor-pointer"
            disabled={currentSlide === 0}
          >
            <FaChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => slider?.current?.next()}
            className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 p-2 rounded-full shadow transition cursor-pointer"
            disabled={currentSlide === images.length - 1}
          >
            <FaChevronRight className="w-5 h-5" />
          </button>
        </>
      )}
    </div>
  );
}
