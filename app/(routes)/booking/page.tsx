"use client";

import { Car, Ticket } from "lucide-react";

import { Check, X } from "lucide-react";
import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import useUserState from "@/hooks/useUserState";
import useFcmToken from "@/hooks/useFcmToken";
import useStoreFcmToken from "@/hooks/useStoreFcmToken";

const BookingPage = () => {
  const { userId, loading } = useUserState();
  const { token, notificationPermissionStatus } = useFcmToken();
  const isBooked = useStoreFcmToken(token);

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {!loading && userId && (
        <div>
          <div className="flex items-center gap-x-3 mr-auto pl-4">
            <Ticket className="w-10 h-10 text-primary" />
            <div>
              <Heading title="Booking" description="Rent a parking slot." />
            </div>
          </div>
          <div className="px-4 lg:px-8 space-y-4 pt-4">
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
                <AlertTitle className="text-red-500">
                  Notification Status
                </AlertTitle>
                <AlertDescription>
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
          </div>
        </div>
      )}
    </>
  );
};

export default BookingPage;
