"use client";

import Link from "next/link";
import { SquareParking, Undo2 } from "lucide-react";

import { Heading } from "@/app/(routes)/_components/heading";
import ParkingLayout from "@/app/(routes)/parking-map/rtl-open-court/_components/parking-layout";

const RTLOpenCourtViewablePage = () => {
  return (
    <div className="pt-4">
      <div className="flex items-center gap-x-3 mr-auto pl-4">
        <SquareParking className="w-10 h-10 text-primary" />
        <div>
          <Heading title="RTL Open Court" description="Parking area status." />
        </div>
        <div className="ml-auto pr-4">
          <Link href="/parking-map-public-view">
            <Undo2 className="text-primary" />
          </Link>
        </div>
      </div>
      <ParkingLayout />
    </div>
  );
};

export default RTLOpenCourtViewablePage;
