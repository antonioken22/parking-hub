import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { toast } from "sonner";
import { auth, firestore } from "@/firebase/config";
import { VehicleData } from "@/types/UserVehicle";
import { useUserRole } from "./useUserRole";

const useVehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userRole = useUserRole();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      toast.error("User is not authenticated");
      setLoading(false);
      return;
    }

    const vehiclesCollectionRef = collection(firestore, "vehicles");

    let vehiclesQuery;
    if (userRole === "admin") {
      vehiclesQuery = vehiclesCollectionRef;
    } else {
      vehiclesQuery = query(vehiclesCollectionRef, where("ownerId", "==", user.uid));
    }

    const unsubscribe = onSnapshot(vehiclesQuery, (snapshot) => {
      const vehiclesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as VehicleData[];
      setVehicles(vehiclesData);
      setLoading(false);
    }, (error) => {
      toast.error("Failed to fetch vehicle data");
      console.error("Error fetching vehicle data:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userRole]);

  return { vehicles, loading };
};

export default useVehicles;
