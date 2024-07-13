"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useNotifications from "@/hooks/useNotifications";

interface SendPushNotificationCardProps {
  id: string;
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  onClose: () => void;
}

const SendPushNotificationCard: React.FC<SendPushNotificationCardProps> = ({
  id,
  token,
  email,
  firstName,
  lastName,
  onClose,
}) => {
  const { addNotification } = useNotifications();

  const [title, setTitle] = useState("Parking Hub");
  const [message, setMessage] = useState(
    "You've exceeded your booking expiry time. Please vacate the area immediately."
  );
  const [link, setLink] = useState("/booking");

  const defaultMessages = [
    "You've exceeded your booking expiry time. Please vacate the area immediately to avoid additional charges.",
    "You have exceeded 30 minutes on your booking expiry time. \nAdditional Charge: Php 100.00",
    "You have exceeded 1 hour on your booking expiry time. \nAdditional Charge: Php 250.00",
    "You have exceeded more than 1 hour and 30 minutes on your booking expiry time. \nClamping action enforced. Please settle this to the manager.",
  ];

  const handleSendNotification = async () => {
    const createNotification = (message: string) => ({
      title: title,
      body: message,
      link: link,
      isRead: false,
      isView: true,
      timeStart: null,
      timeEnd: null,
      recipient: [
        {
          userId: id,
          userEmail: email,
          userFirstName: firstName || "",
          userLastName: lastName || "",
          userFcmSwToken: token || "",
        },
      ],
    });

    const notification = createNotification(message);
    addNotification(notification);
    sendNotification(token, title, message, link);
    onClose();
  };

  const sendNotification = async (
    token: string,
    title: string,
    message: string,
    link: string
  ) => {
    const response = await fetch("/send-push-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: token,
        title: title,
        message: message,
        link: link,
      }),
    });

    const data = await response.json();

    if (data.success === true) {
      toast.success("Successfully sent a notification.");
    } else {
      toast.error("Notification sent unsuccessfully.");
    }
  };

  const handleSelectChange = (value: string) => {
    setMessage(value);
  };

  // Consider devices with width less than or equal to 768px as mobile
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-[300px] md:w-[400px]">
        <CardHeader>
          <CardTitle>Send Notification</CardTitle>
          <CardDescription>
            Send a push notification to the selected user.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="token">FCM Token</Label>
                <Input id="token" value={token} readOnly />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} readOnly />
              </div>
              {!isMobile && (
                <>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" value={firstName} readOnly />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" value={lastName} readOnly />
                  </div>
                </>
              )}
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Notification title"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <Select onValueChange={handleSelectChange}>
                  <SelectTrigger id="message" className="mb-2">
                    <SelectValue placeholder="Select a message" />
                  </SelectTrigger>
                  <SelectContent>
                    {defaultMessages.map((msg, index) => (
                      <SelectItem key={index} value={msg}>
                        {msg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Notification message"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="link">Link</Label>
                <Input
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Notification link"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSendNotification}>Send</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SendPushNotificationCard;
