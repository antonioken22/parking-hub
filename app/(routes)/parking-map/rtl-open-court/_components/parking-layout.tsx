import Image from "next/image";
import { useEffect, useState } from "react";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

import { auth, firestore } from "@/firebase/config";
import ParkingSlotComponent from "./parking-slot";
import { Button } from "@/components/ui/button";

interface ParkingSlot {
  id: string;
  top: number;
  left: number;
  color: string;
}

const ParkingLayout = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
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

        const slotsData: ParkingSlot[] = slotsSnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as ParkingSlot)
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

  const saveParkingSlots = async () => {
    try {
      const slotsRef = collection(firestore, "RTLOpenCourtParkingSlots");

      // Update in Firestore
      await Promise.all(
        parkingSlots.map(async (slot) => {
          await updateDoc(doc(slotsRef, slot.id), {
            top: slot.top,
            left: slot.left,
            color: slot.color,
          });
        })
      );

      console.log("Parking slots updated successfully!");
    } catch (error) {
      console.error("Error updating parking slots:", error);
    }
  };

  const addParkingSlot = async () => {
    try {
      // Center spawn
      const newSlot = {
        top: 50,
        left: 50,
        color: "gray",
      };

      const slotsRef = collection(firestore, "RTLOpenCourtParkingSlots");
      const docRef = await addDoc(slotsRef, newSlot);

      const updatedSlots = [...parkingSlots, { id: docRef.id, ...newSlot }];

      setParkingSlots(updatedSlots);
    } catch (error) {
      console.error("Error adding parking slot:", error);
    }
  };

  return (
    <div className="pt-4 flex justify-center items-center">
      <div className="relative">
        {parkingSlots.map((slot, index) => (
          <ParkingSlotComponent
            key={slot.id}
            slot={slot}
            index={index}
            onPositionChange={handleSlotPositionChange}
            onColorChange={handleColorChange}
            role={userRole}
            selected={index === selectedSlotIndex}
            onSelect={() => setSelectedSlotIndex(index)}
          />
        ))}
        <Image
          loading="lazy"
          alt="CIT-U Vicinity Map"
          src="/rtl-open-court-zoomed.png"
          layout="intrinsic"
          width={1448 / 2.6}
          height={2048 / 2.6}
        />
        {userRole === "admin" && (
          <div className="absolute bottom-4 right-4 space-x-2">
            <Button className="shadow-md " onClick={addParkingSlot}>
              Add Slot
            </Button>
            <Button className="shadow-md " onClick={saveParkingSlots}>
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParkingLayout;
