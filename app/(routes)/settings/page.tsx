"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Settings } from "lucide-react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
} from "firebase/auth";
import { auth, firestore } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";
import { Button } from "@/components/ui/button";
import Dropdown from "@/components/ui/dropdown";
import UserProfile from "../dashboard/components/user-profile";
import useAuthState from "@/hooks/useAuthState";
import UserProfile2 from "../dashboard/components/user-profile-no-upload";

interface LoginActivity {
  device: string;
  location: string;
  date: string;
  time: string;
}

const SettingsPage = () => {
  const { userId, userFirstname, userLastname } = useAuthState();
  const [user, setUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<
    "account" | "password" | "notifications" | "help"
  >("account");
  const [dropdownExpanded, setDropdownExpanded] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [loginActivity, setLoginActivity] = useState<LoginActivity[]>([]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
          setFirstName(userData.firstName);
          setLastName(userData.lastName);
        }
      } else {
        router.push("/sign-in");
      }
      setLoading(false);
    });

    // Simulated login activity data (replace with actual implementation)
    setLoginActivity([
      {
        device: "Desktop",
        location: "Cebu City, Philippines",
        date: "July 1, 2024",
        time: "10:30 AM",
      },
      {
        device: "Mobile",
        location: "Cebu City, Philippines",
        date: "July 3, 2024",
        time: "3:15 PM",
      },
    ]);

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/sign-in");
    } catch (error) {
      console.error("Logout error:", error);
    }
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
    if (user) {
      try {
        const userRef = doc(firestore, "users", user.uid);
        await updateDoc(userRef, {
          firstName: firstName,
          lastName: lastName,
        });
        setUserName(`${firstName} ${lastName}`);
        setDropdownExpanded(null);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  const handleCancelChanges = () => {
    setFirstName(userName?.split(" ")[0] || "");
    setLastName(userName?.split(" ")[1] || "");
    setDropdownExpanded(null);
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
      {!loading && userName && (
        <div className="p-4 lg:px-16 space-y-4 pt-4">
          
          <div className="flex items-center gap-x-2 mr-auto pl-4">
            <Settings className="w-10 h-10 text-primary" />
            <div>
              <Heading
                title="Settings"
                description="Manage account settings."
                
              />
            </div>
            <div className="flex justify-end">
            <div className="ml-auto">
              {userId && <UserProfile2 userId={userId} />}
            </div>
          </div>
            
          </div>

          <div className="px-4 lg:px-16 space-y-4 pt-4">
            <nav className="flex space-x-4 border-b pb-2 flex-nowrap overflow-x-auto">
              <button
                className={`flex-1 px-3 py-2 rounded text-center ${
                  activeSection === "account"
                    ? "bg-primary text-white"
                    : "bg-transparent text-gray-700"
                }`}
                onClick={() => handleSectionChange("account")}
              >
                Account
              </button>
              <button
                className={`flex-1 px-3 py-2 rounded text-center ${
                  activeSection === "password"
                    ? "bg-primary text-white"
                    : "bg-transparent text-gray-700"
                }`}
                onClick={() => handleSectionChange("password")}
              >
                Password
              </button>
              <button
                className={`flex-1 px-3 py-2 rounded text-center ${
                  activeSection === "notifications"
                    ? "bg-primary text-white"
                    : "bg-transparent text-gray-700"
                }`}
                onClick={() => handleSectionChange("notifications")}
              >
                Notifications
              </button>
              <button
                className={`flex-1 px-3 py-2 rounded text-center ${
                  activeSection === "help"
                    ? "bg-primary text-white"
                    : "bg-transparent text-gray-700"
                }`}
                onClick={() => handleSectionChange("help")}
              >
                Help
              </button>
            </nav>
            {activeSection === "account" && (
              <div className="bg-transparent">
                {/* Dropdowns */}
                <Dropdown
                  title="View Profile Information"
                  expanded={dropdownExpanded === "View Profile Information"}
                  onToggle={() =>
                    setDropdownExpanded(
                      dropdownExpanded === "View Profile Information"
                        ? null
                        : "View Profile Information"
                    )
                  }
                >
                  <div className="relative w-full flex">
                    <div className="relative w-full max-w-md p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
                      <div className="absolute top-4 right-4"></div>
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
                            readOnly
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
                            readOnly
                            className="w-full border border-gray-300 p-2 rounded"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Dropdown>
                <Dropdown
                  title="Edit Profile Information"
                  expanded={dropdownExpanded === "Edit Profile Information"}
                  onToggle={() =>
                    setDropdownExpanded(
                      dropdownExpanded === "Edit Profile Information"
                        ? null
                        : "Edit Profile Information"
                    )
                  }
                >
                  <div className="relative w-full flex">
                    <div className="relative w-full max-w-md p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
                      <div className="absolute top-4 right-4"></div>
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
                        <Button onClick={handleCancelChanges} type="button">
                          Cancel
                        </Button>
                        <Button onClick={handleSaveChanges} type="button">
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </div>
                </Dropdown>
              </div>
            )}
            {activeSection === "password" && (
              <div className="bg-transparent">
                <form
                  className="max-w-md mx-auto bg-gray-300 p-4 rounded shadow"
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
                <div className="max-w-md mx-auto bg-gray-300 p-4 rounded shadow">
                  <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
                    Notification Settings
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2 text-primary">
                        Email Notifications
                      </label>
                      <input
                        type="checkbox"
                        className="form-checkbox text-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2 text-primary">
                        SMS Notifications
                      </label>
                      <input
                        type="checkbox"
                        className="form-checkbox text-primary"
                      />
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
                <div className="max-w-md mx-auto bg-gray-300 p-4 rounded shadow">
                  <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
                    Help & Support
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2 text-primary">
                        Frequently Asked Questions
                      </label>
                      <ul>
                        <li>
                          <a
                            href="#"
                            className="text-primary hover:underline"
                          >
                            How to change password?
                          </a>
                        </li>
                        <li>
                          <a
                            href="#"
                            className="text-primary hover:underline"
                          >
                            How to update profile information?
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2 text-primary">
                        Contact Support
                      </label>
                      <p>
                        If you need further assistance, please{" "}
                        <a
                          href="#"
                          className="text-primary hover:underline"
                        >
                          contact support
                        </a>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="mt-4 flex justify-end space-x-2">
              <Button onClick={handleLogout} type="button">
                Logout
              </Button>
            </div>
          </div>
          
        </div>
      )}
    </>
  );
};

export default SettingsPage;
