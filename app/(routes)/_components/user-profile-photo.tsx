"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useAuthState from "@/hooks/useUserState";
import { Input } from "@/components/ui/input";
import useProfilePhotoUpdate from "@/hooks/useProfilePhotoUpdate";

const UserProfilePhoto = () => {
  const { userFirstName, userLastName, userPhotoUrl, setUserPhotoUrl } =
    useAuthState();
  const { setSelectedImageUpload, updateProfilePicture, newPhotoUrl } =
    useProfilePhotoUpdate();

  useEffect(() => {
    if (newPhotoUrl) {
      setUserPhotoUrl(newPhotoUrl);
    }
  }, [newPhotoUrl, setUserPhotoUrl]);

  // String initial parser (for string | null datatypes)
  const getInitials = (...names: (string | null)[]): string => {
    const initials = names.map((name) => (name ? name.trim()[0] : "")).join("");
    return initials;
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Avatar role="button" className="border border-primary">
          <AvatarImage
            src={userPhotoUrl ? userPhotoUrl : ""}
            alt="Parking Hub"
          />
          <AvatarFallback>
            {getInitials(userFirstName, userLastName)}
          </AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent className="w-60 md:w-80 m-2">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Update profile picture</h4>
            <p className="text-sm text-muted-foreground">
              Upload your new photo from your device.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground text-wrap">
                Note: Use Square (Aspect Ratio: 1:1) images in order for it not
                to get distorted when displayed.
              </p>
              <Input
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedImageUpload(e.target.files[0]);
                  } else {
                    setSelectedImageUpload(null);
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
  );
};

export default UserProfilePhoto;
