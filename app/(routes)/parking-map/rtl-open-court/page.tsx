"use client";

import Link from "next/link";
import { SquareParking, Undo2 } from "lucide-react";

import { Heading } from "@/app/(routes)/_components/heading";
import ParkingLayout from "./_components/parking-layout";

const RTLOpenCourtPage = () => {
  return (
    <div>
      <div className="flex items-center gap-x-3 mr-auto pl-4">
        <SquareParking className="w-10 h-10 text-primary" />
        <div>
          <Heading
            title="RTL Open Court"
            description="View the parked cars here."
          />
        </div>
        <div className="ml-auto pr-4">
          <Link href="/parking-map">
            <Undo2 className="text-primary" />
          </Link>
        </div>
      </div>
      <ParkingLayout />
    </div>
  );
};

export default RTLOpenCourtPage;
