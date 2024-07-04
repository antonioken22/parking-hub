"use client";

import Link from "next/link";
import { SquareParking, Undo2 } from "lucide-react";

import { Heading } from "@/app/(routes)/_components/heading";
import ParkingLayout from "../_components/parking-layout";
import useAuthState from "@/hooks/useAuthState";
import { Spinner } from "@/components/spinner";
import GLEOpenAreatImage from "@/public/gle-open-area-zoomed.png";

const GLEOpenAreaPage = () => {
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
                title="GLE Open Area"
                description="Parking area status."
              />
            </div>
            <div className="ml-auto pr-4">
              <Link href="/parking-map">
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
      )}
    </>
  );
};

export default GLEOpenAreaPage;