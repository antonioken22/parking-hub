import { useEffect, useState } from "react";
import {
  getDoc,
  doc,
  updateDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "@/firebase/config";

const useStoreFcmToken = (token: string | null) => {
  const [isBooked, setIsBooked] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const usersRef = collection(firestore, "users");
        const userDocRef = doc(usersRef, user.uid);

        // Get the initial document data
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setIsBooked(userDoc.data().isBooked);
          updateDoc(userDocRef, { fcmSwToken: token || null });
        }

        // Listen for real-time updates to the isBooked status
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setIsBooked(doc.data().isBooked);
          }
        });

        // Clean up the Firestore listener
        return () => unsubscribeSnapshot();
      }
    });

    // Clean up the auth listener
    return () => unsubscribeAuth();
  }, [token]);

  return isBooked;
};

export default useStoreFcmToken;
