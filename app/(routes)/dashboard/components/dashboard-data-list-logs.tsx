import { useEffect, useState, useCallback } from 'react';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { firestore } from "@/firebase/config";

type User = {
  id: string;
  firstName: string;
  email: string;
  vehicle: string;
  timeIn: Timestamp | null;
};

const DataList: React.FC<{ tab: string }> = ({ tab }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const querySnapshot = await getDocs(collection(firestore, 'users'));
    const usersData: User[] = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        firstName: data.firstName,
        email: data.email,
        vehicle: data.vehicle,
        timeIn: data.timeIn instanceof Timestamp ? data.timeIn : null
      } as User;
    });
    setUsers(usersData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, tab]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {users.map(user => (
        <div key={user.id} className="p-4 bg-primary rounded-lg shadow">
          {tab === 'logs' && <p>{user.timeIn ? user.timeIn.toDate().toLocaleString() : 'No time available'}</p>}
          {tab === 'vehicles' && <p>{user.vehicle}</p>}
        </div>
      ))}
    </div>
  );
};

export default DataList;
