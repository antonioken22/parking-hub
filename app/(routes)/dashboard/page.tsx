"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";

const DashboardPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
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
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 lg:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <main className="flex flex-col items-center justify-center flex-grow mt-10">
        {userName && (
          <h1 className="text-4xl font-bold mb-6 ml-10">
            Welcome, {userName}!
          </h1>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
