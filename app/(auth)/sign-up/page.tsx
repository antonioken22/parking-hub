"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { ChevronLeft } from "lucide-react";

import { auth } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

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
    <div className="relative w-screen min-h-screen flex justify-center items-center">
      <Image
        loading="lazy"
        alt="Parking Hub Background"
        src="/login-bg.png"
        fill
        className="dark:hidden"
      />
      <Image
        loading="lazy"
        alt="Parking Hub Background"
        src="/login-bg-dark.png"
        fill
        className="hidden dark:block"
      />

      <div className="relative w-full max-w-md p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <Link href="/">
          <h1 className="w-full text-2xl font-bold text-center mt-4 mb-8 text-primary font-poppins">
            Parking{" "}
            <span className="bg-primary text-background px-2 rounded-lg">
              Hub
            </span>
          </h1>
        </Link>
        <h2 className="text-4xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
          Registration Form
        </h2>
        <p className="text-s text-center mt-2 mb-2 font-roboto text-primary">
          Please fill up to register an account.
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
              placeholder="Juan"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg ring-primary-foreground focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
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
              placeholder="Dela Cruz"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
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
              className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground text-gray-900"
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
              className="h-8 w-8 text-primary rounded-sm hover:bg-primary-foreground hover:text-white"
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
