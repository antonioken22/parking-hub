"use client";

import useUserState from "@/hooks/useUserState";
import { Spinner } from "@/components/spinner";
import GLEOpenAreaMap from "./gle-open-area-map";

const GLEOpenAreaPage = () => {
  const { userId, loading } = useUserState();

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return <>{!loading && userId !== null && <GLEOpenAreaMap />}</>;
};

export default GLEOpenAreaPage;
