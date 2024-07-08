import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth, updateProfile } from 'firebase/auth';
import { firestore, storage } from '@/firebase/config';

type UserProfileProps = {
  userId: string;
};

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  photoUrl: string | null;
};

const UserProfile: React.FC<UserProfileProps> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log('Fetching user data...');
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        if (userDoc.exists()) {
          setUser(userDoc.data() as User);
          console.log('User data fetched:', userDoc.data());
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
      console.log('File selected:', e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected for upload.');
      return;
    }

    setUploading(true);

    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        const avatarStgRef = ref(storage, `Usuarios/${currentUser.uid}/avatar.jpg`);
        console.log('Uploading file to storage...');
        await uploadBytes(avatarStgRef, selectedFile);
        console.log('File uploaded. Getting download URL...');
        const downloadURL = await getDownloadURL(avatarStgRef);
        console.log('Download URL obtained:', downloadURL);

        console.log('Updating user profile...');
        await updateProfile(currentUser, { photoURL: downloadURL });

        console.log('Updating Firestore document...');
        await updateDoc(doc(firestore, 'users', currentUser.uid), {
          photoUrl: downloadURL,
        });

        console.log('User profile and Firestore document updated successfully.');
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
    <div className="bg-primary-foreground text-white p-4 rounded-lg mb-4 max-w-md mx-auto">
      {user.photoUrl && (
        <img
          src={user.photoUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
      )}
      <h2 className="text-xl font-bold mb-2 text-center">
        {user.firstName} {user.lastName}
      </h2>
      <p className="mb-2 text-center">Email: {user.email}</p>

      <input type="file" onChange={handleFileChange} className="mb-4 block mx-auto" />
      <button onClick={handleUpload} disabled={uploading} className="btn btn-primary w-full">
        {uploading ? 'Uploading...' : 'Upload Photo'}
      </button>
    </div>
  );
};

export default UserProfile;
