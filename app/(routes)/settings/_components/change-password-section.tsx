import { useState } from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";

import { Button } from "@/components/ui/button";
import { auth } from "@/firebase/config";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleCancelChanges = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

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
        setTimeout(() => {
          setMessage(null);
        }, 2000);
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
    <div className="bg-transparent">
      <form
        className="relative w-full max-w-md mx-auto p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0"
        onSubmit={handleChangePassword}
      >
        <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
          Change Password
        </h2>
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2 text-primary">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2 text-primary">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2 text-primary">
            Confirm New Password
          </label>
          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded"
          />
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {message && <div className="text-green-500 mb-4">{message}</div>}
        <div className="mt-4 flex justify-end space-x-2">
          <Button
            onClick={handleCancelChanges}
            type="button"
            className="text-xs md:text-base"
          >
            Cancel
          </Button>
          <Button type="submit" className="text-xs md:text-base">
            Change Password
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
