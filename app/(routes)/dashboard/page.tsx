"use client";

import { Spinner } from "@/components/spinner";
import useAuthState from "@/hooks/useAuthState";

const DashboardPage = () => {
  const { userId, userFirstname, userLastname, loading } = useAuthState();

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
          <main className="flex flex-col items-center justify-center flex-grow mt-10">
            {userId && (
              <h1 className="text-4xl font-bold mb-6 ml-10">
                Welcome, {userFirstname} {userLastname}!
              </h1>
            )}
          </main>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
