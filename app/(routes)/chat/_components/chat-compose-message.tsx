import React, { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import useUserState from "@/hooks/useUserState";
import useChatMessages from "@/hooks/useChatMessages";
import { ChatMessage } from "@/types/ChatMessage";

interface ChatComposeMessageProps {
  selectedUser: {
    userId: string;
    userFirstName: string;
    userLastName: string;
    userPhotoUrl: string | null;
  } | null;
}

const ChatComposeMessage: React.FC<ChatComposeMessageProps> = ({
  selectedUser,
}) => {
  const { userId, userFirstName, userLastName } = useUserState();
  const { addChatMessage } = useChatMessages();
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (message.trim() && selectedUser) {
      const newChatMessage: ChatMessage = {
        message,
        isRead: false,
        isView: true,
        sender: {
          userId: userId || "",
          userFirstName: userFirstName || "",
          userLastName: userLastName || "",
        },
        recipient: {
          userId: selectedUser.userId,
          userFirstName: selectedUser.userFirstName,
          userLastName: selectedUser.userLastName,
        },
      };
      await addChatMessage(newChatMessage);
      setMessage("");
    } else if (!selectedUser) {
      toast.warning("No user selected.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-background">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-grow border-primary"
      />
      <Button
        onClick={handleSend}
        className="h-20 flex items-center justify-center"
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default ChatComposeMessage;
