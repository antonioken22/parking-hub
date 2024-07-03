import Image from "next/image";
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
import ParkingSlot from "../_components/parking-slot";
import { Button } from "@/components/ui/button";
import GLEOpenAreatImage from "@/public/gle-open-area-zoomed.png";
import { ParkingSlotData } from "@/types/ParkingSlotData";
import { useUserRole } from "@/hooks/useUserRole";
import { Publish } from "../_components/publish";

const ParkingLayout = () => {
  const userRole = useUserRole();
  const [parkingSlots, setParkingSlots] = useState<ParkingSlotData[]>([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );

  // Read from Firestore
  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const slotsRef = collection(firestore, "GLEOpenAreaParkingSlots");
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
  }, []);

  const handleSlotPositionChange = (
    index: number,
    top: number,
    left: number
  ) => {
    const updatedSlots = [...parkingSlots];
    updatedSlots[index] = { ...updatedSlots[index], top, left };
    setParkingSlots(updatedSlots);
  };

  const handleEditSlot = (index: number, updatedSlot: ParkingSlotData) => {
    const updatedSlots = [...parkingSlots];
    updatedSlots[index] = { ...updatedSlot };
    setParkingSlots(updatedSlots);
  };

  // Add to Firestore
  const addParkingSlot = async () => {
    const newSlot = {
      top: 50,
      left: 50,
      color: "green",
      status: "Unoccupied",
      name: null,
      startTime: null,
      endTime: null,
      description: null,
      pushNotification: false,
    };

    toast.promise(
      async () => {
        const slotsRef = collection(firestore, "GLEOpenAreaParkingSlots");
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
        const slotsRef = collection(firestore, "GLEOpenAreaParkingSlots");

        await Promise.all(
          parkingSlots.map(async (slot) => {
            if (!slot.id) {
              throw new Error("Missing document ID for one or more slots.");
            }
            await updateDoc(doc(slotsRef, slot.id), {
              top: slot.top,
              left: slot.left,
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
      console.warn("No slot selected for deletion");
      return;
    }

    const slotToDelete = parkingSlots[selectedSlotIndex];

    toast.promise(
      async () => {
        const slotRef = doc(
          firestore,
          "GLEOpenAreaParkingSlots",
          slotToDelete.id
        );
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
            onEdit={handleEditSlot}
            role={userRole}
            selected={index === selectedSlotIndex}
            onSelect={() => setSelectedSlotIndex(index)}
          />
        ))}
        <Image
          alt="GLE Open Area"
          src={GLEOpenAreatImage}
          layout="intrinsic"
          width={2400 / 5}
          height={3854 / 5}
          placeholder="blur"
          priority
        />
        {userRole === "admin" && (
          <div>
            <div className="absolute top-1 right-2 md:top-4 md:right-4 space-x-1 md:space-x-2">
              <Publish />
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
