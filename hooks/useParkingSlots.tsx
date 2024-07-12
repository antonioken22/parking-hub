import { useEffect, useState, useCallback } from "react";
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
import { ParkingSlotData } from "@/types/ParkingSlotData";

const useParkingSlots = (databaseTable: string) => {
  const [parkingSlots, setParkingSlots] = useState<ParkingSlotData[]>([]);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number | null>(
    null
  );

  // Read from Firestore
  const fetchParkingSlots = useCallback(async () => {
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
      toast.error("Error fetching parking slots.");
    }
  }, [databaseTable]);

  useEffect(() => {
    toast.promise(fetchParkingSlots(), {
      loading: "Loading parking slots...",
      success: "Successfully loaded parking slots.",
      error: "Failed to load parking slots.",
    });
  }, [fetchParkingSlots]);

  // Create/Add from Firestore
  const addParkingSlot = useCallback(
    async (newSlot: Partial<ParkingSlotData>) => {
      try {
        const slotsRef = collection(firestore, databaseTable);
        const docRef = await addDoc(slotsRef, newSlot);
        setParkingSlots((prevSlots) => [
          ...prevSlots,
          { id: docRef.id, ...newSlot } as ParkingSlotData,
        ]);
        toast.success("New parking slot added successfully.");
      } catch (error) {
        toast.error("Failed to add new parking slot.");
      }
    },
    [databaseTable]
  );

  // Update/Save to Firestore
  const saveParkingSlots = useCallback(async () => {
    try {
      const slotsRef = collection(firestore, databaseTable);
      await Promise.all(
        parkingSlots.map(async (slot) => {
          if (!slot.id)
            throw new Error("Missing document ID for one or more slots.");
          await updateDoc(doc(slotsRef, slot.id), {
            parkingArea: slot.parkingArea,
            parkingSlotNumber: slot.parkingSlotNumber,
            top: slot.top,
            left: slot.left,
            width: slot.width,
            height: slot.height,
            rotation: slot.rotation,
            color: slot.color,
            status: slot.status,
            occupantEmail: slot.occupantEmail || null,
            occupantFirstName: slot.occupantFirstName || null,
            occupantLastName: slot.occupantLastName || null,
            startTime: slot.startTime || null,
            endTime: slot.endTime || null,
            description: slot.description || null,
          });
        })
      );
      toast.success("Parking slots updated successfully.");
    } catch (error) {
      toast.error("Failed to update parking slots.");
    }
  }, [databaseTable, parkingSlots]);

  // Delete from Firestore
  const deleteParkingSlot = useCallback(
    async (slotId: string) => {
      try {
        const slotRef = doc(firestore, databaseTable, slotId);
        await deleteDoc(slotRef);
        setParkingSlots((prevSlots) =>
          prevSlots.filter((slot) => slot.id !== slotId)
        );
        toast.success("Parking slot deleted successfully.");
      } catch (error) {
        toast.error("Failed to delete parking slot.");
      }
    },
    [databaseTable]
  );

  return {
    parkingSlots,
    setParkingSlots,
    selectedSlotIndex,
    setSelectedSlotIndex,
    fetchParkingSlots,
    addParkingSlot,
    saveParkingSlots,
    deleteParkingSlot,
  };
};

export default useParkingSlots;
