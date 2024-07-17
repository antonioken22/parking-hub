import { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  query,
  onSnapshot,
  where,
} from "firebase/firestore";
import { toast } from "sonner";

import { firestore } from "@/firebase/config";
import { ChatMessage } from "@/types/ChatMessage";

const useChatMessages = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Add an update listener to ensure that new changes update the UI
  useEffect(() => {
    const q = query(collection(firestore, "chatMessages"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newChatMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatMessage[];
      setChatMessages(newChatMessages);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Fetch chat messages from Firestore
  const fetchChatMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(
        collection(firestore, "chatMessages")
      );
      const chatMessagesList: ChatMessage[] = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as ChatMessage[];
      setChatMessages(chatMessagesList);
    } catch (err) {
      // setError("Failed to fetch chat messages");
      toast.error("Failed to fetch chat messages");
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a new message
  const addChatMessage = useCallback(async (newChatMessage: ChatMessage) => {
    const chatMessageWithDateCreated = {
      ...newChatMessage,
      message: newChatMessage.message,
      // Set dateCreated to the current date and time
      dateCreated: new Date(),
    };

    try {
      await addDoc(
        collection(firestore, "chatMessages"),
        chatMessageWithDateCreated
      );
      setChatMessages((prevChatMessages) => [
        ...prevChatMessages,
        chatMessageWithDateCreated,
      ]);
      // toast.success("Message sent.");
    } catch (err) {
      // setError("Failed to send message.");
      toast.error("Failed to send message.");
    }
  }, []);

  // Remove a message from view
  const removeFromView = useCallback(async (messageId: string) => {
    try {
      const messageDoc = doc(firestore, "chatMessages", messageId);
      await updateDoc(messageDoc, { isView: false });
      setChatMessages((prevChatMessages) =>
        prevChatMessages.map((message) =>
          message.id === messageId ? { ...message, isView: false } : message
        )
      );
      toast.success("Message deleted.");
    } catch (err) {
      toast.error("Failed to delete message.");
    }
  }, []);

  // Mark messages as read
  const markMessagesAsRead = useCallback(
    async (currentUserId: string, chatUserId: string) => {
      try {
        const q = query(
          collection(firestore, "chatMessages"),
          where("sender.userId", "in", [currentUserId, chatUserId]),
          where("recipient.userId", "in", [currentUserId, chatUserId]),
          where("isRead", "==", false)
        );

        const querySnapshot = await getDocs(q);
        const updatePromises = querySnapshot.docs.map((doc) =>
          updateDoc(doc.ref, { isRead: true })
        );

        await Promise.all(updatePromises);

        setChatMessages((prevChatMessages) =>
          prevChatMessages.map((message) =>
            (message.sender.userId === currentUserId &&
              message.recipient.userId === chatUserId) ||
            (message.sender.userId === chatUserId &&
              message.recipient.userId === currentUserId)
              ? { ...message, isRead: true }
              : message
          )
        );

        // toast.success("Messages marked as read.");
      } catch (err) {
        toast.error("Failed to mark messages as read.");
      }
    },
    []
  );

  useEffect(() => {
    fetchChatMessages();
  }, [fetchChatMessages]);

  return {
    chatMessages,
    loading,
    error,
    addChatMessage,
    removeFromView,
    markMessagesAsRead,
  };
};

export default useChatMessages;
