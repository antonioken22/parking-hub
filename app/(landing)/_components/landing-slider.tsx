import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import Image from "next/image";

import "@/app/globals.css";
import { ServiceData } from "@/app/(landing)/constants/testimonials";

export const LandingPageSlider = () => {
  return (
    <div className="flex items-center justify-center flex-col h-[700px] bg-transparent">
      <h1 className="font-extrabold text-customOrange text-4xl">
        Testimonials
      </h1>{" "}
      <p className="text-customOrange text-xl pb-8 pt-4">. . .</p>
      <Swiper
        breakpoints={{
          340: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          700: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
        }}
        freeMode={true}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet", // Custom class for pagination bullets
          bulletActiveClass: "swiper-pagination-bullet-active", // Custom class for active pagination bullet
        }}
        autoplay={{
          delay: 6000, // Time in ms between slides
          disableOnInteraction: false, // Continue autoplay after interaction
        }}
        loop={true} // Enable continuous loop
        modules={[Autoplay, FreeMode, Pagination]} // No Loop module needed
        className="w-full max-w-[100%] flex items-center justify-center"
      >
        {ServiceData.map((item) => (
          <SwiperSlide
            key={item.name}
            className="flex items-center justify-center"
          >
            <div className="flex flex-col gap-4 mb-12 group relative shadow-lg text-white rounded-xl px-4 py-6 h-[250px] w-[90vw] max-w-xs lg:h-[400px] lg:w-[350px] overflow-hidden cursor-pointer border-2 border-customOrange">
              {/* Background image or overlay */}
              <div className="absolute inset-0 bg-black opacity-50 group-hover:opacity-50" />
              <div className="relative flex flex-col gap-3 text-white group-hover:text-customOrange">
                <div className="absolute top-2 right-2 transform translate-y-[-10px]">
                  <item.icon className="text-customOrange group-hover:text-customOrange w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {item.avatar && (
                    <Image
                      src={item.avatar}
                      alt={`${item.name}'s avatar`}
                      width={70}
                      height={70}
                      className="avatar rounded-full border-2 border-white group-hover:border-customOrange"
                    />
                  )}
                  <div className="flex flex-col">
                    {item.name && (
                      <h2 className="text-base lg:text-lg font-semibold">
                        {item.name}
                      </h2>
                    )}
                    <h1 className="text-base lg:text-xl">{item.title}</h1>
                  </div>
                </div>
                <p className="text-sm lg:text-base mt-2">{item.content}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
