import { Calendar, Check, X } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { DateTimePicker } from "react-datetime-picker";
import { toast } from "sonner";
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ParkingSlotData } from "@/types/ParkingSlotData";
import useUsersParkingSlotInfoCard from "@/hooks/useUsersParkingSlotInfoCard";
import useNotifications from "@/hooks/useNotifications";
import { useRemoteUserIsBooked } from "@/hooks/useRemoteUserIsBooked";

type ParkingSlotInfoCardProps = {
  slot: ParkingSlotData;
  role: string | null;
  className?: string;
  onSave: (updatedSlot: ParkingSlotData) => void;
  onClose: () => void;
};

const colorStatusMap: Record<string, string> = {
  green: "Available",
  gray: "Occupied",
  yellow: "Reserved",
  red: "Unavailable",
};

const statusColorMap: Record<string, string> = {
  Available: "green",
  Occupied: "gray",
  Reserved: "yellow",
  Unavailable: "red",
};

export function ParkingSlotInfoCard({
  slot,
  role,
  className,
  onSave,
  onClose,
  ...props
}: ParkingSlotInfoCardProps) {
  const { users } = useUsersParkingSlotInfoCard();
  const { addNotification } = useNotifications();
  const { updateRemoteUserIsBooked } = useRemoteUserIsBooked();
  const [slotId, setSlotId] = useState(slot.id);
  const [editParkingArea, setEditParkingArea] = useState(slot.parkingArea);
  const [editParkingSlotNumber, setEditParkingSlotNumber] = useState(
    slot.parkingSlotNumber
  );
  const [editTop, setEditTop] = useState(slot.top);
  const [editLeft, setEditLeft] = useState(slot.left);
  const [editWidth, setEditWidth] = useState(slot.width);
  const [editHeight, setEditHeight] = useState(slot.height);
  const [editRotation, setEditRotation] = useState(slot.rotation);
  const [editColor, setEditColor] = useState(slot.color);
  const [editStatus, setEditStatus] = useState(slot.status);
  const [occupantEmail, setOccupantEmail] = useState(slot.occupantEmail || "");
  const [occupantFirstName, setOccupantFirstName] = useState(
    slot.occupantFirstName
  );
  const [occupantLastName, setOccupantLastName] = useState(
    slot.occupantLastName
  );
  const [editDescription, setEditDescription] = useState(slot.description);
  const [startTime, setStartTime] = useState<Date | null>(slot.startTime);
  const [endTime, setEndTime] = useState<Date | null>(slot.endTime);

  useEffect(() => {
    setSlotId(slot.id);
    setEditParkingArea(slot.parkingArea);
    setEditParkingSlotNumber(slot.parkingSlotNumber);
    setEditTop(slot.top);
    setEditLeft(slot.left);
    setEditWidth(slot.width);
    setEditHeight(slot.height);
    setEditRotation(slot.rotation);
    setEditColor(slot.color);
    setEditStatus(slot.status);
    setOccupantEmail(slot.occupantEmail || "");
    setEditDescription(slot.description);
  }, [slot]);

  // TODO: Refactor this component.
  const handleSaveAndNotify = () => {
    const occupant = users.find((user) => user.email === occupantEmail);

    if (!occupant) {
      toast.error("Occupant not found.");
      return;
    }

    onSave({
      id: slotId,
      parkingArea: editParkingArea,
      parkingSlotNumber: editParkingSlotNumber,
      top: editTop,
      left: editLeft,
      width: editWidth,
      height: editHeight,
      rotation: editRotation,
      color: editColor,
      status: colorStatusMap[editColor],
      occupantEmail: occupantEmail,
      occupantFirstName: occupantFirstName,
      occupantLastName: occupantLastName,
      startTime: startTime,
      endTime: endTime,
      description: editDescription,
    });

    const formatTime = (date: Date) => date.toLocaleString();

    if (startTime && endTime) {
      const now = new Date();
      const startNotificationTime = startTime.getTime() - now.getTime();
      const endNotificationTime = endTime.getTime() - now.getTime();
      const oneMinuteBeforeEndNotificationTime = endNotificationTime - 60000;

      const startFormatted = formatTime(startTime);
      const endFormatted = formatTime(endTime);

      const startMessage = `You've successfully booked a parking slot.\nStart Time: ${startFormatted}\nEnd Time: ${endFormatted}\nAt: ${slot.parkingArea} #${slot.parkingSlotNumber}`;
      const beforeEndMessage = `Your booked parking slot will expire soon.\nStart Time: ${startFormatted}\nEnd Time: ${endFormatted}\nAt: ${slot.parkingArea} #${slot.parkingSlotNumber}`;
      const endMessage = `Your booked parking slot has expired.\nStart Time: ${startFormatted}\nEnd Time: ${endFormatted}\nAt: ${slot.parkingArea} #${slot.parkingSlotNumber}`;

      const createNotification = (message: string) => ({
        title: "Parking Slot Booking",
        body: message,
        link: "/booking",
        timeStart: startTime,
        timeEnd: endTime,
        isRead: false,
        isView: true,
        recipient: [
          {
            userId: occupant.id,
            userEmail: occupantEmail,
            userFirstName: occupantFirstName || "",
            userLastName: occupantLastName || "",
            userFcmSwToken: occupant.fcmSwToken || "",
          },
        ],
      });

      if (startNotificationTime > 0) {
        setTimeout(async () => {
          const notification = createNotification(startMessage);
          addNotification(notification);
          sendNotification(
            occupant.fcmSwToken || "",
            "Parking Hub",
            startMessage,
            "/booking"
          );
          await updateRemoteUserIsBooked(occupant.id, true);
        }, startNotificationTime);
      }

      if (oneMinuteBeforeEndNotificationTime > 0) {
        setTimeout(() => {
          const notification = createNotification(beforeEndMessage);
          addNotification(notification);
          sendNotification(
            occupant.fcmSwToken || "",
            "Parking Hub",
            beforeEndMessage,
            "/booking"
          );
        }, oneMinuteBeforeEndNotificationTime);
      }

      if (endNotificationTime > 0) {
        setTimeout(async () => {
          const notification = createNotification(endMessage);
          addNotification(notification);
          sendNotification(
            occupant.fcmSwToken || "",
            "Parking Hub",
            endMessage,
            "/booking"
          );
          await updateRemoteUserIsBooked(occupant.id, false);
        }, endNotificationTime);
      }
      toast.info("Notification timers set.");
    }
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

  // Local operations
  const handleColorChange = (newColor: string) => {
    setEditColor(newColor);
    setEditStatus(statusColorMap[colorStatusMap[newColor]]);
  };

  const handleEmailSelect = (email: string) => {
    const selectedUser = users.find((user) => user.email === email);
    if (selectedUser) {
      setOccupantEmail(selectedUser.email);
      setOccupantFirstName(selectedUser.firstName);
      setOccupantLastName(selectedUser.lastName);
    }
  };

  useEffect(() => {
    if (occupantEmail === "") {
      setOccupantFirstName(null);
      setOccupantLastName(null);
    }
  }, [occupantEmail]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.email.toLowerCase().includes(occupantEmail.toLowerCase())
    );
  }, [occupantEmail, users]);

  // Consider devices with width less than or equal to 768px as mobile
  const isMobile = window.innerWidth <= 768;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card
        className={cn(
          "w-[340px] md:w-[600px] border border-primary",
          className
        )}
        {...props}
      >
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Edit Parking Slot</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="w-8 h-8 md:w-10 md:h-10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <CardDescription className="hidden md:block text-sm">
            {editParkingArea} #{editParkingSlotNumber}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-1 md:gap-4">
          <div>
            <Command className="rounded-lg border shadow-md">
              <CommandInput
                placeholder="Search and select an email..."
                value={occupantEmail || ""}
                onValueChange={setOccupantEmail}
              />
              <CommandList className="h-[80px] md:h-[100px]">
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Users">
                  {filteredUsers.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => handleEmailSelect(user.email)}
                    >
                      {user.email}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
          <Input
            placeholder="Occupant's First Name"
            value={occupantFirstName || ""}
            onChange={(e) => setOccupantFirstName(e.target.value)}
            readOnly
          />
          <Input
            placeholder="Occupant's Last Name"
            value={occupantLastName || ""}
            onChange={(e) => setOccupantLastName(e.target.value)}
            readOnly
          />
          <Textarea
            placeholder="Description"
            value={editDescription || ""}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span
                className="inline-block h-3 w-3 rounded-full"
                style={{ backgroundColor: editColor }}
              />
              <p className="text-xs md:text-sm font-medium leading-none ">
                Status
              </p>
              <select
                value={statusColorMap[editStatus]}
                onChange={(e) => handleColorChange(e.target.value)}
                className="ml-2 p-1 border rounded text-xs md:text-sm"
              >
                <option value="green">Available</option>
                <option value="gray">Occupied</option>
                <option value="yellow">Reserved</option>
                <option value="red">Unavailable</option>
              </select>
            </div>
            <p className="text-xs md:text-sm font-medium leading-none ">
              Start Time
            </p>
            <div className="flex items-center space-x-2 ">
              <DateTimePicker
                value={startTime}
                onChange={setStartTime}
                className="text-muted-foreground w-full"
                calendarIcon={
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                }
                clearIcon={<X className="w-6 h-6 text-muted-foreground" />}
                disableClock
              />
            </div>
            <p className="text-xs md:text-sm font-medium leading-none">
              End Time
            </p>
            <div className="flex items-center space-x-2">
              <DateTimePicker
                value={endTime}
                onChange={setEndTime}
                className="text-muted-foreground w-full"
                calendarIcon={
                  <Calendar className="w-6 h-6 text-muted-foreground" />
                }
                clearIcon={<X className="w-6 h-6 text-muted-foreground" />}
                disableClock
              />
            </div>
            {!isMobile && (
              <div className="flex flex-col col-span-5">
                <div className="flex flex-row space-x-4">
                  <div className="flex-1 space-y-2">
                    <p className="text-xs ">Parking Area:</p>
                    <Input
                      placeholder="Parking Area"
                      value={editParkingArea}
                      onChange={(e) => setEditParkingArea(e.target.value)}
                      className="w-full h-10 text-xs md:text-sm"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs ">Parking Slot Number:</p>
                    <Input
                      type="number"
                      placeholder="Parking Slot Number"
                      value={editParkingSlotNumber}
                      onChange={(e) =>
                        setEditParkingSlotNumber(parseInt(e.target.value))
                      }
                      className="w-full h-10 text-xs md:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}
            {role === "admin" && !isMobile && (
              <>
                <hr />
                <div className="grid grid-cols-5 gap-4 w-full">
                  <div className="col-span-5">
                    <p className="text-sm font-medium leading-none">
                      Properties:
                    </p>
                  </div>
                  {/* <div className="flex flex-col col-span-5">
                    <div className="flex flex-row space-x-4">
                      <div className="flex-1 space-y-2">
                        <p className="text-xs ">Parking Area:</p>
                        <Input
                          placeholder="Parking Area"
                          value={editParkingArea}
                          onChange={(e) => setEditParkingArea(e.target.value)}
                          className="w-full h-10 text-xs md:text-sm"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="text-xs ">Parking Slot Number:</p>
                        <Input
                          type="number"
                          placeholder="Parking Slot Number"
                          value={editParkingSlotNumber}
                          onChange={(e) =>
                            setEditParkingSlotNumber(parseInt(e.target.value))
                          }
                          className="w-full h-10 text-xs md:text-sm"
                        />
                      </div>
                    </div>
                  </div> */}
                  <div className="flex flex-col space-y-2">
                    <p className="text-xs">Top (%):</p>
                    <Input
                      type="number"
                      placeholder="Top (%)"
                      value={editTop}
                      min={0}
                      max={100}
                      onChange={(e) => setEditTop(parseFloat(e.target.value))}
                      className="w-full h-10 text-xs"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-xs">Left (%):</p>
                    <Input
                      type="number"
                      placeholder="Left (%)"
                      value={editLeft}
                      min={0}
                      max={100}
                      onChange={(e) => setEditLeft(parseFloat(e.target.value))}
                      className="w-full h-10 text-xs"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-xs">Width (%):</p>
                    <Input
                      type="number"
                      placeholder="Width (%)"
                      value={editWidth}
                      min={0}
                      max={100}
                      onChange={(e) => setEditWidth(parseFloat(e.target.value))}
                      className="w-full h-10 text-xs"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-xs">Height (%):</p>
                    <Input
                      type="number"
                      placeholder="Height (%)"
                      value={editHeight}
                      min={0}
                      max={100}
                      onChange={(e) =>
                        setEditHeight(parseFloat(e.target.value))
                      }
                      className="w-full h-10 text-xs"
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <p className="text-xs">Rotation (°):</p>
                    <Input
                      type="number"
                      placeholder="Rotation (°)"
                      value={editRotation}
                      min={-180}
                      max={180}
                      onChange={(e) =>
                        setEditRotation(parseFloat(e.target.value))
                      }
                      className="w-full h-10 text-xs"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs md:text-sm"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveAndNotify} className="text-xs md:text-sm">
            <Check className="mr-2 h-4 w-4" /> Notify
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
