"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";

import { auth } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { HomeIcon } from "lucide-react";

const ChangePasswordPage = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setMessage("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } else {
        setError("No user is currently signed in.");
      }
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
        <h2 className="text-2xl font-bold text-center mb-6">Change Password</h2>
        <form onSubmit={handleChangePassword} className="space-y-6 px-6 pb-4">
          <div>
            <label
              htmlFor="currentPassword"
              className="text-sm font-medium block mb-2 text-gray-300"
            >
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="newPassword"
              className="text-sm font-medium block mb-2 text-gray-300"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          <div>
            <label
              htmlFor="confirmNewPassword"
              className="text-sm font-medium block mb-2 text-gray-300"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmNewPassword"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              required
              className="border-2 outline-none sm:text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-600 border-gray-500 placeholder-gray-400 text-white"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}
          <Button type="submit" className="w-full flex">
            Change Password
          </Button>
        </form>
        <div className="flex flex-col items-center space-y-6 px-6 pb-4">
          <Link href="/dashboard">
            <div
              role="button"
              className="h-8 w-8 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600"
            >
              <HomeIcon className="h-8 w-8" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
