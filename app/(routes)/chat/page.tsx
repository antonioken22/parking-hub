"use client";

import { MessageSquare } from "lucide-react";

import { Spinner } from "@/components/spinner";
import { Heading } from "@/app/(routes)/_components/heading";
import useUserState from "@/hooks/useUserState";
import ChatUI from "./_components/chat-ui";

const ChatPage = () => {
  const { userId, loading } = useUserState();

  if (loading) {
    return (
      <div className="flex items-center justify-center absolute inset-y-0 h-full w-full bg-background/80 z-50 md:pr-56">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {!loading && userId && (
        <div>
          <div className="flex items-center gap-x-3 mr-auto pl-4">
            <MessageSquare className="w-10 h-10 text-primary" />
            <div>
              <Heading
                title="Chat"
                description="Chat with the managers and everyone."
              />
            </div>
          </div>
          <div className="px-4 lg:px-8 pt-4">
            <ChatUI />
          </div>
        </div>
      )}
    </>
  );
};

export default ChatPage;
