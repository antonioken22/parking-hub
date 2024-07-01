import Image from "next/image";

import LoginBg from "@/public/login-bg.png";
import LoginBgDark from "@/public/login-bg-dark.png";

const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-screen overflow-auto">
      <Image
        alt="Parking Hub Background"
        src={LoginBg}
        className="dark:hidden"
        fill
        placeholder="blur"
        priority
      />
      <Image
        alt="Parking Hub Background"
        src={LoginBgDark}
        fill
        className="hidden dark:block"
        placeholder="blur"
        priority
      />
      <div className="relative w-screen min-h-screen flex justify-center items-center">
        {children}
      </div>
    </main>
  );
};

export default LandingLayout;
