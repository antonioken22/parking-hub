import { useEffect } from "react";

import { Spinner } from "@/components/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthState from "@/hooks/useUserState";
import useProfilePhotoUpdate from "@/hooks/useProfilePhotoUpdate";

const UserProfileUpdatePhoto = () => {
  const {
    userFirstName,
    userLastName,
    userEmail,
    userPhotoUrl,
    setUserPhotoUrl,
    loading: userLoading,
  } = useAuthState();
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

  if (userLoading) {
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
              {getInitials(userFirstName, userLastName)}
            </AvatarFallback>
          </Avatar>
        </div>
      )}
      <h2 className="text-md md:text-xl font-bold text-center break-words mt-2">
        {userFirstName} {userLastName}
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
