"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { auth, firestore } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        // Retireve user data from local storage
        const registrationData = localStorage.getItem("registrationData");
        const { firstName = "", lastName = "" } = registrationData
          ? JSON.parse(registrationData)
          : {};

        // Check if user data exists in Firestore
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (!userDoc.exists()) {
          // Save user data to Firestore after email verification
          await setDoc(doc(firestore, "users", user.uid), {
            firstName,
            lastName,
            email: user.email,
          });
        }
        router.push("/dashboard");
      } else {
        setError("Please verify your email before logging in.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError("Incorrect email/password.");
      } else {
        setError("An unknown error occured");
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-600 to-black justify-center items-center h-screen w-screen flex flex-col relative">
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>
      <div className="p-4 border border-gray-300 rounded">
        <h2 className="w-full text-2xl font-bold text-center mt-4 mb-10 ">
          Parking Hub
        </h2>

        <form onSubmit={handleSignIn} className="space-y-6 px-6 pb-4">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium block mb-2 text-gray-300"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium block mb-2 text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full flex">
            Sign In
          </Button>
        </form>

        <div className="flex flex-col items-center space-y-6 px-6 pb-4">
          <p className="text-sm font-medium text-gray-300">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-blue-700 hover:underline">
              Register here
            </Link>
          </p>
          <Link href="/sign-up">
            <div
              role="button"
              className="h-8 w-8 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
              <ChevronRight className="h-8 w-8" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
