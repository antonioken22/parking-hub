import React, { useState, useCallback } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useChatManagers from "@/hooks/useChatManagers";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
  role: string;
}

interface ChatUsersProps {
  onSelectUser: (user: {
    userId: string;
    userFirstName: string;
    userLastName: string;
    userPhotoUrl: string | null;
  }) => void;
}

const ChatUsers: React.FC<ChatUsersProps> = ({ onSelectUser }) => {
  const { users, loading } = useChatManagers();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  // Extracts initials from names
  const getInitials = (...names: (string | null)[]): string => {
    const initials = names.map((name) => (name ? name.trim()[0] : "")).join("");
    return initials;
  };

  const handleSelectUser = useCallback(
    (user: User) => {
      setSelectedUserId(user.id);
      onSelectUser({
        userId: user.id,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        userPhotoUrl: user.photoUrl,
      });
    },
    [onSelectUser]
  );

  if (loading) {
    return (
      <div className="flex overflow-x-auto space-x-4 p-1">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex flex-col items-center space-y-2 p-1">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="w-16 h-4 rounded-sm" />
            <Skeleton className="w-12 h-3 rounded-sm" />
          </div>
        ))}
      </div>
    );
  }

  // Separate managers and users
  const managers = users.filter((user) => user.role === "manager");
  const normalUsers = users.filter((user) => user.role === "user");

  return (
    <div>
      <div className="flex overflow-x-auto space-x-4 p-1">
        {[...managers, ...normalUsers].map((user) => (
          <div
            key={user.id}
            className={`flex flex-col items-center space-y-1 md:space-y-2 cursor-pointer p-1 ${
              selectedUserId === user.id ? "bg-muted rounded-sm" : ""
            }`}
            onClick={() => handleSelectUser(user)}
          >
            <div className="relative">
              <Avatar role="button" className="border border-muted-foreground">
                <AvatarImage
                  src={user.photoUrl ? user.photoUrl : ""}
                  alt={`${user.firstName} ${user.lastName}`}
                />
                <AvatarFallback>
                  {getInitials(user.firstName, user.lastName)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            </div>
            <h3 className="text-center text-xs text-nowrap">
              {user.firstName} {user.lastName}
            </h3>
            {user.role === "manager" && (
              <div className="text-center text-xs md:text-sm text-muted-foreground">
                Manager
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatUsers;
