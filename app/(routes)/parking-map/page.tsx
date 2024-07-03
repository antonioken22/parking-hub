"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, SquareParking } from "lucide-react";

import { Heading } from "@/app/(routes)/_components/heading";
import CITUVicinityMap from "@/public/citu-vicinity-map.png";
import useAuthState from "@/hooks/useAuthState";
import { Spinner } from "@/components/spinner";

const ParkingMapPage = () => {
  const { userId, loading } = useAuthState();

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {!loading && userId !== null && (
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
              {/* RTL Open Court */}
              <div className="absolute z-10 top-[60%] left-[34%]">
                <Link href="/parking-map/rtl-open-court">
                  <MapPin className="text-primary w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:scale-150" />
                </Link>
              </div>
              {/* Open Court Area */}
              <div className="absolute z-10 top-[32%] left-[36%] ">
                <Link href="/parking-map/">
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
      )}
    </>
  );
};

export default ParkingMapPage;
