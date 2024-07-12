"use client";

import { useEffect, useState } from "react";
import { BellRing, Ticket, Check, X } from "lucide-react";

import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { useUserNotificationStatus } from "@/hooks/useUserNotificationStatus";
import useUserState from "@/hooks/useUserState";
import useFcmToken from "@/hooks/useFcmToken";
import useStoreFcmToken from "@/hooks/useStoreFcmToken";

const BookingPage = () => {
  const {
    userId,
    loading: userLoading,
    userPushNotificationStatus,
    setUserPushNotificationStatus,
  } = useUserState();
  const { updatePushNotificationStatus } = useUserNotificationStatus();
  const [pushNotification, setPushNotification] = useState(
    userPushNotificationStatus
  );
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (Notification.permission === "granted") {
      setPushNotification(true);
      setUserPushNotificationStatus(true);
      setDescription("Push notification is currently on.");
    } else {
      setPushNotification(false);
      setUserPushNotificationStatus(false);
      setDescription("Push notification is currently off.");
    }
  }, [setUserPushNotificationStatus]);

  useEffect(() => {
    if (Notification.permission === "granted") {
      updatePushNotificationStatus(true);
    } else {
      updatePushNotificationStatus(false);
    }
  }, [updatePushNotificationStatus]);

  const handlePushNotificationChange = (checked: boolean) => {
    if (checked && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          setPushNotification(true);
          setUserPushNotificationStatus(true);
          updatePushNotificationStatus(false);
          setDescription(
            "Push notification is now turned on. Please refresh the page to save the changes."
          );
          updatePushNotificationStatus(true);
        } else {
          setPushNotification(false);
          setUserPushNotificationStatus(false);
          updatePushNotificationStatus(false);
          setDescription("Push notification is currently off.");
        }
      });
    } else {
      setPushNotification(checked);
      if (checked) {
        setDescription("Push notification is currently on.");
      } else {
        setDescription("Push notification is currently off.");
      }
    }
  };

  // Firebase operations
  const { token, notificationPermissionStatus } = useFcmToken();
  const isBooked = useStoreFcmToken(token);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {!userLoading && userId && (
        <div>
          <div className="flex items-center gap-x-3 mr-auto pl-4">
            <Ticket className="w-10 h-10 text-primary" />
            <div>
              <Heading title="Booking" description="Rent a parking slot." />
            </div>
          </div>
          <div className="px-4 lg:px-8 space-y-4 pt-4">
            <h1 className="text-4xl mb-4 font-bold">Contact The Guard</h1>
            <p className="text-muted-foreground">
              Please enable your notification to proceed with booking
            </p>
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <BellRing />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">
                  Push Notifications
                </p>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
              <Switch
                checked={pushNotification}
                onCheckedChange={handlePushNotificationChange}
              />
            </div>
            {notificationPermissionStatus === "granted" ? (
              <Alert className="border border-green-500 mt-4">
                <Check className=" h-4 w-4 " />
                <AlertTitle className="text-green-500">
                  Notification Status
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  Permission to receive notifications has been granted.
                </AlertDescription>
              </Alert>
            ) : notificationPermissionStatus !== null ? (
              <Alert className="border border-red-500 mt-4">
                <X className=" h-4 w-4 " />
                <AlertTitle className="text-red-500">
                  Notification Status
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  You have not granted permission to receive notifications.
                  Please enable notifications in your browser settings.
                </AlertDescription>
              </Alert>
            ) : null}

            {isBooked ? (
              <Alert className="border border-green-500 mt-4">
                <Check className=" h-4 w-4 " />
                <AlertTitle className="text-green-500">
                  Booking Status
                </AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  You have successfully booked a parking slot.
                </AlertDescription>
              </Alert>
            ) : notificationPermissionStatus !== null ? (
              <Alert className="border border-red-500 mt-4">
                <X className=" h-4 w-4 " />
                <AlertTitle className="text-red-500">Booking Status</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  You have not booked a parking slot yet.
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default BookingPage;
