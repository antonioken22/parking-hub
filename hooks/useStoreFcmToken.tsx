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
  const [parkingSlotAssignment, setParkingSlotAssignment] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const usersRef = collection(firestore, "users");
        const userDocRef = doc(usersRef, user.uid);

        // Get the initial document data
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setIsBooked(userDoc.data().isBooked);
          setParkingSlotAssignment(userDoc.data().parkingSlotAssignment);
          updateDoc(userDocRef, { fcmSwToken: token || null });
          setLoading(false);
        } else {
          setLoading(false);
        }

        // Listen for real-time updates to the isBooked status
        const unsubscribeSnapshot = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setIsBooked(doc.data().isBooked);
            setParkingSlotAssignment(doc.data().parkingSlotAssignment);
          }
        });

        // Clean up the Firestore listener
        return () => unsubscribeSnapshot();
      } else {
        setLoading(false);
      }
    });

    // Clean up the auth listener
    return () => unsubscribeAuth();
  }, [token]);

  return { isBooked, parkingSlotAssignment, loading };
};

export default useStoreFcmToken;
