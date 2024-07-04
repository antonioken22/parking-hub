"use client";

import Link from "next/link";
import { SquareParking, Undo2 } from "lucide-react";

import { Heading } from "@/app/(routes)/_components/heading";
import ParkingLayout from "@/app/(routes)/parking-map/_components/parking-layout";
import GLEOpenAreatImage from "@/public/gle-open-area-zoomed.png";

const GLEOpenAreaPublicViewOnlyPage = () => {
  return (
    <div className="pt-4">
      <div className="flex items-center gap-x-3 mr-auto pl-4">
        <SquareParking className="w-10 h-10 text-primary" />
        <div>
          <Heading title="GLE Open Area" description="Parking area status." />
        </div>
        <div className="ml-auto pr-4">
          <Link href="/parking-map-public-view-only">
            <Undo2 className="text-primary" />
          </Link>
        </div>
      </div>
      <ParkingLayout
        databaseTable="GLEOpenAreaParkingSlots"
        parkingSlotDefaultWidth={11}
        parkingSlotDefaultHeight={3}
        parkingSlotDefaultRotation={-22}
        srcImage={GLEOpenAreatImage}
        altImage="Gle Parking Area"
        imgWidth={2400}
        imgHeight={3854}
        imgScaleMultiplier={0.235}
      />
    </div>
  );
};

export default GLEOpenAreaPublicViewOnlyPage;
