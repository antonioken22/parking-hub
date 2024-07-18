import React, { useState } from "react";
import ChatUsers from "./chat-users";
import ChatMessageHistory from "./chat-message-history";
import ChatComposeMessage from "./chat-compose-message";

const ChatUI = () => {
  const [selectedUser, setSelectedUser] = useState<{
    userId: string;
    userFirstName: string;
    userLastName: string;
    userPhotoUrl: string | null;
  } | null>(null);

  return (
    <div className="flex flex-col">
      <ChatUsers onSelectUser={setSelectedUser} />
      <hr />
      <div className="h-[59vh] md:h-[60vh] overflow-y-auto">
        <ChatMessageHistory selectedUser={selectedUser} />
      </div>
      <div className="fixed left-2 md:left-56 md:ml-2 bottom-0 right-2">
        <hr />
        <ChatComposeMessage selectedUser={selectedUser} />
      </div>
    </div>
  );
};

export default ChatUI;
