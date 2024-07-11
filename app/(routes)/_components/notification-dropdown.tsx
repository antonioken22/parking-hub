"use client";

import { useState } from "react";
import { Bell } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const notifications = [
  { id: 1, message: "New booking confirmed!" },
  { id: 2, message: "Your profile has been updated." },
  // Add more notifications here
];

const NotificationDropdown = () => {
  const [unreadCount, setUnreadCount] = useState(notifications.length);

  const markAllAsRead = () => {
    setUnreadCount(0);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="relative w-10 h-10 md:w-14 p-2 md:p-4"
        >
          <Bell className="w-8 h-8" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 p-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] md:w-[320px] mr-2 p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium text-sm md:text-base">Notifications</h4>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
        <div className="divide-y divide-muted">
          {notifications.map((notification) => (
            <div key={notification.id} className="py-2 text-sm md:text-base">
              {notification.message}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
