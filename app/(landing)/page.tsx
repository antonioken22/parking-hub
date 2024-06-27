import Image from "next/image";

import { LandingNavbar } from "./_components/landing-navbar";
import { LandingHero } from "./_components/landing-hero";
import { LandingContent } from "./_components/landing-content";

const LandingPage = () => {
  return (
    <div className="h-full">
      <Image
        loading="lazy"
        alt="Landing Page"
        src="/landing-bg.jpg"
        fill
        className="absolute inset-0 object-cover dark:hidden opacity-20"
      />
      <Image
        loading="lazy"
        alt="Landing Page"
        src="/landing-bg-dark.jpg"
        fill
        className="absolute inset-0 object-cover hidden dark:block opacity-20"
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
