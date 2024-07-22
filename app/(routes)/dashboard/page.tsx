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
import { formatDate, formatTime } from '@/utils/formatters';
import { ChartType, ChartData, ActiveUser } from '@/types';

const DashboardPage: React.FC = () => {
  const { userId, userFirstName, userLastName, loading } = useUserState();
  const { GLE, NGE, RTL, SAL } = useParkingSlotCount();
  const { activeUsers } = useActiveUsers();

  const [chartType, setChartType] = useState<ChartType>('bar');
  const [chartData, setChartData] = useState<ChartData>({});
  const [activeUsersData, setActiveUsersData] = useState<ChartData>({});
  const [pieChartData, setPieChartData] = useState<ChartData>({});
  const currentDate = formatDate(new Date());
  const [currentTime, setCurrentTime] = useState(formatTime(new Date()));

  // Update the currentTime every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(formatTime(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch and set parking slot data
  useEffect(() => {
    const fetchParkingSlots = async () => {
      try {
        const data = [
          { name: 'GLE Open Area', availableSlots: GLE.available, occupiedSlots: GLE.occupied, reservedSlots: GLE.reserved, unavailableSlots: GLE.unavailable },
          { name: 'NGE Open Area', availableSlots: NGE.available, occupiedSlots: NGE.occupied, reservedSlots: NGE.reserved, unavailableSlots: NGE.unavailable },
          { name: 'RTL Open Court', availableSlots: RTL.available, occupiedSlots: RTL.occupied, reservedSlots: RTL.reserved, unavailableSlots: RTL.unavailable },
          { name: 'SAL Open Court', availableSlots: SAL.available, occupiedSlots: SAL.occupied, reservedSlots: SAL.reserved, unavailableSlots: SAL.unavailable },
        ];

        setChartData({
          labels: data.map((lot) => lot.name),
          datasets: [
            { label: 'Available', data: data.map((lot) => lot.availableSlots), backgroundColor: 'green' },
            { label: 'Occupied', data: data.map((lot) => lot.occupiedSlots), backgroundColor: 'gray' },
            { label: 'Reserved', data: data.map((lot) => lot.reservedSlots), backgroundColor: 'yellow' },
            { label: 'Unavailable', data: data.map((lot) => lot.unavailableSlots), backgroundColor: 'red' },
          ],
        });

        const totalData = [
          { label: 'Available', value: data.reduce((sum, lot) => sum + lot.availableSlots, 0) },
          { label: 'Occupied', value: data.reduce((sum, lot) => sum + lot.occupiedSlots, 0) },
          { label: 'Reserved', value: data.reduce((sum, lot) => sum + lot.reservedSlots, 0) },
          { label: 'Unavailable', value: data.reduce((sum, lot) => sum + lot.unavailableSlots, 0) },
        ];

        setPieChartData({
          labels: totalData.map((entry) => entry.label),
          datasets: [
            {
              label: 'Slot Distribution',
              data: totalData.map((entry) => entry.value),
              backgroundColor: ['rgba(0, 255, 0, 0.2)', 'rgba(128, 128, 128, 0.2)', 'rgba(255, 255, 0, 0.2)', 'rgba(255, 0, 0, 0.2)'],
              borderColor: ['rgba(0, 255, 0, 1)', 'rgba(128, 128, 128, 1)', 'rgba(255, 255, 0, 1)', 'rgba(255, 0, 0, 1)'],
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching parking slots:', error);
      }
    };

    fetchParkingSlots();
  }, [GLE, NGE, RTL, SAL]);

  // Fetch and set active users data
  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const data = activeUsers.map((entry: ActiveUser) => ({
          time: entry.time,
          count: entry.count,
        }));

        setActiveUsersData({
          labels: data.map((entry: ActiveUser) => entry.time),
          datasets: [
            { label: 'Active Users', data: data.map((entry: ActiveUser) => entry.count), borderColor: 'red', backgroundColor: 'red', fill: false },
          ],
        });
      } catch (error) {
        console.error('Error fetching active users:', error);
      }
    };

    fetchActiveUsers();
  }, [activeUsers]);

  const chartOptions = {
    plugins: {
      datalabels: {
        display: true,
        color: 'orange',
        font: { weight: 'bold' as const },
      },
    },
    responsive: true,
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true },
    },
  };

  const pieChartOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      datalabels: {
        display: true,
        color: 'orange',
        font: { weight: 'bold' as const },
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
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Parking Slot Status <span className="text-primary">(Overview)</span>
          </h2>
          <div className="mb-4">
            <select
              aria-label="Select Chart Type"
              value={chartType}
              onChange={(e) => setChartType(e.target.value as ChartType)}
              className="border border-gray-300 p-2 rounded"
            >
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </div>
          {chartType === 'bar' && <Bar data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />}
          {chartType === 'line' && <Line data={chartData} options={chartOptions} plugins={[ChartDataLabels]} />}
          {chartType === 'pie' && <Pie data={pieChartData} options={pieChartOptions} plugins={[ChartDataLabels]} />}
        </div>
        <div className="w-full max-w-7xl p-4 mt-8">
          <h2 className="text-xl md:text-2xl font-bold mb-4">
            Active Users <span className="text-primary">(Today)</span>
          </h2>
          <Line data={activeUsersData} options={chartOptions} plugins={[ChartDataLabels]} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
