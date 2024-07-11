"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react"; // Assuming you use lucide-react for icons

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
        <Button variant="ghost" className="relative">
          <Bell className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-3 h-3 p-2 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-medium">Notifications</h4>
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
        <div className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <div key={notification.id} className="py-2">
              {notification.message}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
