"use client";

import { useEffect } from "react";
import Link from "next/link";

import { MobileSidebar } from "./mobile-sidebar";
import { Button } from "@/components/ui/button";
import NotificationDropdown from "./notification-dropdown";
import UserProfilePhoto from "./user-profile-photo";
import useUserState from "@/hooks/useUserState";
import useActiveUsers from "@/hooks/useActiveUsers";

const Navbar = () => {
  const { userId, userEmail, userFirstName, userLastName } = useUserState();
  const { logActiveUser } = useActiveUsers();

  // Logs the active user when he visits any part of the app
  // since the the navbar is visible and called on all parts of
  // the web app.
  useEffect(() => {
    if (userId && userEmail && userFirstName && userLastName) {
      logActiveUser(userId, userEmail, userFirstName, userLastName);
    }
  }, [userId, userEmail, userFirstName, userLastName, logActiveUser]);

  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end space-x-2 md:space-x-4">
        <Link href="/booking">
          <Button className="text-xs md:text-base p-2 md:p-4">
            Book a Parking Slot
          </Button>
        </Link>
        <NotificationDropdown />
        <UserProfilePhoto />
      </div>
    </div>
  );
};

export default Navbar;
