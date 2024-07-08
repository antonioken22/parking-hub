"use client";
import { useState, useEffect } from "react";
import { Settings } from "lucide-react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "@/firebase/config";
import { toast } from "sonner";
import { Heading } from "@/app/(routes)/_components/heading";
import { Spinner } from "@/components/spinner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Checkbox } from "@/components/ui/checkbox";
import UserProfile from "../dashboard/components/user-profile";
import useAuthState from "@/hooks/useAuthState";

const SettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<
    "account" | "password" | "notifications" | "help"
  >("account");
  const { userId, userFirstname, userLastname } = useAuthState();
  const [firstName, setFirstName] = useState(userFirstname || "");
  const [lastName, setLastName] = useState(userLastname || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      setFirstName(userFirstname || "");
      setLastName(userLastname || "");
      setLoading(false);
    }
  }, [userId]);

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

  const handleSectionChange = (
    section: "account" | "password" | "notifications" | "help"
  ) => {
    setActiveSection(section);
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
        console.error("Error updating profile:", error);
        setError("Error updating profile.");
      }
    }
  };

  const handleCancelChanges = () => {
    setFirstName(userFirstname || "");
    setLastName(userLastname || "");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {!loading && userId && (
        <div className="p-4 lg:px-16 space-y-4 pt-4">
          <div className="flex items-center gap-x-2 mr-auto pl-4">
            <Settings className="w-10 h-10 text-primary" />
            <div>
              <Heading
                title="Settings"
                description="Manage account settings."
              />
            </div>
          </div>

          <div className="px-4 lg:px-16 space-y-4 pt-4">
            <nav className="flex space-x-4 border-b pb-2 flex-nowrap overflow-x-auto">
              <Button
                variant={activeSection === "account" ? "clicked" : "notclicked"}
                onClick={() => handleSectionChange("account")}
              >
                Account
              </Button>
              <Button
                variant={
                  activeSection === "password" ? "clicked" : "notclicked"
                }
                onClick={() => handleSectionChange("password")}
              >
                Password
              </Button>
              <Button
                variant={
                  activeSection === "notifications" ? "clicked" : "notclicked"
                }
                onClick={() => handleSectionChange("notifications")}
              >
                Notifications
              </Button>
              <Button
                variant={activeSection === "help" ? "clicked" : "notclicked"}
                onClick={() => handleSectionChange("help")}
              >
                Help
              </Button>
            </nav>
            {activeSection === "account" && (
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
                        {userId && <UserProfile userId={userId} />}
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
                          <Button type="button">Save Changes</Button>
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
            )}
            {activeSection === "password" && (
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
                  {message && (
                    <div className="text-green-500 mb-4">{message}</div>
                  )}
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button onClick={handleCancelChanges} type="button">
                      Cancel
                    </Button>
                    <Button type="submit">Change Password</Button>
                  </div>
                </form>
              </div>
            )}
            {activeSection === "notifications" && (
              <div className="bg-transparent">
                <div className="relative w-full max-w-md mx-auto p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
                  <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
                    Notification Settings
                  </h2>
                  <div className="items-top flex space-x-2">
                    <Checkbox id="terms1" />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary"
                      >
                        Receive email notifications
                      </label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Important updates and alerts via email.
                      </p>
                    </div>
                  </div>
                  <div className="items-top flex space-x-2">
                    <Checkbox id="terms2" />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor="terms2"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-primary"
                      >
                        Receive SMS notifications
                      </label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Updates and alerts directly to your phone via SMS.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button type="button">Save Changes</Button>
                  </div>
                </div>
              </div>
            )}
            {activeSection === "help" && (
              <div className="bg-transparent">
                <div className="relative w-full max-w-md mx-auto p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
                  <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
                    Help & Support
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2 text-primary">
                        Frequently Asked Questions
                      </label>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger>
                            How to change password?
                          </AccordionTrigger>
                          <AccordionContent>
                            Go to Password tab in settings.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                          <AccordionTrigger>
                            How to update profile information?
                          </AccordionTrigger>
                          <AccordionContent>
                            Go to Account tab in settings.
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                          <AccordionTrigger>
                            How to know available parking spaces?
                          </AccordionTrigger>
                          <AccordionContent>
                            Go to Parking Map and click the area you want to
                            view.
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default SettingsPage;
