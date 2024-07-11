import { useEffect, useState, useCallback } from "react";
import { collection, getDocs, Timestamp } from "firebase/firestore";

import { firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";

import { Card } from "@/components/ui/card";
import {
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

type User = {
  id: string;
  firstName: string;
  email: string;
  vehicle: string;
  timeIn: Timestamp | null;
};

const DataList: React.FC<{ tab: string }> = ({ tab }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(firestore, "users"));
    const usersData: User[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.firstName,
        email: data.email,
        vehicle: data.vehicle,
        timeIn: data.timeIn instanceof Timestamp ? data.timeIn : null,
      } as User;
    });
    setUsers(usersData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, tab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center relative inset-y-0 h-full w-full z-50">
        <Spinner size="lg" text="default" />
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <CardTitle>{user.firstName}</CardTitle>
          </CardHeader>
          <CardContent>
          <p>Vehicle: {user.vehicle}</p>
            {tab === "logs" && (
              <p>
                {user.timeIn
                  ? user.timeIn.toDate().toLocaleString()
                  : "No time available"}
              </p>
              
            )}
            
            {tab === "vehicles" && <p>{user.vehicle}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DataList;
