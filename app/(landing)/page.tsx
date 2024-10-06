"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { LandingNavbar } from "./_components/landing-navbar";
import { LandingHero } from "./_components/landing-hero";
import { LandingPageSlider } from "./_components/landing-slider";

import FlashyLandingPageBackground from "@/public/parking-hub-landing-flashy.png";
import SALParkingSlot0Centered from "@/public/landing-bg-sal0-centered.png";
import GLEParkingSlot0 from "@/public/landing-bg-gle0.jpg";

const LandingPage = () => {
  const [currentImage, setCurrentImage] = useState(FlashyLandingPageBackground);

  useEffect(() => {
    const images = [FlashyLandingPageBackground];
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
            className="absolute inset-0 object-cover dark:hidden opacity-90"
            placeholder="blur"
            quality={100}
            priority
          />
          <Image
            alt="Landing Page"
            src={currentImage}
            fill
            className="absolute inset-0 object-cover hidden dark:block opacity-90"
            placeholder="blur"
            quality={100}
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
