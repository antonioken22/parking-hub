import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { firestore, storage } from "@/firebase/config";
import useUserState from "@/hooks/useUserState";

const useProfilePhotoUpdate = () => {
  const { userId, userFirstName, userLastName, setUserPhotoUrl } =
    useUserState();
  const [selectedImageUpload, setSelectedImageUpload] = useState<File | null>(
    null
  );
  const [newPhotoUrl, setNewPhotoUrl] = useState<string | null>(null);

  const updateProfilePicture = () => {
    if (selectedImageUpload == null) {
      toast.error("No image chosen. Please select an image to upload.");
      return;
    }

    // Prevent invalid image format
    const fileExtension = selectedImageUpload.name
      .split(".")
      .pop()
      ?.toLowerCase();
    if (!["jpg", "jpeg", "png"].includes(fileExtension || "")) {
      toast.error(
        "Invalid image format. Please select a .jpg, .jpeg, or .png image."
      );
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
      `profile-pictures/${userFirstName} ${userLastName} ${timestamp}`
    );

    toast.promise(
      uploadBytes(imageRef, selectedImageUpload).then((snapshot) =>
        getDownloadURL(snapshot.ref).then(async (url) => {
          // Update the Firestore with the new photoUrl of the user
          if (userId) {
            const userDocRef = doc(firestore, "users", userId);
            await updateDoc(userDocRef, { photoUrl: url });
            setNewPhotoUrl(url); // Update the local state
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

  return {
    selectedImageUpload,
    setSelectedImageUpload,
    updateProfilePicture,
    newPhotoUrl,
  };
};

export default useProfilePhotoUpdate;
