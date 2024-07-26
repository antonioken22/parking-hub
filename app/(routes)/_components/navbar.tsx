"use client";

import { useEffect } from "react";
import Link from "next/link";

import { MobileSidebar } from "./mobile-sidebar";
import { Button } from "@/components/ui/button";
import NotificationDropdown from "./notification-dropdown";
import UserProfilePhoto from "./user-profile-photo";
import useUserState from "@/hooks/useUserState";
import useActiveUsers from "@/hooks/useActiveUsers";
import useChatActiveUsers from "@/hooks/useChatActiveUsers";

const Navbar = () => {
  const { userId, userEmail, userFirstName, userLastName } = useUserState();
  const { logActiveUser } = useActiveUsers();
  const { logChatActiveUser } = useChatActiveUsers();

  // Logs the active user when he visits any part of the app
  // since the the navbar is visible and called on all parts of
  // the web app.
  useEffect(() => {
    if (userId && userEmail && userFirstName && userLastName) {
      logActiveUser(userId, userEmail, userFirstName, userLastName);
      logChatActiveUser(userId, userEmail, userFirstName, userLastName);

      // Gets device current current start of the minute (ex. 7h:40m:00s)
      const now = new Date();
      const millisecondsUntilNextMinute =
        (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

      const startInterval = () => {
        logChatActiveUser(userId, userEmail, userFirstName, userLastName);

        // Then polls every 1 minute from there
        const interval = setInterval(() => {
         // logChatActiveUser(userId, userEmail, userFirstName, userLastName);
        }, 60000);

        return () => clearInterval(interval);
      };

      const timeout = setTimeout(() => {
        startInterval();
      }, millisecondsUntilNextMinute);

      return () => clearTimeout(timeout);
    }
  }, [
    userId,
    userEmail,
    userFirstName,
    userLastName,
    logActiveUser,
    logChatActiveUser,
  ]);

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
