"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (!userDoc.exists()) {
            // Retrieve user data from local storage
            const registrationData = localStorage.getItem("registrationData");
            const { firstName = "", lastName = "" } = registrationData
              ? JSON.parse(registrationData)
              : {};

            await setDoc(doc(firestore, "users", user.uid), {
              firstName,
              lastName,
              email: user.email,
            });

            // Clear registration data from local storage
            localStorage.removeItem("registrationData");
          }
          setUser(user);
          router.push("/dashboard");
        } else {
          setUser(null);
          router.push("/sign-in");
        }
      } else {
        setUser(null);
        router.push("/sign-in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return <div>{user ? <Spinner /> : <Spinner />}</div>;
};

export default HomePage;
