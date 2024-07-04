"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, SquareParking } from "lucide-react";

import { Heading } from "@/app/(routes)/_components/heading";
import CITUVicinityMap from "@/public/citu-vicinity-map.png";

const ParkingMapPublicViewOnlyPage = () => {
  return (
    <div>
      <div className="flex items-center gap-x-3 mr-auto pl-4">
        <SquareParking className="w-10 h-10 text-primary" />
        <div>
          <Heading
            title="Parking Map"
            description="CIT-U's parking map areas."
          />
        </div>
      </div>
      <div className="pt-4 flex justify-center items-center">
        <div className="relative">
          {/* GLE Open Area */}
          <div className="absolute z-10 top-[48%] left-[65%] ">
            <Link href="/gle-open-area-public-view-only">
              <MapPin className="text-primary w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:scale-150" />
            </Link>
          </div>
          {/* NGE Open Area */}
          <div className="absolute z-10 top-[70%] left-[33%] ">
            <Link href="/nge-open-area-public-view-only">
              <MapPin className="text-primary w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:scale-150" />
            </Link>
          </div>
          {/* RTL Open Court */}
          <div className="absolute z-10 top-[60%] left-[34%]">
            <Link href="/rtl-open-court-public-view-only">
              <MapPin className="text-primary w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:scale-150" />
            </Link>
          </div>
          {/* SAL Open Court */}
          <div className="absolute z-10 top-[32%] left-[45%] ">
            <Link href="/sal-open-court-public-view-only">
              <MapPin className="text-primary w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:scale-150" />
            </Link>
          </div>
          {/* Add more map pins here */}
          <div className="relative z-0">
            <Image
              alt="CIT-U Vicinity Map"
              src={CITUVicinityMap}
              layout="intrinsic"
              width={1448}
              height={2048}
              placeholder="blur"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParkingMapPublicViewOnlyPage;
