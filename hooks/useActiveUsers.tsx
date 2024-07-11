// File: hooks/useActiveUsers.ts

import { useState, useEffect } from "react";

interface ActiveUser {
  time: string;
  count: number;
}

// Simulating fetching data from an API
const fetchActiveUsersData = async (): Promise<ActiveUser[]> => {
  return [
    { time: "1 AM", count: 50 },
    { time: "2 AM", count: 7 },
    { time: "3 AM", count: 100 },
    { time: "4 AM", count: 50 },
    { time: "5 AM", count: 755 },
    { time: "6 AM", count: 1500 },
    { time: "7 AM", count: 504 },
    { time: "8 AM", count: 754 },
    { time: "9 AM", count: 1400 },
    { time: "10 AM", count: 540 },
    { time: "11 AM", count: 755},
    { time: "12 AM", count: 1060 },
    { time: "1 PM", count: 50 },
    { time: "2 PM", count: 755 },
    { time: "3 PM", count: 100 },
    { time: "4 PM", count: 5 },
    { time: "5 PM", count: 7 },
    { time: "6 PM", count: 1 },
    { time: "7 PM", count: 0 },
    { time: "8 PM", count: 0 },
    { time: "9 PM", count: 1 },
    { time: "10 PM", count: 9 },
    { time: "11 PM", count: 5 },
    { time: "12 PM", count: 10 },
    // Add more data points as needed
  ];
};

const useActiveUsers = () => {
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchActiveUsersData();
      setActiveUsers(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { activeUsers, loading };
};

export default useActiveUsers;
