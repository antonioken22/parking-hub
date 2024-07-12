import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { VehicleData } from "@/types/UserVehicle";
import { firestore } from "@/firebase/config";
import useUserState from "./useUserState";

const useUserVehicles = (userId?: string | null) => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { userRole } = useUserState();

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      let vehiclesQuery;

      if (userId) {
        vehiclesQuery = query(collection(firestore, "vehicles"), where("userId", "==", userId));
      } else if (userRole === "admin") {
        vehiclesQuery = query(collection(firestore, "vehicles"));
      } else {
        throw new Error("Unauthorized access");
      }

      const querySnapshot = await getDocs(vehiclesQuery);
      const fetchedVehicles: VehicleData[] = [];
      querySnapshot.forEach((doc) => {
        fetchedVehicles.push({ id: doc.id, ...doc.data() } as VehicleData);
      });
      setVehicles(fetchedVehicles);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [userId, userRole]); // Include userId and userRole in dependencies

  const refetchVehicles = () => {
    fetchVehicles(); // Function to refetch vehicles
  };

  return { vehicles, loading, refetchVehicles };
};

export default useUserVehicles;
