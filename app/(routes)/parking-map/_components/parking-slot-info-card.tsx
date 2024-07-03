import { BellRing, Check, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { DateTimePicker } from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";

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
import { ParkingSlotData } from "@/types/ParkingSlotData";

type ParkingSlotInfoCardProps = {
  slot: ParkingSlotData;
  className?: string;
  onSave: (updatedSlot: ParkingSlotData) => void;
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

export function ParkingSlotInfoCard({
  slot,
  className,
  onSave,
  onClose,
  ...props
}: ParkingSlotInfoCardProps) {
  const [slotId, setSlotId] = useState(slot.id);
  const [editTop, setEditTop] = useState(slot.top);
  const [editLeft, setEditLeft] = useState(slot.left);
  const [editColor, setEditColor] = useState(slot.color);
  const [editStatus, setEditStatus] = useState(slot.status);
  const [editName, setEditName] = useState(slot.name);
  const [startTime, setStartTime] = useState<Date | null>(slot.startTime);
  const [endTime, setEndTime] = useState<Date | null>(slot.endTime);
  const [editDescription, setEditDescription] = useState(slot.description);
  const [pushNotification, setPushNotification] = useState(
    slot.pushNotification
  );

  useEffect(() => {
    setSlotId(slot.id);
    setEditTop(slot.top);
    setEditLeft(slot.left);
    setEditColor(slot.color);
    setEditStatus(slot.status);
    setEditName(slot.name);
    setEditDescription(slot.description);
    setPushNotification(slot.pushNotification);
  }, [slot]);

  useEffect(() => {
    if (Notification.permission === "granted") {
      setPushNotification(true);
    } else {
      setPushNotification(false);
    }
  }, [pushNotification]);

  const handleSave = () => {
    onSave({
      id: slotId,
      top: editTop,
      left: editLeft,
      color: editColor,
      status: colorStatusMap[editColor],
      name: editName,
      startTime: startTime,
      endTime: endTime,
      description: editDescription,
      pushNotification: pushNotification,
    });
  };

  const handleColorChange = (newColor: string) => {
    setEditColor(newColor);
    setEditStatus(statusColorMap[colorStatusMap[newColor]]);
  };

  const handlePushNotificationChange = (checked: boolean) => {
    setPushNotification(checked);

    if (checked && Notification.permission !== "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission === "denied") {
          setPushNotification(false);
        }
      });
    }
  };

  const isMobile = window.innerWidth <= 768; // Consider devices with width <= 768px as mobile

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card
        className={cn("w-[340px] border border-primary", className)}
        {...props}
      >
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
              checked={pushNotification}
              onCheckedChange={(checked) =>
                handlePushNotificationChange(checked)
              }
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
            <p className="text-sm font-medium leading-none">Start Time</p>
            <div className="flex items-center space-x-2 ">
              <DateTimePicker
                value={startTime}
                onChange={setStartTime}
                className="text-primary"
              />
            </div>
            <p className="text-sm font-medium leading-none">End Time</p>
            <div className="flex items-center space-x-2">
              <DateTimePicker
                value={endTime}
                onChange={setEndTime}
                className="text-primary"
              />
            </div>

            {!isMobile && (
              <>
                <div className="flex items-center space-x-2">
                  <p className="text-sm font-medium leading-none">Position</p>
                </div>
                <div className="flex items-center space-x-2">
                  <p>Top:</p>
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
                  <p>Left:</p>
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
              </>
            )}
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
