import Image, { StaticImageData } from "next/image";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  Timestamp,
} from "firebase/firestore";
import { toast } from "sonner";

import { firestore } from "@/firebase/config";
import ParkingSlot from "./parking-slot";
import { Button } from "@/components/ui/button";
import { ParkingSlotData } from "@/types/ParkingSlotData";
import { useUserRole } from "@/hooks/useUserRole";
import { ShareURLButton } from "./share-url-button";

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
  const [parkingSlots, setParkingSlots] = useState<ParkingSlotData[]>([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );

  // Read from Firestore
  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const slotsRef = collection(firestore, databaseTable);
        const slotsSnapshot = await getDocs(slotsRef);

        const slotsData: ParkingSlotData[] = slotsSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convert type Timestamp (Firestore) to Date
            startTime:
              data.startTime instanceof Timestamp
                ? data.startTime.toDate()
                : data.startTime,
            endTime:
              data.endTime instanceof Timestamp
                ? data.endTime.toDate()
                : data.endTime,
          } as ParkingSlotData;
        });

        setParkingSlots(slotsData);
      } catch (error) {
        console.error("Error fetching parking slots:", error);
      }
    };

    toast.promise(fetchParkingSlots(), {
      loading: "Loading parking slots...",
      success: "Successfully loaded parking slots.",
      error: "Failed to load parking slots.",
    });
  }, [databaseTable]);

  // Local operations
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

  // Cloud operations
  // Add to Firestore
  const addParkingSlot = async () => {
    const newSlot = {
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
    };

    toast.promise(
      async () => {
        const slotsRef = collection(firestore, databaseTable);
        const docRef = await addDoc(slotsRef, newSlot);
        const updatedSlots = [...parkingSlots, { id: docRef.id, ...newSlot }];
        setParkingSlots(updatedSlots);
      },
      {
        loading: "Adding new parking slot...",
        success: "New parking slot added successfully.",
        error: "Failed to add new parking slot.",
      }
    );
  };

  // Update to Firestore
  const saveParkingSlots = async () => {
    toast.promise(
      async () => {
        const slotsRef = collection(firestore, databaseTable);

        await Promise.all(
          parkingSlots.map(async (slot) => {
            if (!slot.id) {
              throw new Error("Missing document ID for one or more slots.");
            }
            await updateDoc(doc(slotsRef, slot.id), {
              top: slot.top,
              left: slot.left,
              width: slot.width,
              height: slot.height,
              rotation: slot.rotation,
              color: slot.color,
              status: slot.status,
              name: slot.name || null,
              startTime: slot.startTime || null,
              endTime: slot.endTime || null,
              description: slot.description || null,
              pushNotification: slot.pushNotification || null,
            });
          })
        );
      },
      {
        loading: "Saving parking slots...",
        success: "Parking slots updated successfully.",
        error: "Failed to update parking slots.",
      }
    );
  };

  // Delete from Firestore
  const deleteParkingSlot = async () => {
    if (selectedSlotIndex === null) {
      toast.error("No slot selected for deletion.");
      return;
    }

    const slotToDelete = parkingSlots[selectedSlotIndex];

    toast.promise(
      async () => {
        const slotRef = doc(firestore, databaseTable, slotToDelete.id);
        await deleteDoc(slotRef);

        const updatedSlots = parkingSlots.filter(
          (_, index) => index !== selectedSlotIndex
        );
        setParkingSlots(updatedSlots);
        setSelectedSlotIndex(null);
      },
      {
        loading: "Deleting parking slot...",
        success: "Parking slot deleted successfully.",
        error: "Failed to delete parking slot.",
      }
    );
  };

  return (
    <div className="pt-4 flex justify-center items-center">
      <div className="relative">
        {parkingSlots.map((slot, index) => (
          <ParkingSlot
            key={slot.id}
            slot={slot}
            index={index}
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
            <div className="absolute top-1 left-2 md:top-4 md:left-4 space-x-1 md:space-x-2">
              <Button
                className="text-xs md:text-base shadow-md"
                onClick={handleDeselect}
              >
                Deselect
              </Button>
            </div>
            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 space-x-1 md:space-x-2">
              <Button
                className="text-xs md:text-base shadow-md"
                onClick={deleteParkingSlot}
              >
                Delete Slot
              </Button>
              <Button
                className="text-xs md:text-base shadow-md"
                onClick={addParkingSlot}
              >
                Add Slot
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
