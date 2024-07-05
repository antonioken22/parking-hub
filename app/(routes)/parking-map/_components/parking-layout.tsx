import Image, { StaticImageData } from "next/image";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShareURLButton } from "./share-url-button";
import { ParkingSlotData } from "@/types/ParkingSlotData";
import { useUserRole } from "@/hooks/useUserRole";
import useParkingSlots from "@/hooks/useParkingSlots";
import ParkingSlot from "./parking-slot";

interface ParkingLayoutProps {
  databaseTable: string;
  parkingSlotDefaultWidth: number;
  parkingSlotDefaultHeight: number;
  parkingSlotDefaultRotation: number;
  srcImage: StaticImageData;
  altImage: string;
  imgWidth: number;
  imgHeight: number;
  imgScaleMultiplier: number;
}

const ParkingLayout = ({
  databaseTable,
  parkingSlotDefaultWidth,
  parkingSlotDefaultHeight,
  parkingSlotDefaultRotation,
  altImage,
  srcImage,
  imgWidth,
  imgHeight,
  imgScaleMultiplier,
}: ParkingLayoutProps) => {
  const userRole = useUserRole();
  const {
    parkingSlots,
    setParkingSlots,
    selectedSlotIndex,
    setSelectedSlotIndex,
    addParkingSlot,
    saveParkingSlots,
    deleteParkingSlot,
  } = useParkingSlots(databaseTable);

  const [stepSize, setStepSize] = useState<number>(1);

  const handleSlotPositionChange = (
    index: number,
    top: number,
    left: number
  ) => {
    const updatedSlots = [...parkingSlots];
    updatedSlots[index] = { ...updatedSlots[index], top, left };
    setParkingSlots(updatedSlots);
  };

  const handleSlotSizeChange = (
    index: number,
    width: number,
    height: number
  ) => {
    const updatedSlots = [...parkingSlots];
    updatedSlots[index] = { ...updatedSlots[index], width, height };
    setParkingSlots(updatedSlots);
  };

  const handleSlotRotationChange = (index: number, rotation: number) => {
    const updatedSlots = [...parkingSlots];
    updatedSlots[index] = { ...updatedSlots[index], rotation };
    setParkingSlots(updatedSlots);
  };

  const handleEditSlot = (index: number, updatedSlot: ParkingSlotData) => {
    const updatedSlots = [...parkingSlots];
    updatedSlots[index] = { ...updatedSlot };
    setParkingSlots(updatedSlots);
  };

  const handleDeselect = () => {
    setSelectedSlotIndex(null);
  };

  const handleDeleteSlot = () => {
    if (selectedSlotIndex !== null) {
      deleteParkingSlot(parkingSlots[selectedSlotIndex].id);
      setSelectedSlotIndex(null);
    } else {
      toast.error("No slot selected for deletion.");
    }
  };

  return (
    <div className="pt-4 flex justify-center items-center">
      <div className="relative">
        {parkingSlots.map((slot, index) => (
          <ParkingSlot
            key={slot.id}
            slot={slot}
            index={index}
            stepSize={stepSize}
            onPositionChange={handleSlotPositionChange}
            onSizeChange={handleSlotSizeChange}
            onRotationChange={handleSlotRotationChange}
            onEdit={handleEditSlot}
            role={userRole}
            selected={index === selectedSlotIndex}
            onSelect={() => setSelectedSlotIndex(index)}
          />
        ))}
        <Image
          alt={altImage}
          src={srcImage}
          layout="intrinsic"
          width={imgWidth * imgScaleMultiplier}
          height={imgHeight / imgScaleMultiplier}
          placeholder="blur"
          priority
        />
        {userRole === "admin" && (
          <div>
            <div className="absolute top-1 right-2 md:top-4 md:right-4 space-x-1 md:space-x-2">
              <ShareURLButton />
            </div>
            <div className="absolute top-1 left-2 md:top-4 md:left-4 space-x-2 flex items-center">
              <Button
                className="text-xs md:text-base shadow-md"
                onClick={handleDeselect}
              >
                Deselect
              </Button>
              <Input
                type="number"
                id="stepSize"
                placeholder="Step Size"
                value={stepSize}
                onChange={(e) => setStepSize(parseFloat(e.target.value))}
                step="0.1"
                min="0.1"
                className="border border-primary rounded-br-none w-28"
              />
              <div className="absolute -bottom-9 -right-0  transform -translate-y-1/2">
                <h1 className="text-xs text-background bg-primary rounded-b-lg  px-2 py-1 left-2">
                  Step Size
                </h1>
              </div>
            </div>
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 space-x-1 md:space-x-2">
              <Button
                className="text-xs md:text-base shadow-md"
                onClick={() =>
                  addParkingSlot({
                    top: 50,
                    left: 50,
                    width: parkingSlotDefaultWidth,
                    height: parkingSlotDefaultHeight,
                    rotation: parkingSlotDefaultRotation,
                    color: "green",
                    status: "Available",
                    name: null,
                    startTime: null,
                    endTime: null,
                    description: null,
                    pushNotification: false,
                  })
                }
              >
                Add Slot
              </Button>
              <Button
                className="text-xs md:text-base shadow-md"
                onClick={handleDeleteSlot}
              >
                Delete Slot
              </Button>
              <Button
                className="text-xs md:text-base shadow-md"
                onClick={saveParkingSlots}
              >
                Save Changes
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingLayout;
