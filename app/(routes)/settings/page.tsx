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

interface LoginActivity {
  device: string;
  location: string;
  date: string;
  time: string;
}

const SettingsPage = () => {
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
    <div className="p-4 lg:px-16 space-y-4 pt-4">
      <div className="flex items-center gap-x-2 mr-auto pl-4">
        <Settings className="w-10 h-10 text-primary" />
        <div>
          <Heading title="Settings" description="Manage account settings." />
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
                        className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
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
                        className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2 text-primary">
                        Email
                      </label>
                      <input
                        type="text"
                        value={user?.email || ""}
                        readOnly
                        className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Dropdown>
            <Dropdown
              title="Manage Profile Information"
              expanded={dropdownExpanded === "Manage Profile Information"}
              onToggle={() =>
                setDropdownExpanded(
                  dropdownExpanded === "Manage Profile Information"
                    ? null
                    : "Manage Profile Information"
                )
              }
            >
              <div className="relative w-full flex">
                <div className="relative w-full max-w-md p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
                  <div className="absolute top-4 right-4"></div>
                  <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
                    Manage Profile
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
                        required
                        className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
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
                        required
                        className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2 text-primary">
                        Email
                      </label>
                      <input
                        type="text"
                        value={user?.email || ""}
                        readOnly
                        className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-4 mt-4">
                    <Button
                      onClick={handleCancelChanges}
                      className="bg-gray-200 text-gray-700"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSaveChanges}
                      className="bg-primary text-white"
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </Dropdown>
            <Dropdown
              title="Account Ownership and Control"
              expanded={dropdownExpanded === "Account Ownership and Control"}
              onToggle={() =>
                setDropdownExpanded(
                  dropdownExpanded === "Account Ownership and Control"
                    ? null
                    : "Account Ownership and Control"
                )
              }
            >
              <div className="relative w-full flex">
                <div className="relative w-full max-w-md p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
                  <div className="absolute top-4 right-4"></div>
                  <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
                    Control Account
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="text-sm font-medium block mb-2 text-primary">
                        Deactivate Account
                      </label>
                      <label className="text-sm font-medium block mb-2 text-muted-foreground">
                        For deactivating your account, please specify the
                        duration in days or hours.
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          placeholder="Input number"
                          className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
                        />
                        <select className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900">
                          <option value="days">Days</option>
                          <option value="hours">Hours</option>
                        </select>
                      </div>
                      <div className="flex justify-center space-x-4 mt-4">
                        <Button className="bg-primary text-white">
                          Deactivate
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2 text-primary">
                        Delete Account
                      </label>
                      <label className="text-sm font-medium block mb-2 text-muted-foreground">
                        If you wish to permanently delete your account, please
                        proceed with the delete option. Note that account
                        deletion is irreversible.
                      </label>
                      <div className="flex justify-center space-x-4 mt-4">
                        <Button className="bg-red-600 text-white">
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Dropdown>
          </div>
        )}
        {activeSection === "password" && (
          <div className="bg-transparent">
            {/* Dropdowns */}
            <Dropdown
              title="View Login Activity"
              expanded={dropdownExpanded === "View Login Activity"}
              onToggle={() =>
                setDropdownExpanded(
                  dropdownExpanded === "View Login Activity"
                    ? null
                    : "View Login Activity"
                )
              }
            >
              <div className="relative w-full flex">
                <div className="relative w-full max-w-md p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
                  <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
                    Login Activity
                  </h2>
                  {loginActivity.length > 0 ? (
                    <div className="space-y-4">
                      {loginActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="border-2 outline-none rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400"
                        >
                          <div className="flex justify-between mb-2">
                            <div className="font-medium text-muted-foreground">
                              {activity.device}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {activity.date}, {activity.time}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Location: {activity.location}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center">
                      No login activity to display.
                    </p>
                  )}
                </div>
              </div>
            </Dropdown>
            <Dropdown
              title="Manage your password"
              expanded={dropdownExpanded === "Manage your password"}
              onToggle={() =>
                setDropdownExpanded(
                  dropdownExpanded === "Manage your password"
                    ? null
                    : "Manage your password"
                )
              }
            >
              <div className="relative w-full flex">
                <div className="relative w-full max-w-md p-4 border border-primary bg-gray-300 bg-opacity-90 dark:bg-opacity-0">
                  <div className="absolute top-4 right-4"></div>
                  <h2 className="text-2xl font-thin text-center mt-2 mb-2 font-roboto text-primary">
                    Change Password
                  </h2>
                  <form
                    onSubmit={handleChangePassword}
                    className="space-y-4 px-6 pb-4"
                  >
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="text-sm font-medium block mb-2 text-primary"
                      >
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="text-sm font-medium block mb-2 text-primary"
                      >
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground placeholder-gray-400 text-gray-900"
                      />
                    </div>
                    <div className="mb-48">
                      <label
                        htmlFor="confirmNewPassword"
                        className="text-sm font-medium block mb-2 text-primary"
                      >
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmNewPassword"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        className="border-2 outline-none sm:text-sm rounded-lg focus:primary-foreground block w-full p-2.5 bg-gray-200 border-primary focus:border-primary-foreground text-gray-900"
                      />
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    {message && (
                      <p className="text-green-500 text-sm">{message}</p>
                    )}
                    <Button type="submit" className="w-full flex bg-primary">
                      Change Password
                    </Button>
                    <Button
                      className="w-full flex bg-primary"
                      onClick={handleLogout}
                    >
                      Log out
                    </Button>
                  </form>
                </div>
              </div>
            </Dropdown>
          </div>
        )}
        {activeSection === "notifications" && (
          <div>
            {/* Render content related to Notifications */}
            <p>Notification settings content here...</p>
          </div>
        )}
        {activeSection === "help" && (
          <div>
            {/* Render content related to Help */}
            <p>Help and support content here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
