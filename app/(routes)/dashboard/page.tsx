"use client";

import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Line } from "react-chartjs-2";
import { useState, useEffect } from "react";

import { Spinner } from "@/components/spinner";
import useUserState from "@/hooks/useUserState";
import useParkingSlotCount from "@/hooks/useParkingSlotCount";
import useActiveUsers from "@/hooks/useActiveUsers";

interface ActiveUser {
  time: string;
  count: number;
}

const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
};

const DashboardPage = () => {
  const { userId, userFirstName, userLastName, loading } = useUserState();
  // Parking Slot Status Hooks
  const { GLE, NGE, RTL, SAL } = useParkingSlotCount();
  const [chartData, setChartData] = useState<any>({});
  // Active Users Hooks
  const { activeUsers } = useActiveUsers();

  const [activeUsersData, setActiveUsersData] = useState<any>({});
  const currentDate = formatDate(new Date());
  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));

  // Always update the currentTime every second (client-side only)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

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

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const data = activeUsers.map((entry: ActiveUser) => ({
        time: entry.time, // e.g., "06:00", "07:00", etc.
        count: entry.count, // Number of active users
      }));

      setActiveUsersData({
        labels: data.map((entry: ActiveUser) => entry.time),
        datasets: [
          {
            label: "Active Users",
            data: data.map((entry: ActiveUser) => entry.count),
            borderColor: "Red",
            backgroundColor: "Red",
            fill: false,
          },
        ],
      });
    };

    fetchActiveUsers();
  }, [activeUsers]);

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

  const lineChartOptions = {
    plugins: {
      datalabels: {
        display: true,
        color: "Orange",
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
              <div className="text-center md:text-left mx-2 md:ml-10 mb-6">
                <h1 className="text-xl md:text-4xl font-bold">
                  <span className="text-primary">Welcome,</span> {userFirstName}{" "}
                  {userLastName}!
                </h1>
                <div className="flex flex-row space-x-4 justify-center">
                  <h2 className="text-primary text-sm md:text-lg">
                    Date:{" "}
                    <span className="text-secondary-foreground">
                      {currentDate}
                    </span>
                  </h2>
                  <h2 className="text-primary text-sm md:text-lg">
                    Time:{" "}
                    <span className="text-secondary-foreground">
                      {currentTime}
                    </span>
                  </h2>
                </div>
              </div>
            )}
            <div className="grid-cols-1 w-full max-w-7xl p-4">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Parking Slot Status{" "}
                <span className="text-primary">(Overview)</span>
              </h2>
              <Bar
                data={chartData}
                options={chartOptions}
                plugins={[ChartDataLabels]}
              />
            </div>
            <div className="grid-cols-1 w-full max-w-7xl p-4 mt-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4">
                Active Users <span className="text-primary">(Today)</span>
              </h2>
              <Line
                data={activeUsersData}
                options={lineChartOptions}
                plugins={[ChartDataLabels]}
              />
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
