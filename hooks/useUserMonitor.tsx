import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  DocumentData,
  onSnapshot,
} from "firebase/firestore";

import { firestore } from "@/firebase/config";
import { UserData } from "@/types/UserData";
import { useUserRole } from "./useUserRole";

const useUserMonitor = () => {
  const userRole = useUserRole();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all users from Firestore
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersCollection = collection(firestore, "users");
      const usersSnapshot = await getDocs(usersCollection);
      const usersList: UserData[] = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
      // Only save data and show toast if admin
      if (userRole === "admin" || userRole === "manager") {
        setUsers(usersList);
        toast.success("Users fetched successfully.");
      }
    } catch (error) {
      if (userRole === "admin" || userRole === "manager") {
        toast.error("Failed to fetch users.");
      }
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  // Add an update listener to ensure that new changes update the UI
  useEffect(() => {
    fetchUsers();

    const usersCollection = collection(firestore, "users");
    const unsubscribe = onSnapshot(usersCollection, (snapshot) => {
      const usersList: UserData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as UserData[];
      setUsers(usersList);
    });

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [fetchUsers]);

  // Update users' booking status in Firestore
  const updateBookingStatuses = useCallback(
    async (updatedUsers: UserData[]) => {
      try {
        await Promise.all(
          updatedUsers.map((user) => {
            const userDocRef = doc(firestore, "users", user.id);
            return updateDoc(userDocRef, {
              isBooked: user.isBooked,
              parkingSlotAssignment: user.parkingSlotAssignment,
            } as DocumentData);
          })
        );
        // Directly update the local state
        // setUsers(updatedUsers);
        toast.success("Users updated successfully.");
      } catch (error) {
        console.log(error);
        toast.error("Failed to update users.");
      }
    },
    []
  );

  return { users, loading, updateBookingStatuses };
};

export default useUserMonitor;
