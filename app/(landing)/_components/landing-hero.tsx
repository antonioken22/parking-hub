"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { ArrowUpRight, MapPin } from "lucide-react";

import { auth, firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";

export const LandingHero = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          setUser(user);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="text-primary font-bold pt-36 text-center space-y-8 md:space-y-10">
      {/* Title text */}
      <div className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-snug">
        <h1 className="tracking-wider">
          <span className="bg-primary text-background border-primary-foreground rounded-lg px-6 py-2 inline-block transition-transform transform hover:scale-105">
            PARK
          </span>{" "}
          NOW!
        </h1>
      </div>

      {/* Clickable location */}
      <div className="flex justify-center items-center gap-2 transition-colors text-yellow-400 hover:text-red-800">
        <Link
          href="https://maps.app.goo.gl/1ZZcWrDtVyfTex3i9"
          target="_blank"
          rel="noreferrer"
          aria-label="View location on map"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 md:h-7 md:w-7" />
            <p
              className="text-lg md:text-xl font-medium"
              style={{ textShadow: "1px 1px 4px rgba(0, 0, 0, 0.4)" }}
            >
              Cebu Institute of Technology - University
            </p>
          </div>
        </Link>
      </div>

      {/* Register here button */}
      <div>
        <Link href={user ? "/dashboard" : "/sign-up"}>
          <Button className="w-48 h-12 bg-primary rounded-lg shadow-lg transition-all transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-primary">
            {loading ? (
              <Spinner text={"background"} />
            ) : (
              <div className="flex justify-center items-center gap-2">
                <p className="text-lg font-semibold">Register Here</p>
                <ArrowUpRight className="h-5 w-5" />
              </div>
            )}
          </Button>
        </Link>
      </div>
    </div>
  );
};
