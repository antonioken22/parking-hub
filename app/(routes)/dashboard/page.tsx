"use client";

import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/firebase/config";
import DashboardLayout from "./_components/dashboard-layout";
import { Spinner } from "@/components/spinner";
import useAuthState from "@/hooks/useAuthState";
import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

interface ParkingSlot {
  name: string;
  availableSlots: number;
  takenSlots: number;
}

const DashboardPage = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const { userId, userFirstname, userLastname } = useAuthState();
  const [parkingSlots, setParkingSlots] = useState<ParkingSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>({});
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(`${userData.firstName} ${userData.lastName}`);
        }
      } else {
        router.push("/sign-in");
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

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
  }, []);

  const chartOptions = {
    plugins: {
      datalabels: {
        display: true,
        color: "white",
        font: {
          weight: "bold" as const, // Ensure type compatibility
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
        <div>
          <main className="flex flex-col items-center justify-center flex-grow mt-10">
            {userId && (
              <h1 className="text-4xl font-bold mb-6 ml-10">
                Welcome, {userFirstname} {userLastname}!
              </h1>
            )}
            <div className="w-full max-w-4xl p-4">
              <h2 className="text-2xl font-bold mb-4">
                Parking Slot Comparison
              </h2>
              <Bar
                data={chartData}
                options={chartOptions}
                plugins={[ChartDataLabels]}
              />
            </div>
            {/* <DashboardLayout /> */}
          </main>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
