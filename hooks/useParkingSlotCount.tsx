import { useEffect, useState } from "react";
import { toast } from "sonner";
import { collection, getDocs } from "firebase/firestore";

import { firestore } from "@/firebase/config";
import { ParkingSlotData } from "@/types/ParkingSlotData";

const useParkingSlotCount = () => {
  const [parkingSlotCounts, setParkingSlotCounts] = useState({
    SAL: { available: 0, occupied: 0, reserved: 0, unavailable: 0 },
    RTL: { available: 0, occupied: 0, reserved: 0, unavailable: 0 },
    GLE: { available: 0, occupied: 0, reserved: 0, unavailable: 0 },
    NGE: { available: 0, occupied: 0, reserved: 0, unavailable: 0 },
  });

  const fetchParkingSlots = async (collectionName: string) => {
    const slotsRef = collection(firestore, collectionName);
    const slotsSnapshot = await getDocs(slotsRef);
    const slotsData: ParkingSlotData[] = slotsSnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as ParkingSlotData)
    );

    return slotsData.reduce(
      (acc, slot) => {
        if (slot.status === "Available") acc.available++;
        else if (slot.status === "Occupied") acc.occupied++;
        else if (slot.status === "Reserved") acc.reserved++;
        else if (slot.status === "Unavailable") acc.unavailable++;
        return acc;
      },
      { available: 0, occupied: 0, reserved: 0, unavailable: 0 }
    );
  };

  useEffect(() => {
    const fetchAllParkingSlots = async () => {
      try {
        const [SALCounts, RTLCounts, GLECounts, NGECounts] = await Promise.all([
          fetchParkingSlots("SALOpenCourtParkingSlots"),
          fetchParkingSlots("RTLOpenCourtParkingSlots"),
          fetchParkingSlots("GLEOpenAreaParkingSlots"),
          fetchParkingSlots("NGEOpenAreaParkingSlots"),
        ]);

        setParkingSlotCounts({
          SAL: SALCounts,
          RTL: RTLCounts,
          GLE: GLECounts,
          NGE: NGECounts,
        });
      } catch (error) {
        // console.error("Error fetching parking slots:", error);
      }
    };

    toast.promise(fetchAllParkingSlots(), {
      loading: "Loading status of parking slots",
      success: "Successfully loaded status of parking slots.",
      error: "Failed to load status of parking slots.",
    });
  }, []);

  return parkingSlotCounts;
};

export default useParkingSlotCount;
