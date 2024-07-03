import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from "@/firebase/config";

type User = {
  id: string;
  firstName: string;
  email: string;
};

const DataList: React.FC<{ tab: string }> = ({ tab }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const querySnapshot = await getDocs(collection(firestore, 'users'));
      const usersData: User[] = [];
      querySnapshot.forEach((doc) => {
        usersData.push({ id: doc.id, ...doc.data() } as User);
      });
      setUsers(usersData);
      setLoading(false);
    };

    fetchUsers();
  }, [tab]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col space-y-4">
      {users.map(user => (
         <div className="flex flex-col space-y-4">
         {users.map(user => (
<<<<<<< HEAD
           <div key={user.id} className="p-4 bg-background rounded-lg shadow">
=======
           <div key={user.id} className="p-4 bg-main rounded-lg shadow">
>>>>>>> 40747e5c2cadceabc7427188d1b760da293799bb
             {tab === 'logs' && <p>{user.email}</p>}
             {tab === 'vehicles' && <p>{user.firstName}</p>}
           </div>
         ))}
       </div>
      ))}
    </div>
  );
};

export default DataList;