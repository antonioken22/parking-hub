import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

import { firestore } from "@/firebase/config";
import { ActiveUser } from "@/types/ActiveUser";

const getCurrentHour = () => {
  const date = new Date();
  const hours = date.getHours();
  const period = hours < 12 ? "AM" : "PM";
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours} ${period}`;
};

const getFullDateTimeRange = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const period = hours < 12 ? "AM" : "PM";
  const adjustedHours = hours % 12 || 12;
  return `${month}-${day}-${year} @ ${adjustedHours}:00 - ${adjustedHours}:59 ${period}`;
};

const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}-${year}`;
};

const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const todayDate = getTodayDate();
    const unsubscribe = onSnapshot(
      collection(firestore, "activeUsers"),
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => {
            const id = doc.id;
            if (id.startsWith(todayDate)) {
              return {
                // Extract the time part for the chart
                time: id.split(" @ ")[1],
                ...doc.data(),
              } as ActiveUser;
            }
            return null;
          })
          .filter((doc) => doc !== null);

        // Convert time strings to total minutes from the start of the day
        const convertToMinutes = (time: string) => {
          const [hourPart, minutePart] = time.split(/[: ]/);
          let [hours, minutes] = [parseInt(hourPart), parseInt(minutePart)];
          if (time.includes("PM") && hours !== 12) {
            hours += 12;
          } else if (time.includes("AM") && hours === 12) {
            hours = 0;
          }
          return hours * 60 + minutes;
        };

        // Sort the data by time
        data.sort((a, b) => {
          const timeA = convertToMinutes(a.time);
          const timeB = convertToMinutes(b.time);
          return timeA - timeB;
        });

        setActiveUsers(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logActiveUser = async (
    userId: string,
    userEmail: string,
    userFirstName: string,
    userLastName: string
  ) => {
    const currentHour = getCurrentHour();
    const fullDateTimeRange = getFullDateTimeRange();
    const docRef = doc(firestore, "activeUsers", fullDateTimeRange);
    const docSnap = await getDoc(docRef);

    const userData = {
      userId,
      userEmail,
      userFirstName,
      userLastName,
    };

    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const existingUsers = existingData.users || [];

      const userAlreadyLogged = existingUsers.some(
        (user: any) => user.userId === userId
      );

      if (!userAlreadyLogged) {
        await updateDoc(docRef, {
          count: existingData.count + 1,
          users: [...existingUsers, userData],
        });
      }
    } else {
      await setDoc(docRef, {
        count: 1,
        users: [userData],
      });
    }
  };

  return { activeUsers, loading, logActiveUser };
};

export default useActiveUsers;
