import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Card } from "@/components/ui/card";
import { CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import useUserState from "@/hooks/useUserState";
import useVehicles from "@/hooks/useUserVehicles";
import { Toaster } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eraser, X } from "lucide-react";


const DataList: React.FC<{ tab: string }> = ({ tab }) => {
  const { userId, userRole, loading: userLoading } = useUserState(); // Assuming userRole is provided here
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [userVehicle, setUserVehicle] = useState<string | null>(null);
  const [userTimeIn, setUserTimeIn] = useState<Timestamp | null>(null);
  const [userTimeOut, setUserTimeOut] = useState<Timestamp | null>(null);

  const { vehicles, loading: vehiclesLoading } = useVehicles();

  const fetchUserData = useCallback(async () => {
    if (!userId) return;
    try {
      const userDataDoc = await getDoc(doc(firestore, "users", userId));
      if (userDataDoc.exists()) {
        const userData = userDataDoc.data();
        setUserVehicle(userData.vehicle);
        setUserTimeIn(userData.timeIn instanceof Timestamp ? userData.timeIn : null);
        setUserTimeOut(userData.timeOut instanceof Timestamp ? userData.timeOut : null);
      } else {
        console.log("User data not found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData, tab, userId]);

  if (userLoading || (tab === "vehicles" && vehiclesLoading)) {
    return (
      <div className="flex items-center justify-center relative inset-y-0 h-full w-full z-50">
        <Spinner size="lg" text="default" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      <Toaster />
      {userRole === "admin" || userRole === "manager" ? (
        <div className="mb-4 w-full max-w-md">
        <Input
          type="text"
          placeholder="Search by email or name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      ) : null}
      <CardContent>
        {tab === "vehicles" && (
          <>
            {vehicles.length > 0 ? (
              vehicles
                .filter((vehicle) =>
                  vehicle.ownerEmail.includes(searchTerm) ||
                  vehicle.ownerFirstName.includes(searchTerm) ||
                  vehicle.ownerLastName.includes(searchTerm)
                )
                .map((vehicle, index) => (
                  <Card key={index} className="mb-4 shadow-md">
                    <CardHeader>
                      <CardTitle>{`Vehicle ${index + 1} Details`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Owner Email: {vehicle.ownerEmail}</p>
                      <p>Owner First Name: {vehicle.ownerFirstName}</p>
                      <p>Owner Last Name: {vehicle.ownerLastName}</p>
                      <p>Color: {vehicle.color}</p>
                      <p>License Plate: {vehicle.licensePlate}</p>
                      <p>Model: {vehicle.model}</p>
                      <p>Vehicle Type: {vehicle.vehicleType}</p>
                    </CardContent>
                  </Card>
                ))
            ) : (
              <p>No vehicles available</p>
            )}
          </>
        )}
      </CardContent>
    </div>
  );
};

export default DataList;
