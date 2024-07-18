import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { FAQ } from "@/types/FAQs";

const useFAQ = () => {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const faqsCollectionRef = collection(firestore, "faqs");
    const unsubscribe = onSnapshot(
      faqsCollectionRef,
      (snapshot) => {
        const faqsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as FAQ[];
        setFAQs(faqsData);
        setLoading(false);
      },
      (error) => {
        toast.error("Failed to fetch FAQs");
        console.error("Error fetching FAQs:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const addFAQ = async (newFAQ: Omit<FAQ, "id">) => {
    setLoading(true);
    const faqsCollection = collection(firestore, "faqs");
    await addDoc(faqsCollection, { ...newFAQ });
    setLoading(false);
  };

  const updateFAQ = async (updatedFAQ: FAQ) => {
    setLoading(true);
    const { id, ...faqData } = updatedFAQ;
    const faqDocRef = doc(firestore, "faqs", id);
    await updateDoc(faqDocRef, faqData);
    setLoading(false);
  };

  const deleteFAQ = async (id: string) => {
    setLoading(true);
    const faqDocRef = doc(firestore, "faqs", id);
    await deleteDoc(faqDocRef);
    setLoading(false);
  };

  return { faqs, loading, addFAQ, updateFAQ, deleteFAQ };
};

export default useFAQ;
