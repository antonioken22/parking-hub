"use client";

import { Spinner } from "@/components/spinner";
import useAuthState from "@/hooks/useAuthState";
import { Bar, Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

interface ParkingSlot {
  name: string;
  availableSlots: number;
  takenSlots: number;
}

interface SlotTimeRecord {
  time: string; // Assuming time format like "6 AM", "7 AM", ..., "10 PM"
  takenSlots: number;
}

const DashboardPage = () => {
  const { userId, userFirstname, userLastname, loading } = useAuthState();
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [chartData, setChartData] = useState<any>({});
  const [lineChartData, setLineChartData] = useState<any>({});
  const [currentDate, setCurrentDate] = useState<string>("");

  useEffect(() => {
    const fetchParkingSlots = async () => {
      // Example data, replace with your actual data fetching logic
      const data = [
        { name: "RTL", availableSlots: 10, takenSlots: 5 },
        { name: "GLE", availableSlots: 5, takenSlots: 10 },
        { name: "ALLIED", availableSlots: 15, takenSlots: 0 },
        { name: "NGE", availableSlots: 7, takenSlots: 8 },
        { name: "PE AREA", availableSlots: 12, takenSlots: 3 },
        { name: "Back Gate", availableSlots: 8, takenSlots: 7 },
      ];
      setParkingSlots(data);

      // Example line chart data (slots taken over time)
      const lineData = [
        { time: "6 AM", takenSlots: 3 },
        { time: "7 AM", takenSlots: 5 },
        { time: "8 AM", takenSlots: 8 },
        { time: "9 AM", takenSlots: 10 },
        { time: "10 AM", takenSlots: 12 },
        { time: "11 AM", takenSlots: 15 },
        { time: "12 PM", takenSlots: 17 },
        { time: "1 PM", takenSlots: 14 },
        { time: "2 PM", takenSlots: 12 },
        { time: "3 PM", takenSlots: 10 },
        { time: "4 PM", takenSlots: 8 },
        { time: "5 PM", takenSlots: 6 },
        { time: "6 PM", takenSlots: 7 },
        { time: "7 PM", takenSlots: 9 },
        { time: "8 PM", takenSlots: 11 },
        { time: "9 PM", takenSlots: 13 },
        { time: "10 PM", takenSlots: 15 },
      ];
      setLineChartData({
        labels: lineData.map((record) => record.time),
        datasets: [
          {
            label: "Slots Taken Over Time",
            data: lineData.map((record) => record.takenSlots),
            borderColor: "rgba(247, 149, 29)",
            backgroundColor: "rgba(247, 149, 29)",
            tension: 0.4,
          },
        ],
      });

      setChartData({
        labels: data.map((lot) => lot.name),
        datasets: [
          {
            label: "Available Parking Slots",
            data: data.map((lot) => lot.availableSlots),
            backgroundColor: "rgba(247, 149, 29)",
          },
          {
            label: "Taken Parking Slots",
            data: data.map((lot) => lot.takenSlots),
            backgroundColor: "rgba(250, 50, 81)",
          },
        ],
      });
    };

    fetchParkingSlots();

    const getCurrentDate = () => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    getCurrentDate();
  }, []);

  const chartOptions = {
    plugins: {
      datalabels: {
        display: true,
        color: "white",
        font: {
          weight: "bold" as const,
        },
      },
    },
    responsive: true,
    aspectRatio: 1.5, // Adjust aspect ratio to fit approximately 240px width
    scales: {
      x: {
        grid: {
          display: false, // Disable x-axis grid lines
        },
        beginAtZero: true,
      },
      y: {
        grid: {
          display: false, // Disable y-axis grid lines
        },
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
        <div>
          <h1 className="text-3xl font-bold mb-6 ml-10 text-orange-500" style={{ color: "rgb(247, 149, 29)" }}>
           Dashboard
          </h1>
          

          <main className="flex flex-col items-center justify-center flex-grow mt-10">
            <h2 className="text-4xl font-bold mt-4 mb-4"> Welcome, {userFirstname} {userLastname}! </h2>
            <h3 className="text-2xl font-bold mb-4 ml-10">{currentDate}</h3>
            <div className="w-full max-w-6xl p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-2">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-bold mb-2">Slots Taken Over Time</h3>
                    <div className="h-96 w-full">
                      <Line data={lineChartData} options={chartOptions} />
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <div className="flex flex-col space-y-4">
                    <h3 className="text-lg font-bold mb-2">Parking Slot Comparison</h3>
                    <div className="h-96 w-full">
                      <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
