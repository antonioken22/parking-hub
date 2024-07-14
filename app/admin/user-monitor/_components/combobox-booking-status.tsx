import { useState } from "react";

import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const bookingStatuses = [
  { isBooked: true, label: "Booked" },
  { isBooked: false, label: "Not Booked" },
];

interface ComboboxBookingStatusProps {
  userId: string;
  isBooked: boolean;
  parkingSlotAssignment: string;
  onChange: (
    userId: string,
    isBooked: boolean,
    parkingSlotAssignment: string
  ) => void;
}

const ComboboxBookingStatus: React.FC<ComboboxBookingStatusProps> = ({
  userId,
  isBooked,
  parkingSlotAssignment,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedIsBooked, setSelectedIsBooked] = useState(isBooked);
  const [inputValue, setInputValue] = useState(
    selectedIsBooked ? parkingSlotAssignment : ""
  );

  const handleSelect = (currentIsBooked: boolean) => {
    setSelectedIsBooked(currentIsBooked);
    setInputValue(currentIsBooked ? inputValue : "");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSave = () => {
    onChange(userId, selectedIsBooked, inputValue);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedIsBooked ? "Booked" : "Not Booked"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-4 space-y-2 mr-2">
        {bookingStatuses.map((status) => (
          <div
            key={status.isBooked.toString()}
            onClick={() => handleSelect(status.isBooked)}
            className="cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center">
              <Check
                className={`mr-2 h-4 w-4 ${
                  selectedIsBooked === status.isBooked
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
              {status.label}
            </div>
            {status.isBooked && selectedIsBooked === status.isBooked && (
              <Input
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Slot Assignment"
                readOnly={!selectedIsBooked}
                className="ml-2"
              />
            )}
          </div>
        ))}
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button variant="outline" onClick={handleSave}>
            Change
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxBookingStatus;
