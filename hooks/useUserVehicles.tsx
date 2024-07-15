import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { toast } from "sonner";
import { auth, firestore } from "@/firebase/config";
import { VehicleData } from "@/types/UserVehicle";

const useVehicles = () => {
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchVehicles = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast.error("User is not authenticated");
        return;
      }

      const vehiclesCollectionRef = collection(firestore, "users", user.uid, "vehicles");
      const vehiclesSnapshot = await getDocs(vehiclesCollectionRef);

      const vehiclesData = vehiclesSnapshot.docs.map((doc) => ({
        id: doc.id,
        userId: user.uid,
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchVehicles();
      } else {
        toast.error("User is not authenticated");
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return { vehicles, loading, fetchVehicles };
};

export default useVehicles;
