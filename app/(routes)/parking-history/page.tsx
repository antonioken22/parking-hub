"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { FileClock } from "lucide-react";

import { auth, firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";

const ParkingHistoryPage = () => {
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
        }
      } else {
        router.push("/sign-in");
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-x-3 mr-auto pl-4">
        <FileClock className="w-10 h-10 text-primary" />
        <div>
          <Heading
            title="Parking History"
            description="View your parking history."
          />
        </div>
      </div>
      <div className="px-4 lg:px-8 space-y-4 pt-4"></div>
    </div>
  );
};

export default ParkingHistoryPage;
