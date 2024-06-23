"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, firestore } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Spinner } from "@/components/spinner";

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleChangePassword = () => {
    router.push("/change-password");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 bg-gradient-to-b from-gray-600 to-black">
      <nav className="bg-gray-800 p-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center ">
              <div className="text-white text-xl">Dashboard</div>
            </div>
            <ModeToggle />
          </div>
        </div>
      </nav>
      <main className="flex flex-col items-center justify-center flex-grow mt-10">
        {userName && (
          <h1 className="text-4xl font-bold mb-6 ml-10">
            Welcome, {userName}!
          </h1>
        )}
        <div className="space-x-4">
          <Button onClick={handleLogout}>Log out</Button>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
