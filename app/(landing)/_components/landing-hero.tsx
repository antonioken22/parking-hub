"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const shakeRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setUser(user);
        }
      }
    });

    setLoading(false);
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const startShake = () => {
      if (shakeRef.current) {
        shakeRef.current.classList.add('shake');
        setTimeout(() => {
          shakeRef.current?.classList.remove('shake');
        }, 1000); // Duration of shake
      }
    };

    const initialTimeout = setTimeout(() => {
      startShake();
      const interval = setInterval(startShake, 5000); // Interval between shakes

      // Clear interval on component unmount
      return () => clearInterval(interval);
    }, 5000); // Initial delay before the first shake

    // Clear timeout on component unmount
    return () => clearTimeout(initialTimeout);
  }, []);

  return (
    <div className="text-primary font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1 ref={shakeRef}>Park Now!</h1>
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
