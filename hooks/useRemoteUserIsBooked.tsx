import { useCallback } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/config";

export const useRemoteUserIsBooked = () => {
  const updateRemoteUserIsBooked = useCallback(
    async (
      userId: string,
      isBooked: boolean,
      parkingSlotAssignment: string | null
    ) => {
      const userDocRef = doc(firestore, "users", userId);
      await updateDoc(userDocRef, { isBooked, parkingSlotAssignment });
    },
    []
  );

  return { updateRemoteUserIsBooked };
};
