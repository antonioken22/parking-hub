"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export const LandingNavbar = () => {
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
    });

    setLoading(false);
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav className="p-4 bg-black/50 fixed top-0 left-0 w-full flex items-center justify-center shadow-lg z-50">
        <div className="flex items-center justify-between w-full max-w-screen-xl">
          <Link href="/" className="flex items-center">
            <div className="relative h-8 w-8 mr-1">
              <Image
                priority
                alt="Logo"
                src="/logo.svg"
                fill
                className="dark:hidden"
              />
              <Image
                priority
                alt="Logo"
                src="/logo-dark.svg"
                fill
                className="hidden dark:block"
              />
            </div>
            <h2 className="font-bold text-primary">
              Parking{" "}
              <span className="bg-primary text-background border-primary-foreground px-1 rounded-sm">
                Hub
              </span>
            </h2>
          </Link>
          <div className="flex items-center gap-x-2">
            <Link href={user ? "/dashboard" : "/sign-in"}>
              <Button className="w-20">
                {loading ? <Spinner text={"background"} /> : <p>Log in</p>}
              </Button>
            </Link>
            <div>
              <ModeToggle />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
