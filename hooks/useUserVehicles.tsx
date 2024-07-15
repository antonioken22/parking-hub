import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { toast } from "sonner";
import { auth, firestore } from "@/firebase/config";
import { VehicleData } from "@/types/UserVehicle";
import { useUserRole } from "./useUserRole";

const useVehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const userRole = useUserRole();

  const fetchVehicles = async () => {
    try {
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
        vehiclesQuery = query(vehiclesCollectionRef, where("userId", "==", user.uid));
      }

      const vehiclesSnapshot = await getDocs(vehiclesQuery);

      const vehiclesData = vehiclesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as VehicleData[];

      setVehicles(vehiclesData);
    } catch (error) {
      toast.error("Failed to fetch vehicle data");
      console.error("Error fetching vehicle data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [userRole]);

  return { vehicles, loading, fetchVehicles };
};

export default useVehicles;
