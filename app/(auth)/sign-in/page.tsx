"use client";

import Link from "next/link";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
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
        // Retrieve user data from local storage
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
            photoUrl: user.photoURL,
            role: "user",
          });
        }
        router.push("/dashboard");
      } else {
        setError("Please verify your email before logging in.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError("Incorrect email/password.");
        console.log(error.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <div>
      <div className="relative w-full max-w-md p-8 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <Link href="/">
          <h2 className="w-full text-2xl font-bold text-center mt-4 mb-8 text-primary">
            Parking{" "}
            <span className="bg-primary text-background  border-primary-foreground px-2 rounded-lg">
              Hub
            </span>
          </h2>
        </Link>
        <h3 className="w-full text-4xl font-normal text-center mt-6 mb-2 text-primary font-roboto">
          Log in
        </h3>
        <p className="w-full text-s font-extralight text-center text-primary font-roboto mb-2">
          Enter your registered account to access Parking Hub.
        </p>
        <form onSubmit={handleSignIn} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium block mb-2 text-primary"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              placeholder="juandelacruz@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium block mb-2 text-primary"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground text-gray-900"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button type="submit" className="w-full flex justify-center">
            Sign In
          </Button>
        </form>

        <div className="flex flex-col items-center space-y-2 mt-6">
          <p className="text-sm font-medium text-primary">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-primary hover:underline">
              Register here
            </Link>
          </p>
          <Link href="/sign-up">
            <div
              role="button"
              className="h-8 w-8 text-primary rounded-sm hover:bg-primary-foreground hover:text-white"
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
