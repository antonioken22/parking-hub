"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

import { auth, firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";

export const LandingHero = () => {
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
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  return (
    <div className="text-primary font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>Park Now!</h1>
      </div>
      <div className="text-sm md:text-xl font-light text-primary">
        Here at Cebu Institute of Technology - University.
      </div>
      <div>
        <Link href={user ? "/dashboard" : "/sign-up"}>
          <Button>{loading ? <Spinner /> : <p>Register Here</p>}</Button>
        </Link>
      </div>
    </div>
  );
};
