"use client";

import Link from "next/link";

import { MobileSidebar } from "./mobile-sidebar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import NotificationDropdown from "./notification-dropdown";
import UserProfilePhoto from "./user-profile-photo";

const Navbar = () => {
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
