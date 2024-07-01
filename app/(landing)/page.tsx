import Image from "next/image";

import { LandingNavbar } from "./_components/landing-navbar";
import { LandingHero } from "./_components/landing-hero";
import { LandingContent } from "./_components/landing-content";
import LandingBg from "@/public/landing-bg.jpg";

const LandingPage = () => {
  return (
    <div className="h-screen">
      <Image
        alt="Landing Page"
        src={LandingBg}
        fill
        className="absolute inset-0 object-cover dark:hidden opacity-20"
        placeholder="blur"
        priority
      />
      <Image
        alt="Landing Page"
        src={LandingBg}
        fill
        className="absolute inset-0 object-cover hidden dark:block opacity-20"
        placeholder="blur"
        priority
      />
      <div className="relative z-10">
        <LandingNavbar />
        <LandingHero />
        <LandingContent />
      </div>
    </div>
  );
};

export default LandingPage;
