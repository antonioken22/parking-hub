import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "@/firebase/config";

export const useUserNotificationStatus = () => {
  const [pushNotificationStatus, setPushNotificationStatus] = useState<
    boolean | null
  >(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setPushNotificationStatus(userDoc.data().pushNotificationStatus);
        }
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const updatePushNotificationStatus = async (newStatus: boolean) => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(firestore, "users", user.uid);
      await updateDoc(userDocRef, { pushNotificationStatus: newStatus });
      setPushNotificationStatus(newStatus);
    }
  };

  return { pushNotificationStatus, updatePushNotificationStatus, loading };
};
