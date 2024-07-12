import React, { useEffect, useState } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";

import { firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useUserState from "@/hooks/useUserState";
import { useUserRole } from "@/hooks/useUserRole";
import useUserVehicles from "@/hooks/useUserVehicles";
import { Toaster } from "sonner";

const DataList: React.FC<{ tab: string }> = ({ tab }) => {
  const { userId, loading: userLoading } = useUserState();
  const { vehicles, loading: vehiclesLoading, refetchVehicles } = useUserVehicles(userId);
  const userRole = useUserRole(); // Use useUserRole hook to get user role

  const [userVehicle, setUserVehicle] = useState<string | null>(null);
  const [userTimeIn, setUserTimeIn] = useState<Timestamp | null>(null);
  const [userTimeOut, setUserTimeOut] = useState<Timestamp | null>(null);

  useEffect(() => {
    refetchVehicles(); // Refetch vehicles whenever userId changes
    fetchUserData(); // Fetch user-specific data whenever userId changes
  }, [userId]);

  const fetchUserData = async () => {
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
  };

  if (userLoading || vehiclesLoading || userRole === null) return <Spinner />;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{tab === "vehicles" ? "Vehicles" : "User Data"}</CardTitle>
      </CardHeader>
      <CardContent>
        {tab === "vehicles" ? (
          vehicles.map((vehicle) => (
            <div key={vehicle.id} className="mb-4">
              <p>
                <strong>License Plate:</strong> {vehicle.licensePlate}
              </p>
              <p>
                <strong>Model:</strong> {vehicle.model}
              </p>
              <p>
                <strong>Color:</strong> {vehicle.color}
              </p>
              <p>
                <strong>Type:</strong> {vehicle.vehicleType}
              </p>
              {userRole === "admin" && (
                <>
                  <p>
                    <strong>Owner Email:</strong> {vehicle.ownerEmail}
                  </p>
                  <p>
                    <strong>Owner First Name:</strong> {vehicle.ownerFirstName}
                  </p>
                  <p>
                    <strong>Owner Last Name:</strong> {vehicle.ownerLastName}
                  </p>
                </>
              )}
            </div>
          ))
        ) : (
          <div>
            <p>
              <strong>Vehicle:</strong> {userVehicle}
            </p>
            <p>
              <strong>Time In:</strong> {userTimeIn?.toDate().toString()}
            </p>
            <p>
              <strong>Time Out:</strong> {userTimeOut?.toDate().toString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataList;
