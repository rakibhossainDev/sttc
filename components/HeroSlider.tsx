"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

export default function HeroSlider() {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      spaceBetween={16}
      slidesPerView={1}
      className="rounded-xl shadow-sm overflow-hidden h-44 md:h-[400px] w-full"
    >
      <SwiperSlide>
        <div className="relative w-full h-full">
          <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80" alt="Tech Training 1" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative w-full h-full">
          <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80" alt="Tech Training 2" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative w-full h-full">
          <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80" alt="Tech Training 3" className="object-cover w-full h-full" />
          <div className="absolute inset-0 bg-black/10" />
        </div>
      </SwiperSlide>
    </Swiper>
  );
}
