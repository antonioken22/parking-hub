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
  const [userFirstname, setUserFirstname] = useState<string | null>(null);
  const [userLastname, setUserLastname] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserData;
          setUserId(user.uid);
          setUserEmail(userData.email);
          setUserPhotoUrl(userData.photoUrl);
          setUserFirstname(userData.firstName);
          setUserLastname(userData.lastName);
          setUserRole(userData.role);
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
    userFirstname,
    userLastname,
    userRole,
    loading,
  };
};

export default useUserState;
