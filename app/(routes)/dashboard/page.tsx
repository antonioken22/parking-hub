'use client';

import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import 'chart.js/auto';
import '@/public/chartConfig';
import { Spinner } from '@/components/spinner';
import useUserState from '@/hooks/useUserState';
import useParkingSlotCount from '@/hooks/useParkingSlotCount';
import useActiveUsers from '@/hooks/useActiveUsers';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface ActiveUser {
  time: string;
  count: number;
}

const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
};

const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  return `${formattedHours}:${minutes}:${seconds} ${ampm}`;
};

const DashboardPage = () => {
  const { userId, userFirstName, userLastName, loading } = useUserState();
  const { GLE, NGE, RTL, SAL } = useParkingSlotCount();
  const { activeUsers } = useActiveUsers();

  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'histogram'>('bar');
  const [chartData, setChartData] = useState<any>({});
  const [activeUsersData, setActiveUsersData] = useState<any>({});
  const [pieChartData, setPieChartData] = useState<any>({});
  const [histogramData, setHistogramData] = useState<any>({});
  const currentDate = formatDate(new Date());
  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchParkingSlots = async () => {
      const data = [
        {
          name: 'GLE Open Area',
          availableSlots: GLE.available,
          occupiedSlots: GLE.occupied,
          reservedSlots: GLE.reserved,
          unavailableSlots: GLE.unavailable,
        },
        {
          name: 'NGE Open Area',
          availableSlots: NGE.available,
          occupiedSlots: NGE.occupied,
          reservedSlots: NGE.reserved,
          unavailableSlots: NGE.unavailable,
        },
        {
          name: 'RTL Open Court',
          availableSlots: RTL.available,
          occupiedSlots: RTL.occupied,
          reservedSlots: RTL.reserved,
          unavailableSlots: RTL.unavailable,
        },
        {
          name: 'SAL Open Court',
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
            label: 'Available',
            data: data.map((lot) => lot.availableSlots),
            backgroundColor: 'green',
          },
          {
            label: 'Occupied',
            data: data.map((lot) => lot.occupiedSlots),
            backgroundColor: 'gray',
          },
          {
            label: 'Reserved',
            data: data.map((lot) => lot.reservedSlots),
            backgroundColor: 'yellow',
          },
          {
            label: 'Unavailable',
            data: data.map((lot) => lot.unavailableSlots),
            backgroundColor: 'red',
          },
        ],
      });

      const totalData = [
        {
          label: 'Available',
          value: data.reduce((sum, lot) => sum + lot.availableSlots, 0),
        },
        {
          label: 'Occupied',
          value: data.reduce((sum, lot) => sum + lot.occupiedSlots, 0),
        },
        {
          label: 'Reserved',
          value: data.reduce((sum, lot) => sum + lot.reservedSlots, 0),
        },
        {
          label: 'Unavailable',
          value: data.reduce((sum, lot) => sum + lot.unavailableSlots, 0),
        },
      ];

      setPieChartData({
        labels: totalData.map((entry) => entry.label),
        datasets: [
          {
            label: 'Slot Distribution',
            data: totalData.map((entry) => entry.value),
            backgroundColor: [
              'rgba(0, 255, 0, 0.2)',
              'rgba(128, 128, 128, 0.2)',
              'rgba(255, 255, 0, 0.2)',
              'rgba(255, 0, 0, 0.2)',
            ],
            borderColor: [
              'rgba(0, 255, 0, 1)',
              'rgba(128, 128, 128, 1)',
              'rgba(255, 255, 0, 1)',
              'rgba(255, 0, 0, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });

      // Histogram Data: Example data (adjust as needed)
      const histogramExampleData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Monthly Slots Usage',
            data: [30, 45, 50, 40, 60], // Example values
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
        ],
      };

      setHistogramData(histogramExampleData);
    };

    fetchParkingSlots();
  }, [GLE, NGE, RTL, SAL]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      const data = activeUsers.map((entry: ActiveUser) => ({
        time: entry.time,
        count: entry.count,
      }));

      setActiveUsersData({
        labels: data.map((entry: ActiveUser) => entry.time),
        datasets: [
          {
            label: 'Active Users',
            data: data.map((entry: ActiveUser) => entry.count),
            borderColor: 'red',
            backgroundColor: 'red',
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
        color: 'orange',
        font: {
          weight: 'bold' as const,
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

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      datalabels: {
        display: true,
        color: 'orange',
        font: {
          weight: 'bold' as const,
        },
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
    <div className="flex flex-col md:flex-row">
      <main className="flex flex-col items-center justify-center flex-grow mt-10">
        {userId && (
          <div className="text-center md:text-left mx-2 md:ml-10 mb-6">
            <h1 className="text-xl md:text-4xl font-bold">
              <span className="text-primary">Welcome,</span> {userFirstName} {userLastName}!
            </h1>
            <div className="flex flex-row space-x-4 justify-center">
              <h2 className="text-primary text-sm md:text-lg">
                Date: <span className="text-secondary-foreground">{currentDate}</span>
              </h2>
              <h2 className="text-primary text-sm md:text-lg">
                Time: <span className="text-secondary-foreground">{currentTime}</span>
              </h2>
            </div>
          </div>
        )}
        <div className="w-full max-w-7xl p-4">
          <h1 className="text-center text-3xl font-bold text-primary mb-4">Dashboard</h1>
          <div className="flex flex-col md:flex-row justify-center mb-4">
            <button
              className={`mx-2 my-1 px-4 py-2 border-2 rounded-md ${
                chartType === 'bar'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => setChartType('bar')}
            >
              Bar Chart
            </button>
            <button
              className={`mx-2 my-1 px-4 py-2 border-2 rounded-md ${
                chartType === 'line'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => setChartType('line')}
            >
              Line Chart
            </button>
            <button
              className={`mx-2 my-1 px-4 py-2 border-2 rounded-md ${
                chartType === 'pie'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => setChartType('pie')}
            >
              Pie Chart
            </button>
            <button
              className={`mx-2 my-1 px-4 py-2 border-2 rounded-md ${
                chartType === 'histogram'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground'
              }`}
              onClick={() => setChartType('histogram')}
            >
              Histogram
            </button>
          </div>
          <div className="w-full p-4 border-2 rounded-md shadow-md bg-primary text-primary-foreground">
            {chartType === 'bar' && (
              <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels as any]} />
            )}
            {chartType === 'line' && (
              <Line data={activeUsersData} options={chartOptions} plugins={[ChartDataLabels as any]} />
            )}
            {chartType === 'pie' && (
              <Pie data={pieChartData} options={pieChartOptions} plugins={[ChartDataLabels as any]} />
            )}
            {chartType === 'histogram' && (
              <Bar data={histogramData} options={chartOptions} plugins={[ChartDataLabels as any]} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
