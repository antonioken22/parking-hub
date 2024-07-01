import Image from "next/image";
import { useEffect, useState } from "react";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, firestore } from "@/firebase/config";
import ParkingSlot from "./parking-slot";
import { Button } from "@/components/ui/button";
import RTLOpenCourtImage from "@/public/rtl-open-court-zoomed.png";

interface ParkingSlotData {
  id: string;
  top: number;
  left: number;
  color: string;
  status: string;
  name: string | null;
  countdown: Date | null;
  description: string | null;
  pushNotification: boolean;
}

const ParkingLayout = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlotData[]>([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role as string);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const slotsRef = collection(firestore, "RTLOpenCourtParkingSlots");
        const slotsSnapshot = await getDocs(slotsRef);

        const slotsData: ParkingSlotData[] = slotsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as ParkingSlotData)
        );

        setParkingSlots(slotsData);
      } catch (error) {
        console.error("Error fetching parking slots:", error);
      }
    };

    fetchParkingSlots();
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

  const handleColorChange = (index: number, color: string) => {
    const updatedSlots = [...parkingSlots];
    updatedSlots[index] = { ...updatedSlots[index], color };
    setParkingSlots(updatedSlots);
  };

  const handleEditSlot = (index: number, updatedSlot: ParkingSlotData) => {
    const updatedSlots = [...parkingSlots];
    updatedSlots[index] = { ...updatedSlot };
    setParkingSlots(updatedSlots);
    // console.log(updatedSlot);
  };

  // Add in Firestore
  const addParkingSlot = async () => {
    try {
      // Center spawn
      // Default status
      const newSlot = {
        top: 50,
        left: 50,
        color: "green",
        status: "Unoccupied",
        name: null,
        countdown: null,
        description: null,
        pushNotification: false,
      };

      const slotsRef = collection(firestore, "RTLOpenCourtParkingSlots");
      const docRef = await addDoc(slotsRef, newSlot);
      const updatedSlots = [...parkingSlots, { id: docRef.id, ...newSlot }];

      setParkingSlots(updatedSlots);

      console.log("New parking slot added successfully!");
    } catch (error) {
      console.error("Error adding new parking slot:", error);
    }
  };

  // Update in Firestore
  const saveParkingSlots = async () => {
    try {
      const slotsRef = collection(firestore, "RTLOpenCourtParkingSlots");

      await Promise.all(
        parkingSlots.map(async (slot) => {
          if (!slot.id) {
            throw new Error("Missing document ID for one or more slots.");
          }
          await updateDoc(doc(slotsRef, slot.id), {
            top: slot.top,
            left: slot.left,
            color: slot.color,
            status: slot.status || null,
            name: slot.name || null,
            countdown: slot.countdown || null,
            description: slot.description || null,
            pushNotification: slot.pushNotification || null,
          });
        })
      );

      console.log("Parking slots updated successfully!");
    } catch (error) {
      console.error("Error updating parking slots:", error);
    }
  };

  // Delete in Firestore
  const deleteParkingSlot = async () => {
    if (selectedSlotIndex === null) {
      console.warn("No slot selected for deletion");
      return;
    }

    try {
      const slotToDelete = parkingSlots[selectedSlotIndex];
      const slotRef = doc(
        firestore,
        "RTLOpenCourtParkingSlots",
        slotToDelete.id
      );

      await deleteDoc(slotRef);

      const updatedSlots = parkingSlots.filter(
        (_, index) => index !== selectedSlotIndex
      );
      setParkingSlots(updatedSlots);
      setSelectedSlotIndex(null);

      console.log("Parking slot deleted successfully!");
    } catch (error) {
      console.error("Error deleting parking slot:", error);
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
            onPositionChange={handleSlotPositionChange}
            onColorChange={handleColorChange}
            onEdit={handleEditSlot}
            role={userRole}
            selected={index === selectedSlotIndex}
            onSelect={() => setSelectedSlotIndex(index)}
          />
        ))}
        <Image
          alt="RTL Open Court"
          src={RTLOpenCourtImage}
          layout="intrinsic"
          width={1448 / 2.6}
          height={2048 / 2.6}
          placeholder="blur"
          priority
        />
        {userRole === "admin" && (
          <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 space-x-1 md:space-x-2">
            <Button
              className="text-xs md:text-base shadow-md "
              onClick={deleteParkingSlot}
            >
              Delete Slot
            </Button>
            <Button
              className="text-xs md:text-base shadow-md "
              onClick={addParkingSlot}
            >
              Add Slot
            </Button>
            <Button
              className="text-xs md:text-base shadow-md "
              onClick={saveParkingSlots}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingLayout;
