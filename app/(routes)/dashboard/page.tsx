"use client";

import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";

import { Spinner } from "@/components/spinner";
import useAuthState from "@/hooks/useAuthState";
import useParkingSlotCount from "@/hooks/useParkingSlotCount";
import UserProfile2 from "./components/user-profile-no-upload";

const DashboardPage = () => {
  const { userId, userFirstname, userLastname, loading } = useAuthState();
  const [chartData, setChartData] = useState<any>({});
  const { GLE, NGE, RTL, SAL } = useParkingSlotCount();

  useEffect(() => {
    const fetchParkingSlots = async () => {
      const data = [
        {
          name: "GLE Open Area",
          availableSlots: GLE.available,
          occupiedSlots: GLE.occupied,
          reservedSlots: GLE.reserved,
          unavailableSlots: GLE.unavailable,
        },
        {
          name: "NGE Open Area",
          availableSlots: NGE.available,
          occupiedSlots: NGE.occupied,
          reservedSlots: NGE.reserved,
          unavailableSlots: NGE.unavailable,
        },
        {
          name: "RTL Open Court",
          availableSlots: RTL.available,
          occupiedSlots: RTL.occupied,
          reservedSlots: RTL.reserved,
          unavailableSlots: RTL.unavailable,
        },
        {
          name: "SAL Open Court",
          availableSlots: SAL.available,
          occupiedSlots: SAL.occupied,
          reservedSlots: SAL.reserved,
          unavailableSlots: SAL.unavailable,
        },
      ];

      setChartData({
        labels: data.map((lot) => lot.name),
        datasets: [
          {
            label: "Available",
            data: data.map((lot) => lot.availableSlots),
            backgroundColor: "green",
          },
          {
            label: "Occupied",
            data: data.map((lot) => lot.occupiedSlots),
            backgroundColor: "gray",
          },
          {
            label: "Reserved",
            data: data.map((lot) => lot.reservedSlots),
            backgroundColor: "yellow",
          },
          {
            label: "Unavailable",
            data: data.map((lot) => lot.unavailableSlots),
            backgroundColor: "red",
          },
        ],
      });
    };

    fetchParkingSlots();
  }, [GLE, NGE, RTL, SAL]);

  const chartOptions = {
    plugins: {
      datalabels: {
        display: true,
        color: "orange",
        font: {
          weight: "bold" as const,
        },
      },
    },
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

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
        <div className="flex flex-col md:flex-row">
          <main className="flex flex-col items-center justify-center flex-grow mt-10">
            {userId && (
              <h1 className="text-xl md:text-4xl font-bold mb-6 md:ml-10">
                <span className="text-orange-500">Welcome,</span>{" "}
                {userFirstname} {userLastname}!
              </h1>
            )}
            <div className="grid-cols-1 w-full max-w-7xl p-4">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Parking Slot Status{" "}
                <span className="text-orange-500">(Overview)</span>
              </h2>
              <Bar
                data={chartData}
                options={chartOptions}
                plugins={[ChartDataLabels]}
              />
            </div>
          </main>
          {/*TODO: Improve the layout and UI */}
          {/* <aside className="w-full md:w-1/3 p-4">
          <UserProfile2 userId={userId} />
          </aside> */}
        </div>
      )}
    </>
  );
};

export default DashboardPage;
