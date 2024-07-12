import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { collection, getDocs, query } from "firebase/firestore";

import { firestore } from "@/firebase/config";
import { UserData } from "@/types/UserData";
import { useUserRole } from "./useUserRole";

const useUsersEmailFirstNameLastName = () => {
  const userRole = useUserRole();
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch all users from Firestore with specific fields
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const usersCollection = collection(firestore, "users");
      const usersQuery = query(usersCollection);
      const usersSnapshot = await getDocs(usersQuery);
      const usersList: UserData[] = usersSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        };
      }) as UserData[];
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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading };
};

export default useUsersEmailFirstNameLastName;
