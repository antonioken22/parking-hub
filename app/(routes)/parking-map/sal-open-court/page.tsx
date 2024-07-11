"use client";

import useUserState from "@/hooks/useUserState";
import { Spinner } from "@/components/spinner";
import SALOpenCourtMap from "./sal-open-court-map";

const SALOpenCourtPage = () => {
  const { userId, loading } = useUserState();

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{!loading && userId !== null && <SALOpenCourtMap />}</>;
};

export default SALOpenCourtPage;
