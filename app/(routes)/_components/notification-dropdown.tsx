"use client";

import { useState, useEffect } from "react";
import { Bell, Trash2, CheckCircle } from "lucide-react";
import { Timestamp } from "firebase/firestore";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

import useUserState from "@/hooks/useUserState";
import useNotifications from "@/hooks/useNotifications";
import { Notification } from "@/types/Notification";

const NotificationDropdown = () => {
  const { userId } = useUserState();
  const { notifications, markAsRead, removeFromView } = useNotifications();
  const [unreadCount, setUnreadCount] = useState(0);
  const maxNotificationsToShow = 10; // Limit number of notifications to show

  useEffect(() => {
    const userNotifications = notifications.filter((notification) =>
      notification.recipient.some((recipient) => recipient.userId === userId)
    );
    const count = userNotifications.filter(
      (notification) => !notification.isRead
    ).length;
    setUnreadCount(count);
  }, [notifications, userId]);

  const markAllAsRead = async () => {
    const unreadNotifications = notifications
      .filter((notification) => !notification.isRead)
      // Unreads from the oldest to newest
      .sort((a, b) => {
        const dateA = (a.dateCreated as unknown as Timestamp)?.seconds ?? 0;
        const dateB = (b.dateCreated as unknown as Timestamp)?.seconds ?? 0;
        // Sort in ascending order (oldest first)
        return dateA - dateB;
      });

    for (const notification of unreadNotifications) {
      await markAsRead(notification.id || "");
    }
    setUnreadCount(0);
  };

  const handleRemoveFromView = async (notificationId: string) => {
    await markAsRead(notificationId);
    await removeFromView(notificationId);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const userNotifications = notifications
    .filter(
      (notification) =>
        notification.recipient.some(
          (recipient) => recipient.userId === userId
        ) && notification.isView
    )
    // Sort notifications based on timestamp seconds
    .sort((a, b) => {
      const dateA = (a.dateCreated as unknown as Timestamp)?.seconds ?? 0;
      const dateB = (b.dateCreated as unknown as Timestamp)?.seconds ?? 0;
      return dateB - dateA; // Sort in descending order (latest first)
    })
    // Limit the number of notifications displayed
    .slice(0, maxNotificationsToShow);

  // <nl/> parser from Firestore to actual new line in layout
  const replaceNlWithNewLine = (str: string) => {
    return str.split("<nl/>").map((item, index) => (
      <span key={index}>
        {item}
        {index < str.split("<nl/>").length - 1 && <br />}
      </span>
    ));
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
        <div className="divide-y divide-muted max-h-80 overflow-y-auto">
          {userNotifications.length > 0 ? (
            userNotifications.map((notification: Notification) => (
              <div
                key={notification.id}
                className={`flex justify-between items-center py-2 text-xs md:text-sm ${
                  notification.isRead ? "text-muted-foreground" : "font-normal"
                }`}
              >
                <span>{replaceNlWithNewLine(notification.body || "")}</span>
                <div className="flex flex-col items-center space-y-1 ml-1">
                  <div className="flex flex-col items-center">
                    <div
                      role="button"
                      onClick={() => handleMarkAsRead(notification.id || "")}
                      className="p-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-muted">Read</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div
                      role="button"
                      onClick={() =>
                        handleRemoveFromView(notification.id || "")
                      }
                      className="p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-muted">Delete</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              className="py-2 text-xs md:text-sm text-muted-foreground italic
            text-center"
            >
              No notifications.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationDropdown;
