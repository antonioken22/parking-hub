import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  onSnapshot,
} from "firebase/firestore";
import { toast } from "sonner";

import { firestore } from "@/firebase/config";
import { Notification } from "@/types/Notification";

const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Add an update listener to ensure that new changes update the UI
  useEffect(() => {
    const q = query(collection(firestore, "notifications"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Notification[];
      setNotifications(newNotifications);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Fetch notifications from Firestore
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(
        collection(firestore, "notifications")
      );
      const notificationsList: Notification[] = querySnapshot.docs.map(
        (doc) => ({
          ...doc.data(),
          id: doc.id,
        })
      ) as Notification[];
      setNotifications(notificationsList);
    } catch (err) {
      setError("Failed to fetch notifications");
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark a notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const notificationDoc = doc(firestore, "notifications", notificationId);
      await updateDoc(notificationDoc, { isRead: true });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      toast.error("Failed to update notification");
    }
  }, []);

  // Mark a notification as viewed
  const removeFromView = useCallback(async (notificationId: string) => {
    try {
      const notificationDoc = doc(firestore, "notifications", notificationId);
      await updateDoc(notificationDoc, { isView: false });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, isView: false }
            : notification
        )
      );
      toast.success("Notification removed from view");
    } catch (err) {
      toast.error("Failed to update notification");
    }
  }, []);

  // Add a new notification
  const addNotification = useCallback(async (newNotification: Notification) => {
    const notificationWithDateCreated = {
      ...newNotification,
      // Set dateCreated to the current date and time
      dateCreated: new Date(),
    };
    try {
      await addDoc(
        collection(firestore, "notifications"),
        notificationWithDateCreated
      );
      setNotifications((prevNotifications) => [
        ...prevNotifications,

        notificationWithDateCreated,
      ]);
      toast.success("Notification added successfully");
    } catch (err) {
      setError("Failed to add notification");
      toast.error("Failed to add notification");
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return {
    notifications,
    loading,
    error,
    markAsRead,
    removeFromView,
    addNotification,
  };
};

export default useNotifications;
