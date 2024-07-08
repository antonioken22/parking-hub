"use client";

import { useState } from "react";
import Link from "next/link";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { toast } from "sonner";

import { MobileSidebar } from "./mobile-sidebar";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAuthState from "@/hooks/useAuthState";
import { Input } from "@/components/ui/input";
import { firestore, storage } from "@/firebase/config";

const Navbar = () => {
  const { userId, userFirstname, userLastname, userPhotoUrl, setUserPhotoUrl } =
    useAuthState();
  const [imageUpload, setImageUpload] = useState<File | null>(null);

  // String initial parser (for string | null datatypes)
  const getInitials = (...names: (string | null)[]): string => {
    const initials = names.map((name) => (name ? name.trim()[0] : "")).join("");
    return initials;
  };

  const updateProfilePicture = () => {
    if (imageUpload == null) {
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
      uploadBytes(imageRef, imageUpload).then((snapshot) =>
        getDownloadURL(snapshot.ref).then(async (url) => {
          // Update the Firestore with the new photoUrl of the user
          if (userId) {
            const userDocRef = doc(firestore, "users", userId);
            await updateDoc(userDocRef, { photoUrl: url });
            setUserPhotoUrl(url); // Update the local state
          }
          setImageUpload(null); // Reset the image upload state
        })
      ),
      {
        loading: "Uploading your profile picture...",
        success: "Profile photo updated.",
        error: "Failed to upload profile picture.",
      }
    );
  };

  return (
    <div className="flex items-center p-4">
      <MobileSidebar />
      <div className="flex w-full justify-end space-x-2 md:space-x-4">
        <Link href="/booking">
          <Button className="text-xs md:text-base">Book a Parking Slot</Button>
        </Link>
        <Popover>
          <PopoverTrigger asChild>
            <Avatar role="button" className="border border-primary">
              <AvatarImage
                src={userPhotoUrl ? userPhotoUrl : ""}
                alt="Parking Hub"
              />
              <AvatarFallback>
                {getInitials(userFirstname, userLastname)}
              </AvatarFallback>
            </Avatar>
          </PopoverTrigger>
          <PopoverContent className="w-60 md:w-80 m-2">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">
                  Update profile picture
                </h4>
                <p className="text-sm text-muted-foreground">
                  Upload your new photo from your device.
                </p>
              </div>
              <div className="grid gap-2">
                <div className="flex flex-col items-center gap-4">
                  <Input
                    type="file"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setImageUpload(e.target.files[0]);
                      } else {
                        setImageUpload(null);
                      }
                    }}
                  />
                </div>
                <div className="flex flex-col justify-center w-full ">
                  <Button onClick={updateProfilePicture}>Update</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
