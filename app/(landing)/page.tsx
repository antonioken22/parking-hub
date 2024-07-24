"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { LandingNavbar } from "./_components/landing-navbar";
import { LandingHero } from "./_components/landing-hero";
//import { LandingContent } from "./_components/landing-content";
import LandingPageSlider from "./_components/landing-slider";
import LandingBg1 from "@/public/landing-bg-sal0.jpg";
import LandingBg2 from "@/public/landing-bg-sal1.jpg";
import LandingBg3 from "@/public/landing-bg-sal2.jpg";
import LandingBg4 from "@/public/landing-bg-gle0.jpg";

const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState(LandingBg1);

  useEffect(() => {
    const images = [LandingBg1, LandingBg2, LandingBg3, LandingBg4];
    let currentIndex = 0;

    const interval = setInterval(() => {
      setCurrentImage(images[currentIndex]);
      currentIndex = (currentIndex + 1) % images.length;
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen">
      <AnimatePresence>
        <motion.div
          key={currentImage.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <Image
            alt="Landing Page"
            src={currentImage}
            fill
            className="absolute inset-0 object-cover dark:hidden opacity-20"
            placeholder="blur"
            priority
          />
          <Image
            alt="Landing Page"
            src={currentImage}
            fill
            className="absolute inset-0 object-cover hidden dark:block opacity-20"
            placeholder="blur"
            priority
          />
        </motion.div>
      </AnimatePresence>
      <div className="relative z-10">
        <LandingNavbar />
        <LandingHero />
        
        <LandingPageSlider />
      </div>
    </div>
  );
};

export default LandingPage;
