import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';
import { firestore, storage } from '@/firebase/config';


type UserProfileProps = {
  userId: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl?: string | null;
};

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
  
    setUploading(true);
  
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const avatarStgRef = ref(storage, `Usuarios/${currentUser.uid}/avatar.jpg`);
        await uploadBytes(avatarStgRef, selectedFile);
        const downloadURL = await getDownloadURL(avatarStgRef);
  
        // Update user profile in Firebase Authentication
  
        // Update user document in Firestore
        await updateDoc(doc(firestore, 'users', currentUser.uid), {
          photoUrl: downloadURL,
        });
  
        // Update state with new photo URL
        setUser((prev) => (prev ? { ...prev, photoUrl: downloadURL } : null));
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="bg-primary-foreground text-white p-4 rounded-lg mb-4">
      {user.photoUrl && (
        <img
          src={user.photoUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      )}
      <h2 className="text-xl font-bold mb-2">
        {user.firstName} {user.lastName}
      </h2>
      <p className="mb-2">Email: {user.email}</p>

      <div>
        
      </div>
    </div>
  );
};

export default UserProfile;
