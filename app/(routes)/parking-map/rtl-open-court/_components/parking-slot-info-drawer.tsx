import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ParkingSlotData } from "@/types/ParkingSlotData";
import Logo from "@/public/logo.svg";
import LogoDark from "@/public/logo-dark.svg";
import Image from "next/image";

type ParkingSlotInfoDrawerProps = {
  slot: ParkingSlotData;
  isOpen: boolean;
  onClose: () => void;
};

const formatDateTime = (date: Date | undefined) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export function ParkingSlotInfoDrawer({
  slot,
  isOpen,
  onClose,
}: ParkingSlotInfoDrawerProps) {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex justify-between items-center">
            <div className="flex items-center flex-grow">
              <div className="flex items-center">
                <Image
                  alt="Logo"
                  src={Logo}
                  className="w-6 h-6 md:w-10 md:h-10 mr-2 text-primary dark:hidden"
                  priority
                />
                <Image
                  alt="Logo"
                  src={LogoDark}
                  className="w-6 h-6 md:w-10 md:h-10 mr-2 text-primary hidden dark:block"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <DrawerTitle className="mb-1">Parking Slot Info</DrawerTitle>
                <DrawerDescription className="text-xs md:text-sm "></DrawerDescription>
              </div>
            </div>
            <div
              className="w-6 h-6 md:w-8 md:h-8 rounded-full"
              style={{ backgroundColor: slot.color }}
              title={slot.status}
            ></div>
          </DrawerHeader>
          <div className="p-4">
            <div className="mb-4">
              <strong>Status:</strong> {slot.status}
            </div>
            <div className="mb-4">
              <strong>Name:</strong> {slot.name || "N/A"}
            </div>
            <div className="mb-4">
              <strong>Description:</strong> {slot.description || "N/A"}
            </div>
            <div className="mb-4">
              <strong>Start Time:</strong>{" "}
              {slot.startTime ? formatDateTime(slot.startTime) : "N/A"}
            </div>
            <div className="mb-4">
              <strong>End Time:</strong>{" "}
              {slot.endTime ? formatDateTime(slot.endTime) : "N/A"}
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
