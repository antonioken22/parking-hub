import { BellRing, Check, X } from "lucide-react";
import React, { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type ParkingSlotInfoProps = {
  id: string;
  top: number;
  left: number;
  color: string;
  status: string;
  name: string | null;
  countdown: Date | null;
  description: string | null;
  pushNotification: boolean;
  className?: string;
  onSave: (updatedSlot: any) => void;
  onClose: () => void;
};

const colorStatusMap: Record<string, string> = {
  red: "Unavailable",
  gray: "Occupied",
  green: "Unoccupied",
  yellow: "Reserved",
};

const statusColorMap: Record<string, string> = {
  Unavailable: "red",
  Occupied: "gray",
  Unoccupied: "green",
  Reserved: "yellow",
};

export function ParkingSlotInfo({
  id,
  top,
  left,
  color,
  status,
  name,
  countdown,
  description,
  pushNotification,
  className,
  onSave,
  onClose,
  ...props
}: ParkingSlotInfoProps) {
  const [slotId, setSlotId] = useState(id);
  const [editTop, setEditTop] = useState(top);
  const [editLeft, setEditLeft] = useState(left);
  const [editColor, setEditColor] = useState(color);
  const [editStatus, setEditStatus] = useState(status);
  const [editName, setEditName] = useState(name);
  const [editCountdown, setEditCountdown] = useState<Date | null>(countdown);
  const [editDescription, setEditDescription] = useState(description);
  const [editPushNotification, setEditPushNotification] =
    useState(pushNotification);

  useEffect(() => {
    setSlotId(id);
    setEditTop(top);
    setEditLeft(left);
    setEditColor(color);
    setEditStatus(status);
    setEditName(name);
    setEditCountdown(countdown);
    setEditDescription(description);
    setEditPushNotification(pushNotification);
  }, [
    id,
    top,
    left,
    color,
    status,
    name,
    countdown,
    description,
    pushNotification,
  ]);

  const handleSave = () => {
    onSave({
      id: slotId,
      top: editTop,
      left: editLeft,
      color: editColor,
      status: colorStatusMap[editColor],
      name: editName,
      countdown: editCountdown,
      description: editDescription,
      pushNotification: editPushNotification,
    });
  };

  const handleColorChange = (newColor: string) => {
    setEditColor(newColor);
    setEditStatus(statusColorMap[colorStatusMap[newColor]]);
  };

  const handleHourChange = (value: number) => {
    const newCountdown = editCountdown ? new Date(editCountdown) : new Date();
    newCountdown.setHours(value);
    setEditCountdown(newCountdown);
  };

  const handleMinuteChange = (value: number) => {
    const newCountdown = editCountdown ? new Date(editCountdown) : new Date();
    newCountdown.setMinutes(value);
    setEditCountdown(newCountdown);
  };

  const handleSecondChange = (value: number) => {
    const newCountdown = editCountdown ? new Date(editCountdown) : new Date();
    newCountdown.setSeconds(value);
    setEditCountdown(newCountdown);
  };

  const handlePushNotificationChange = (value: boolean) => {
    setEditPushNotification(value);

    if (value) {
      // Request notification permission when the component mounts
      if (Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
  };

  if (Notification.permission === "granted") {
    // Show a test notification when enabling push notifications
    new Notification("Parking Slot Notification", {
      body: "Push notifications enabled for this slot.",
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className={cn("w-[340px]", className)} {...props}>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Edit Parking Slot</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
          <CardDescription>
            Edit the details of the parking slot.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Input
            placeholder="Name"
            value={editName || ""}
            onChange={(e) => setEditName(e.target.value)}
          />
          <Textarea
            placeholder="Description"
            value={editDescription || ""}
            onChange={(e) => setEditDescription(e.target.value)}
          />
          <div className="flex items-center space-x-4 rounded-md border p-4">
            <BellRing />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                Push Notifications
              </p>
              <p className="text-sm text-muted-foreground">
                Send notifications to device.
              </p>
            </div>
            <Switch
              checked={editPushNotification}
              onCheckedChange={(value) => handlePushNotificationChange(value)}
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: editColor }}
              />
              <p className="text-sm font-medium leading-none">Status</p>
              <select
                value={statusColorMap[editStatus]}
                onChange={(e) => handleColorChange(e.target.value)}
                className="ml-2 p-1 border rounded"
              >
                <option value="red">Unavailable</option>
                <option value="gray">Occupied</option>
                <option value="green">Unoccupied</option>
                <option value="yellow">Reserved</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium leading-none">Countdown</p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="0"
                min={0}
                max={99}
                onChange={(e) => handleHourChange(parseInt(e.target.value))}
                className="w-16"
              />
              <span>h</span>
              <Input
                type="number"
                placeholder="0"
                min={0}
                max={59}
                onChange={(e) => handleMinuteChange(parseInt(e.target.value))}
                className="w-16"
              />
              <span>min</span>
              <Input
                type="number"
                placeholder="0"
                min={0}
                max={59}
                onChange={(e) => handleSecondChange(parseInt(e.target.value))}
                className="w-16"
              />
              <span>sec</span>
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium leading-none">Position</p>
            </div>
            <div className="flex items-center space-x-2">
              <Input
                type="number"
                placeholder="Top (%)"
                value={editTop}
                min={0}
                max={100}
                onChange={(e) => setEditTop(parseInt(e.target.value))}
                className="w-16"
              />
              <span>%</span>
              <Input
                type="number"
                placeholder="Left (%)"
                value={editLeft}
                min={0}
                max={100}
                onChange={(e) => setEditLeft(parseInt(e.target.value))}
                className="w-16"
              />
              <span>%</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Check className="mr-2 h-4 w-4" /> Save
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
