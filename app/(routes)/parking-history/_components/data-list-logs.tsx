import { useEffect, useState, useCallback } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";

import { firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Card } from "@/components/ui/card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useUserState from "@/hooks/useUserState";
import { Toaster } from "sonner";

const DataList: React.FC<{ tab: string }> = ({ tab }) => {
  const { userFirstName, userLastName, userId, loading: userLoading } = useUserState();

  const [userVehicle, setUserVehicle] = useState<string | null>(null);
  const [userTimeIn, setUserTimeIn] = useState<Timestamp | null>(null);
  const [userTimeOut, setUserTimeOut] = useState<Timestamp | null>(null);


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


  return (
    <div className="flex flex-col space-y-4">
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>{`${userFirstName} ${userLastName}`}</CardTitle>
        </CardHeader>
        <CardContent>
          {tab === "logs" && (
            <>
              <p>Vehicle: {userVehicle}</p>
              <p>
                Time In:{" "}
                {userTimeIn ? userTimeIn.toDate().toLocaleString() : "No time in available"}
              </p>
              <p>
                Time Out:{" "}
                {userTimeOut ? userTimeOut.toDate().toLocaleString() : "No time out available"}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataList;
