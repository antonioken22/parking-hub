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

type ParkingSlotInfoDrawerProps = {
  slot: ParkingSlotData;
  isOpen: boolean;
  onClose: () => void;
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
      <DrawerContent className="border border-primary">
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader className="flex justify-between items-center">
            <div className="text-center flex-grow">
              <div className="mb-2">
                <DrawerTitle>Parking Slot Info</DrawerTitle>
              </div>
              <DrawerDescription>
                Details of the selected parking slot.
              </DrawerDescription>
            </div>
            <div
              className="h-6 w-6 md:h-8 md:w-8 rounded-full"
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
              <strong>Start Time:</strong>{" "}
              {slot.startTime ? slot.startTime.toString() : "N/A"}
            </div>
            <div className="mb-4">
              <strong>End Time:</strong>{" "}
              {slot.endTime ? slot.endTime.toString() : "N/A"}
            </div>
            <div className="mb-4">
              <strong>Description:</strong> {slot.description || "N/A"}
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
