import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";

import { firestore, storage } from "@/firebase/config";
import { Spinner } from "@/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuthState from "@/hooks/useAuthState";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const UserProfileUpdatePhoto = () => {
  const {
    userId,
    loading,
    userFirstname,
    userLastname,
    userEmail,
    userPhotoUrl,
    setUserPhotoUrl,
  } = useAuthState();
  const [selectedImageUpload, setSelectedImageUpload] = useState<File | null>(
    null
  );

  // String initial parser (for string | null datatypes)
  const getInitials = (...names: (string | null)[]): string => {
    const initials = names.map((name) => (name ? name.trim()[0] : "")).join("");
    return initials;
  };

  const updateProfilePicture = () => {
    if (selectedImageUpload == null) {
      toast.error("No image chosen. Please select an image to upload.");
      return;
    }

    // Timestamp parser for unique file naming
    const timestamp = new Date()
      .toLocaleString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", " @")
      .replace(/\//g, "-");

    const imageRef = ref(
      storage,
      `profile-pictures/${userFirstname} ${userLastname} ${timestamp}`
    );

    toast.promise(
      uploadBytes(imageRef, selectedImageUpload).then((snapshot) =>
        getDownloadURL(snapshot.ref).then(async (url) => {
          // Update the Firestore with the new photoUrl of the user
          if (userId) {
            const userDocRef = doc(firestore, "users", userId);
            await updateDoc(userDocRef, { photoUrl: url });
            setUserPhotoUrl(url); // Update the local state
          }
          setSelectedImageUpload(null); // Reset the image upload state
        })
      ),
      {
        loading: "Uploading your profile picture...",
        success: "Profile photo updated.",
        error: "Failed to upload profile picture.",
      }
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center relative inset-y-0 h-full w-full z-50">
        <Spinner size="lg" text="background" />
      </div>
    );
  }

  return (
    <div className="bg-muted border border-primary p-4 rounded-sm mb-4 max-w-sm mx-auto">
      {userPhotoUrl && (
        <div className="flex flex-col items-center">
          <Avatar className="border border-primary w-24 h-24 rounded-sm">
            <AvatarImage
              alt="Parking Hub"
              src={userPhotoUrl ? userPhotoUrl : ""}
            />
            <AvatarFallback>
              {getInitials(userFirstname, userLastname)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <h2 className="text-md md:text-xl font-bold text-center break-words mt-2">
        {userFirstname} {userLastname}
      </h2>
      <p className="text-muted-foreground text-xs md:text-base mb-2 text-center break-words ">
        {userEmail}
      </p>
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setSelectedImageUpload(e.target.files[0]);
          } else {
            setSelectedImageUpload(null);
          }
        }}
      />
      <div className="flex flex-col justify-center w-full my-1">
        <Button onClick={updateProfilePicture}>Update</Button>
      </div>
    </div>
  );
};

export default UserProfileUpdatePhoto;
