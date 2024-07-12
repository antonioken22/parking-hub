"use client";

import Link from "next/link";
import { SquareParking, Undo2 } from "lucide-react";

import { Heading } from "@/app/(routes)/_components/heading";
import ParkingLayout from "../_components/parking-layout";
import NGEOpenAreaImage from "@/public/nge-open-area-zoomed-slots-numbered.png";

const NGEOpenAreaMap = () => {
  return (
    <div>
      <div className="flex items-center gap-x-3 mr-auto pl-4">
        <SquareParking className="w-10 h-10 text-primary" />
        <div>
          <Heading title="NGE Open Area" description="Parking area status." />
        </div>
        <div className="ml-auto pr-4">
          <Link href="/parking-map">
            <Undo2 className="text-primary" />
          </Link>
        </div>
      </div>
      <ParkingLayout
        databaseTable="NGEOpenAreaParkingSlots"
        parkingArea="NGE-OA"
        parkingSlotDefaultWidth={19}
        parkingSlotDefaultHeight={2}
        parkingSlotDefaultRotation={0}
        srcImage={NGEOpenAreaImage}
        altImage="NGE Parking Area"
        imgWidth={1000}
        imgHeight={3127}
        imgScaleMultiplier={0.57}
      />
    </div>
  );
};

export default NGEOpenAreaMap;
