// components/notifications.tsx
import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase/config';

type NotificationsProps = {
  userId: string;
};

type Notification = {
  id: string;
  message: string;
  timestamp: string;
};

const Notifications: React.FC<NotificationsProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const q = query(
        collection(firestore, 'notifications'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const notificationsData: Notification[] = [];
      querySnapshot.forEach((doc) => {
        notificationsData.push({ id: doc.id, ...doc.data() } as Notification);
      });
      setNotifications(notificationsData);
      setLoading(false);
    };

    fetchNotifications();
  }, [userId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (notifications.length === 0) {
    return <div>No notifications</div>;
  }

  return (
    <div className="bg-primary-foreground text-white p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Notifications</h2>
      {notifications.map((notification) => (
        <div key={notification.id} className="mb-2">
          <p>{notification.message}</p>
          <span className="text-xs text-gray-400">{notification.timestamp}</span>
        </div>
      ))}
      
    </div>
  );
};

export default Notifications;
