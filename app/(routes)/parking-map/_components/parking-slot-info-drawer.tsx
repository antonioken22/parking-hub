import { useState } from "react";

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
  const [occupantFirstName, setOccupantFirstName] = useState(
    slot.occupantFirstName
  );
  const [occupantLastName, setOccupantLastName] = useState(
    slot.occupantLastName
  );

  let slotOccupantName = "N/A";
  // Combining occupant's first and last names to display as Occupant if it exists
  if (slot.occupantFirstName && slot.occupantLastName) {
    slotOccupantName = `${slot.occupantFirstName} ${slot.occupantLastName}`;
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="relative flex items-center">
            <div className="flex items-center">
              <Image
                alt="Logo"
                src={Logo}
                className="w-10 h-10 mr-2 text-primary dark:hidden border border-primary rounded"
                priority
              />
              <Image
                alt="Logo"
                src={LogoDark}
                className="w-10 h-10 mr-2 p-1 text-primary hidden dark:block border border-primary rounded"
                priority
              />
            </div>
            <div className="flex flex-col flex-grow">
              <DrawerTitle className="mb-1 mr-auto text-base md:text-xl">
                Parking Slot Info
              </DrawerTitle>
              <DrawerDescription className="text-xs md:text-sm mr-auto text-wrap">
                Viewing selected parking slot status.
              </DrawerDescription>
            </div>
            <div
              className="absolute top-0 right-4 w-6 h-6 md:w-8 md:h-8 rounded-full"
              style={{ backgroundColor: slot.color }}
              title={slot.status}
            ></div>
          </DrawerHeader>

          <div className="p-4">
            <div className="text-sm md:text-base mb-4">
              <strong>Status:</strong> {slot.status}
            </div>
            <div className="text-sm md:text-base mb-4">
              <strong>Occupant:</strong> {slotOccupantName || "N/A"}
            </div>
            <div className="text-sm md:text-base mb-4">
              <strong>Description:</strong> {slot.description || "N/A"}
            </div>
            <div className="text-sm md:text-base mb-4">
              <strong>Start Time:</strong>{" "}
              {slot.startTime ? formatDateTime(slot.startTime) : "N/A"}
            </div>
            <div className="text-sm md:text-base mb-4">
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
