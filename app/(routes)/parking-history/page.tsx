"use client";

import { FileClock } from "lucide-react";

import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";
import useAuthState from "@/hooks/useAuthState";
import ParkingLogs from "./_components/dashboard-layout";

const ParkingHistoryPage = () => {
  const { userId, loading } = useAuthState();

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
            <FileClock className="w-10 h-10 text-primary" />
            <div>
              <Heading
                title="Parking History"
                description="View your parking history."
              />
            </div>
          </div>
          <div className="px-4 lg:px-8 space-y-4 pt-4">
            <ParkingLogs />
          </div>
        </div>
      )}
    </>
  );
};

export default ParkingHistoryPage;
