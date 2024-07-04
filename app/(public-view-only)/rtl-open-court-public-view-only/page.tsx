"use client";

import Link from "next/link";
import { SquareParking, Undo2 } from "lucide-react";

import { Heading } from "@/app/(routes)/_components/heading";
import ParkingLayout from "@/app/(routes)/parking-map/_components/parking-layout";
import RTLOpenCourtImage from "@/public/rtl-open-court-zoomed.png";

const RTLOpenCourtPublicViewOnlyPage = () => {
  return (
    <div>
      <div className="flex items-center gap-x-3 mr-auto pl-4">
        <SquareParking className="w-10 h-10 text-primary" />
        <div>
          <Heading title="RTL Open Court" description="Parking area status." />
        </div>
        <div className="ml-auto pr-4">
          <Link href="/parking-map-public-view-only">
            <Undo2 className="text-primary" />
          </Link>
        </div>
      </div>
      <ParkingLayout
        databaseTable="RTLOpenCourtParkingSlots"
        parkingSlotDefaultWidth={17}
        parkingSlotDefaultHeight={4}
        parkingSlotDefaultRotation={0}
        srcImage={RTLOpenCourtImage}
        altImage="RTL Parking Area"
        imgWidth={1144}
        imgHeight={2000}
        imgScaleMultiplier={0.39}
      />
    </div>
  );
};

export default RTLOpenCourtPublicViewOnlyPage;
