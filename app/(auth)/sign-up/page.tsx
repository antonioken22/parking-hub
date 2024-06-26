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
    <div className="justify-center items-center  h-screen w-screen flex  bg-no-repeat bg-cover bg-primary"
          style={{ 
            backgroundImage: "url('/ph-background.png')"
          }}>
      <div className="absolute top-0 left-0 w-full h-20  bg-primary"></div>
      
      <div className="relative w-full max-w-md p-4 border bg-contain"
      style={{ 
        backgroundImage: "url('/login-bg.png')"
      }}>
      <h1 className="w-full text-2xl font-bold text-center mt-4 mb-8 text-primary font-poppins">
          Parking <span className="bg-primary text-black  border-customOrange px-1 rounded-lg">Hub</span>
      </h1>
        <h2 className="text-4xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
          Sign Up! 
        </h2>
        <p className="text-xs font-thin text-center mt-2 mb-2 font-roboto text-primary">
          Welcome! Please sign up to access ParkingHub.
        </p>
        <form onSubmit={handleSignUp} className="space-y-4 px-6 pb-4">
          <div>
            <label
              htmlFor="firstName"
              className="text-sm font-medium block mb-2 text-primary"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 bg-white border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="text-sm font-medium block mb-2 text-primary"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 bg-white border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 bg-white border-gray-500 placeholder-gray-400 text-white"
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
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 bg-white border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          <div className="mb-48">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium block mb-2 text-primary"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 bg-white border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <Button type="submit" className="w-full flex bg-primary ">
            Sign Up
          </Button>
        </form>
        <div className="flex flex-col items-center space-y-6 px-6 pb-4">
          <p className="text-sm font-medium text-primary">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
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
