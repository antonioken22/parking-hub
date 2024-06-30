"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Settings } from "lucide-react";

import { auth, firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";
import { Button } from "@/components/ui/button";

const SettingsPage = () => {
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
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-x-3 mr-auto pl-4">
        <Settings className="w-10 h-10 text-primary" />
        <div>
          <Heading title="Settings" description="Manage account settings." />
        </div>
      </div>
      <div className="px-4 lg:px-8 space-y-4 pt-4">
        <div className="space-x-4">
          <Button onClick={handleLogout}>Log out</Button>
          <Button onClick={handleChangePassword}>Change Password</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
