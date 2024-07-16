import React, { useEffect, useRef } from "react";
import { Timestamp } from "firebase/firestore";
import { Trash } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import useUserState from "@/hooks/useUserState";
import useChatMessages from "@/hooks/useChatMessages";
import { ChatMessage } from "@/types/ChatMessage";

interface ChatMessageHistoryProps {
  selectedUser: {
    userId: string;
    userFirstName: string;
    userLastName: string;
    userPhotoUrl: string | null;
  } | null;
}

const ChatMessageHistory: React.FC<ChatMessageHistoryProps> = ({
  selectedUser,
}) => {
  const { userId, userFirstName, userLastName, userPhotoUrl } = useUserState();
  const { chatMessages, loading, removeFromView } = useChatMessages();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-grow space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!selectedUser) {
    return (
      <div className="text-center text-muted-foreground py-4">
        Select a user to start chatting.
      </div>
    );
  }

  const formatDate = (timestamp: Timestamp) => {
    const date = new Date(timestamp.seconds * 1000);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString(undefined, options);
  };

  const filteredMessages = chatMessages
    .filter(
      (msg: ChatMessage) =>
        (msg.sender.userId === userId &&
          msg.recipient.userId === selectedUser.userId) ||
        (msg.sender.userId === selectedUser.userId &&
          msg.recipient.userId === userId)
    )
    .sort((a, b) => {
      const dateA = (a.dateCreated as unknown as Timestamp)?.seconds ?? 0;
      const dateB = (b.dateCreated as unknown as Timestamp)?.seconds ?? 0;
      // Sort in ascending order
      // (newest at bottom: oldest at top)
      return dateA - dateB;
    });

  return (
    <div className="p-4 space-y-7">
      {filteredMessages.length === 0 ? (
        <div className="text-center text-muted-foreground py-4">
          Start a conversation
        </div>
      ) : (
        filteredMessages.map((msg) => {
          const isCurrentUser = msg.sender.userId === userId;
          return (
            <div
              key={msg.id}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isCurrentUser && (
                <Avatar className="w-10 h-10 border border-muted-foreground mr-2">
                  <AvatarImage src={selectedUser?.userPhotoUrl ?? undefined} />
                  <AvatarFallback>
                    {selectedUser?.userFirstName?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`relative ${
                    isCurrentUser
                      ? "border border-primary bg-muted text-primary"
                      : "border border-muted-foreground bg-muted text-muted-foreground"
                  } p-2 rounded-lg`}
                >
                  <div className="text-sm md:text-base font-bold">
                    {isCurrentUser
                      ? `${userFirstName ?? "Unknown"} ${
                          userLastName ?? "User"
                        }`
                      : `${selectedUser.userFirstName} ${selectedUser.userLastName}`}
                  </div>
                  <div className="text-sm md:text-base">
                    {msg.isView ? (
                      msg.message
                    ) : (
                      <i className="text-xs">Message deleted</i>
                    )}
                  </div>
                  {isCurrentUser && msg.isView && (
                    <button
                      className="absolute -top-0 -left-6"
                      onClick={() => removeFromView(msg.id || "")}
                    >
                      <Trash className="w-4 h-4 text-muted-foreground" />
                    </button>
                  )}
                  <div className="text-xs text-muted-foreground absolute -bottom-5 -left-0 text-nowrap">
                    {`Sent at: ${formatDate(
                      msg.dateCreated as unknown as Timestamp
                    )}`}
                  </div>
                </div>
              </div>
              {isCurrentUser && (
                <Avatar className="w-10 h-10 border border-primary ml-2">
                  <AvatarImage src={userPhotoUrl ?? undefined} />
                  <AvatarFallback>{userFirstName?.[0] ?? "U"}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageHistory;
