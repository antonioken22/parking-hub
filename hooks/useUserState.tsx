import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, firestore } from "@/firebase/config";
import { UserData } from "@/types/UserData";

const useUserState = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [userFirstName, setUserFirstName] = useState<string | null>(null);
  const [userLastName, setUserLastName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userPushNotificationStatus, setUserPushNotificationStatus] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData;
          // Store locally
          setUserId(user.uid);
          setUserEmail(userData.email);
          setUserPhotoUrl(userData.photoUrl);
          setUserFirstName(userData.firstName);
          setUserLastName(userData.lastName);
          setUserRole(userData.role);
          setUserPushNotificationStatus(userData.pushNotificationStatus);
        }
      } else {
        router.push("/sign-in");
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return {
    userId,
    userEmail,
    userPhotoUrl,
    setUserPhotoUrl,
    userFirstName,
    userLastName,
    userRole,
    userPushNotificationStatus,
    setUserPushNotificationStatus,
    loading,
  };
};

export default useUserState;
