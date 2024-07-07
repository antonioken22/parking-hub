"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, X } from "lucide-react";
import useFcmToken from "@/hooks/useFcmToken";
import useStoreFcmToken from "@/hooks/useStoreFcmToken";

export default function Home() {
  const { token, notificationPermissionStatus } = useFcmToken();
  const isBooked = useStoreFcmToken(token);

  return (
    <main className="p-10">
      <h1 className="text-4xl mb-4 font-bold">Contact The Guard</h1>
      <p>Please enable your notification to proceed with booking</p>

      {notificationPermissionStatus === "granted" ? (
        <Alert className="border border-green-500 mt-4">
          <Check className=" h-4 w-4 " />
          <AlertTitle className="text-green-500">
            Notification Status
          </AlertTitle>
          <AlertDescription>
            Permission to receive notifications has been granted.
          </AlertDescription>
        </Alert>
      ) : notificationPermissionStatus !== null ? (
        <Alert className="border border-red-500 mt-4">
          <X className=" h-4 w-4 " />
          <AlertTitle className="text-red-500">Notification Status</AlertTitle>
          <AlertDescription>
            You have not granted permission to receive notifications. Please
            enable notifications in your browser settings.
          </AlertDescription>
        </Alert>
      ) : null}

      {isBooked ? (
        <Alert className="border border-green-500 mt-4">
          <Check className=" h-4 w-4 " />
          <AlertTitle className="text-green-500">Booking Status</AlertTitle>
          <AlertDescription>
            You have successfully booked a parking slot.
          </AlertDescription>
        </Alert>
      ) : notificationPermissionStatus !== null ? (
        <Alert className="border border-red-500 mt-4">
          <X className=" h-4 w-4 " />
          <AlertTitle className="text-red-500">Booking Status</AlertTitle>
          <AlertDescription>
            You have not booked a parking slot yet.
          </AlertDescription>
        </Alert>
      ) : null}
    </main>
  );
}
