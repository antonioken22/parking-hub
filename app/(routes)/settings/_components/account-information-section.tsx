import { useEffect, useState } from "react";
import { toast } from "sonner";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "@/firebase/config";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import useUserState from "@/hooks/useUserState";
import UserProfileUpdatePhoto from "./user-profile-update-photo";

const AccountInformation = () => {
  const { userId, userFirstname, userLastname } = useUserState();
  const [firstName, setFirstName] = useState(userFirstname || "");
  const [lastName, setLastName] = useState(userLastname || "");

  useEffect(() => {
    if (userId) {
      setFirstName(userFirstname || "");
      setLastName(userLastname || "");
    }
  }, [userId, userFirstname, userLastname]);

  const handleCancelChanges = () => {
    setFirstName(userFirstname || "");
    setLastName(userLastname || "");
  };

  const handleSaveChanges = async () => {
    if (userId) {
      try {
        const userRef = doc(firestore, "users", userId);
        await updateDoc(userRef, {
          firstName,
          lastName,
        });
        toast.success("Profile updated successfully!");
      } catch (error) {
        // console.error("Error updating profile:", error);
        toast.error("Error updating profile.");
      }
    }
  };

  return (
    <div className="bg-transparent">
      <div className="relative w-full max-w-md mx-auto p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
        <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
          Profile Information
        </h2>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium block mb-2 text-primary">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
          </div>
          <div>
            <label className="text-sm font-medium block mb-2 text-primary">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-gray-300 p-2 rounded"
            />
            <aside className="mt-10">
              {userId && <UserProfileUpdatePhoto />}
            </aside>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div
                role="button"
                className="mt-auto flex items-center justify-start px-6 py-2 "
              >
                <Button type="button" className="text-xs md:text-base">
                  Save Changes
                </Button>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Update Profile</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to save these changes?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={handleCancelChanges}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveChanges}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default AccountInformation;
