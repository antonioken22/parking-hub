import { useEffect, useState } from "react";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";

import { firestore } from "@/firebase/config";

type UserProfileProps = {
  userId: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;
};

const UserProfileDisplay: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("Fetching user data...");
        const userDoc = await getDoc(doc(firestore, "users", userId));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
          console.log("User data fetched:", userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="bg-primary-foreground text-white p-4 rounded-lg mb-4 max-w-md mx-auto">
      {user.photoUrl && (
        <Image
          src={user.photoUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      )}
      <h2 className="text-xl font-bold mb-2 text-center">
        {user.firstName} {user.lastName}
      </h2>
      <p className="mb-2 text-center">Email: {user.email}</p>
    </div>
  );
};

export default UserProfileDisplay;
