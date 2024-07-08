"use client";

import * as React from "react";
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
import { toast } from "sonner";

interface SendPushNotificationCardProps {
  token: string;
  email: string;
  firstName: string;
  lastName: string;
  onClose: () => void;
}

const SendPushNotificationCard: React.FC<SendPushNotificationCardProps> = ({
  token,
  email,
  firstName,
  lastName,
  onClose,
}) => {
  const [title, setTitle] = React.useState("Parking Hub");
  const [message, setMessage] = React.useState(
    "You've successfully booked a parking slot."
  );
  const [link, setLink] = React.useState("/dashboard");

  const defaultMessages = [
    "You've successfully booked a parking slot.",
    "You only have 10 minutes until your booked parking slot will expire.",
    "Your booked parking slot has expired. Please vacate the area immediately to avoid incurring additional fees.",
  ];

  const handleSendNotification = async () => {
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
    console.log(data);

    if (data.success === true) {
      toast.success("Successfully sent a notification.");
    } else {
      toast.error("Notification sent unsuccessfully.");
    }

    onClose();
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
