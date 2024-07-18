"use client";

import { FileClock } from "lucide-react";

import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";
import useUserState from "@/hooks/useUserState";
import ParkingLogs from "./_components/parking-logs";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const ParkingHistoryPage = () => {
  const { userId, loading } = useUserState();

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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-x-3">
              <FileClock className="w-10 h-10 text-primary" />
              <div>
                <Heading
                  title="Parking History"
                  description="View your parking history."
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 lg:px-8 space-y-4 pt-4">
            <ParkingLogs />
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ParkingHistoryPage;
