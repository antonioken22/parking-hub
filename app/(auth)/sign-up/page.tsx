"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { auth } from "@/firebase/config";
import { Button } from "@/components/ui/button";

const SignUpPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleSignUp = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);

      // Temporarily store user data in local storage
      localStorage.setItem(
        "registrationData",
        JSON.stringify({
          firstName,
          lastName,
          email,
        })
      );

      setMessage(
        "Registration successful! Please check your email for verification."
      );

      // Clear form fields
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-600 to-black justify-center items-center h-screen w-screen flex flex-col relative">
      <div className="p-4 border border-gray-300 rounded">
        <h2 className="text-2xl font-bold text-center mt-2 mb-2">
          Registration
        </h2>
        <form onSubmit={handleSignUp} className="space-y-4 px-6 pb-4">
          <div>
            <label
              htmlFor="firstName"
              className="text-sm font-medium block mb-2 text-gray-300"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="text-sm font-medium block mb-2 text-gray-300"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
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
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
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
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium block mb-2 text-gray-300"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <Button type="submit" className="w-full flex">
            Sign Up
          </Button>
        </form>
        <div className="flex flex-col items-center space-y-6 px-6 pb-4">
          <p className="text-sm font-medium text-gray-300">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-blue-700 hover:underline">
              Login here
            </Link>
          </p>
          <Link href="/sign-in">
            <div
              role="button"
              className="h-8 w-8 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
              <ChevronLeft className="h-8 w-8" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
