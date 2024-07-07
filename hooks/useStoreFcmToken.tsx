import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc, collection } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "@/firebase/config";

const useStoreFcmToken = (token: string | null) => {
  const [isBooked, setIsBooked] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const usersRef = collection(firestore, "users");
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setIsBooked(userDoc.data().isBooked);
          updateDoc(doc(usersRef, user.uid), { fcmSwToken: token || null });
        }
      }
    });

    return () => unsubscribe();
  }, [token]);

  return isBooked;
};

export default useStoreFcmToken;
