import { useState } from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { auth } from "@/firebase/config";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const togglePasswordVisibility = (type: string) => {
    if (type === "current") {
      setShowCurrentPassword((prevState) => !prevState);
    } else if (type === "new") {
      setShowNewPassword((prevState) => !prevState);
    } else if (type === "confirm") {
      setShowConfirmNewPassword((prevState) => !prevState);
    }
  };

  const handleCancelChanges = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };

  const handleError = (message: string) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 2000);
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    if (newPassword !== confirmNewPassword) {
      handleError("New passwords do not match.");
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
        handleCancelChanges();
      } else {
        handleError("No user is currently signed in.");
      }
    } catch (error) {
      if (error instanceof Error) {
        handleError(error.message);
      } else {
        handleError("An unknown error occurred.");
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
          <div className="relative">
            <Input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-primary hover:text-primary-foreground"
            >
              {showCurrentPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2 text-primary">
            New Password
          </label>
          <div className="relative">
            <Input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-primary hover:text-primary-foreground"
            >
              {showNewPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2 text-primary">
            Confirm New Password
          </label>
          <div className="relative">
            <Input
              type={showConfirmNewPassword ? "text" : "password"}
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-primary hover:text-primary-foreground"
            >
              {showConfirmNewPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
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
