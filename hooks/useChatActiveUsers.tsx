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

const getCurrentMinute = () => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? "AM" : "PM";
  const adjustedHours = hours % 12 || 12;
  return `${adjustedHours}:${String(minutes).padStart(2, "0")} ${period}`;
};

const getFullDateTimeRange = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? "AM" : "PM";
  const adjustedHours = hours % 12 || 12;
  return `${month}-${day}-${year} @ ${adjustedHours}:${String(minutes).padStart(
    2,
    "0"
  )} ${period}`;
};

const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}-${year}`;
};

const useChatActiveUsers = () => {
  const [chatActiveUsers, setChatActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const todayDate = getTodayDate();
    const unsubscribe = onSnapshot(
      collection(firestore, "chatActiveUsers"),
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => {
            const id = doc.id;
            if (id.startsWith(todayDate)) {
              return {
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

        setChatActiveUsers(data);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logChatActiveUser = async (
    userId: string,
    userEmail: string,
    userFirstName: string,
    userLastName: string
  ) => {
    const currentMinute = getCurrentMinute();
    const fullDateTimeRange = getFullDateTimeRange();
    const docRef = doc(firestore, "chatActiveUsers", fullDateTimeRange);
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
          users: [...existingUsers, userData],
        });
      }
    } else {
      await setDoc(docRef, {
        users: [userData],
      });
    }
  };

  return { chatActiveUsers, loading, logChatActiveUser };
};

export default useChatActiveUsers;
