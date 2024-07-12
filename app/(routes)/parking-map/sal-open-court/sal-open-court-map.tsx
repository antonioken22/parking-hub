"use client";

import Link from "next/link";
import { SquareParking, Undo2 } from "lucide-react";

import { Heading } from "@/app/(routes)/_components/heading";
import ParkingLayout from "../_components/parking-layout";
import SALOpenCourtImage from "@/public/sal-open-court-zoomed-slots-numbered.png";

const SALOpenCourtMap = () => {
  return (
    <div>
      <div className="flex items-center gap-x-3 mr-auto pl-4">
        <SquareParking className="w-10 h-10 text-primary" />
        <div>
          <Heading title="SAL Open Court" description="Parking area status." />
        </div>
        <div className="ml-auto pr-4">
          <Link href="/parking-map">
            <Undo2 className="text-primary" />
          </Link>
        </div>
      </div>
      <ParkingLayout
        databaseTable="SALOpenCourtParkingSlots"
        parkingArea="SAL-OC"
        parkingSlotDefaultWidth={9}
        parkingSlotDefaultHeight={3}
        parkingSlotDefaultRotation={0}
        srcImage={SALOpenCourtImage}
        altImage="Sal Parking Area"
        imgWidth={1206}
        imgHeight={1674}
        imgScaleMultiplier={0.469}
      />
    </div>
  );
};

export default SALOpenCourtMap;
