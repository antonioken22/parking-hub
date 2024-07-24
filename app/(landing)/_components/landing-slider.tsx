import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/free-mode";
import "swiper/css/autoplay"; // Ensure Autoplay CSS is imported

import { Autoplay, FreeMode, Pagination } from "swiper/modules"; // No need to import Loop
import { RxArrowTopRight } from "react-icons/rx";
import { ServiceData } from "@/app/(landing)/constants/testimonials";
import '@/app/globals.css'; // Adjust the path as necessary

const LandingPageSlider = () => {
  return (
    <div className="flex items-center justify-center flex-col h-[700px] bg-transparent">
      <h1 className="font-extrabold text-customOrange text-4xl">Testimonials</h1> {/* Changed color to custom orange */}
      <p className="text-customOrange text-xl pb-8 pt-4">. . .</p>
      <Swiper
        breakpoints={{
          340: {
            slidesPerView: 3,
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
          delay: 3000, // Time in ms between slides
          disableOnInteraction: false, // Continue autoplay after interaction
        }}
        loop={true} // Enable continuous loop
        modules={[Autoplay, FreeMode, Pagination]} // No Loop module needed
        className="max-w-[80%] lg:max-w-[100%]"
      >
        {ServiceData.map((item) => (
          <SwiperSlide key={item.title}>
            <div className="flex flex-col gap-6 mb-20 group relative shadow-lg text-white rounded-xl px-6 py-8 h-[250px] w-[215px] lg:h-[400px] lg:w-[350px] overflow-hidden cursor-pointer border-2 border-customOrange"> {/* Changed border color to custom orange */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${item.backgroundImage})` }}
              />
              <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-50" />
              <div className="relative flex flex-col gap-3 text-white group-hover:text-customOrange"> {/* Changed hover text color to custom orange */}
                <item.icon className="text-customOrange group-hover:text-customOrange w-[32px] h-[32px]" /> {/* Changed icon color to custom orange */} 
                {item.name && (
                  <h2 className="text-lg lg:text-xl font-semibold">{item.name}</h2>
                )}
                {item.avatar && (
                  <div className="text-sm lg:text-md">{item.avatar}</div>
                )}
                <h1 className="text-xl lg:text-2xl">{item.title} </h1>
                <p className="lg:text-[18px]">{item.content} </p>
              </div>
              <RxArrowTopRight className="absolute bottom-5 left-5 w-[35px] h-[35px] text-white group-hover:text-customOrange group-hover:rotate-45 duration-100" /> {/* Changed arrow color to custom orange */}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default LandingPageSlider;
