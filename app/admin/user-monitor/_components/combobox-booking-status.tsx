import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const bookingStatuses = [
  { value: true, label: "Booked" },
  { value: false, label: "Not Booked" },
];

interface ComboboxBookingStatusProps {
  userId: string;
  value: boolean;
  onChange: (userId: string, value: boolean) => void;
}

const ComboboxBookingStatus: React.FC<ComboboxBookingStatusProps> = ({
  userId,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleSelect = (currentValue: boolean) => {
    setSelectedValue(currentValue);
    setOpen(false);
    onChange(userId, currentValue);
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
          {selectedValue ? "Booked" : "Not Booked"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        {bookingStatuses.map((status) => (
          <div
            key={status.value.toString()}
            onClick={() => handleSelect(status.value)}
            className="cursor-pointer p-2 flex items-center"
          >
            <Check
              className={`mr-2 h-4 w-4 ${
                selectedValue === status.value ? "opacity-100" : "opacity-0"
              }`}
            />
            {status.label}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxBookingStatus;
