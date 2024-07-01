import {
  Car,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  SquarePen,
} from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import { ParkingSlotInfo } from "./parking-slot-info";

interface ParkingSlotProps {
  slot: {
    id: string;
    top: number;
    left: number;
    color: string;
    status: string;
    name: string | null;
    countdown: Date | null;
    description: string | null;
    pushNotification: boolean;
  };
  index: number;
  onPositionChange: (index: number, top: number, left: number) => void;
  onColorChange: (index: number, color: string) => void;
  onEdit: (index: number, updatedSlot: any) => void;
  role: string | null;
  selected: boolean;
  onSelect: () => void;
}

const ParkingSlot: React.FC<ParkingSlotProps> = ({
  slot,
  index,
  onPositionChange,
  onColorChange,
  onEdit,
  role,
  selected,
  onSelect,
}) => {
  const [top, setTop] = useState(slot.top);
  const [left, setLeft] = useState(slot.left);
  const [zIndex, setZIndex] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [keyboardListenerActive, setKeyboardListenerActive] = useState(true);

  const handleTopChange = useCallback(
    (newTop: number) => {
      newTop = Math.max(1, Math.min(100, newTop));
      setTop(newTop);
      onPositionChange(index, newTop, left);
    },
    [index, left, onPositionChange]
  );

  const handleLeftChange = useCallback(
    (newLeft: number) => {
      newLeft = Math.max(1, Math.min(100, newLeft));
      setLeft(newLeft);
      onPositionChange(index, top, newLeft);
    },
    [index, top, onPositionChange]
  );

  useEffect(() => {
    if (!selected) {
      setZIndex(10); // Reset zIndex to 10 when not selected
    } else {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (keyboardListenerActive) {
          switch (event.key) {
            case "ArrowUp":
            case "w":
              handleTopChange(top - 1);
              break;
            case "ArrowDown":
            case "s":
              handleTopChange(top + 1);
              break;
            case "ArrowLeft":
            case "a":
              handleLeftChange(left - 1);
              break;
            case "ArrowRight":
            case "d":
              handleLeftChange(left + 1);
              break;
            default:
              break;
          }
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [
    top,
    left,
    selected,
    handleLeftChange,
    handleTopChange,
    keyboardListenerActive,
  ]);

  // Disable keyboard listener when editing
  useEffect(() => {
    if (isEditing) {
      setKeyboardListenerActive(false);
    } else {
      setKeyboardListenerActive(true);
    }
  }, [isEditing]);

  const handleClick = () => {
    setZIndex(20); // Set zIndex to 20 when selected
    onSelect();
  };

  const handleColorChange = () => {
    const colors = ["gray", "green", "red", "yellow"];
    const currentIndex = colors.indexOf(slot.color);
    const nextIndex = (currentIndex + 1) % colors.length;
    const nextColor = colors[nextIndex];
    onColorChange(index, nextColor);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = useCallback(
    (updatedSlot: any) => {
      onEdit(index, updatedSlot);
      setIsEditing(false);
    },
    [index, onEdit]
  );

  const handleClose = () => {
    setIsEditing(false);
  };

  return (
    <>
      <div
        className={`absolute z-${zIndex} w-12 h-6 md:w-20 md:h-8 flex justify-center items-center ${
          selected ? "border-2 border-primary" : "border border-primary"
        }`}
        style={{
          top: `${top}%`,
          left: `${left}%`,
        }}
        onClick={handleClick}
      >
        <div
          className="absolute inset-0 bg-current opacity-20"
          style={{ backgroundColor: slot.color }}
        ></div>
        <div className="absolute inset-0 flex justify-center items-center">
          <Car
            className="w-6 h-6 md:w-8 md:h-8 absolute z-20"
            style={{ color: slot.color }}
          />
        </div>
        {role === "admin" && selected && (
          <>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <ChevronUp
                className="w-8 h-8 md:w-10 md:h-10 text-primary cursor-pointer"
                onClick={() => handleTopChange(top - 1)}
              />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <ChevronDown
                className="w-8 h-8 md:w-10 md:h-10 text-primary cursor-pointer"
                onClick={() => handleTopChange(top + 1)}
              />
            </div>
            <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
              <ChevronLeft
                className="w-8 h-8 md:w-10 md:h-10 text-primary cursor-pointer"
                onClick={() => handleLeftChange(left - 1)}
              />
            </div>
            <div className="absolute top-1/2 -right-6 md:-right-8 transform -translate-y-1/2">
              <RefreshCw
                className="w-5 h-5 md:w-7 md:h-7 p-1 bg-secondary text-primary cursor-pointer border border-primary"
                onClick={handleColorChange}
              />
            </div>
            <div className="absolute top-1/2 -right-11 md:-right-16 transform -translate-y-1/2">
              <SquarePen
                className="w-5 h-5 md:w-7 md:h-7 p-1 bg-secondary text-primary cursor-pointer border border-primary"
                onClick={handleEdit}
              />
            </div>
            <div className="absolute top-1/2 -right-[70px] md:-right-24 transform -translate-y-1/2">
              <ChevronRight
                className="w-8 h-8 md:w-10 md:h-10 text-primary cursor-pointer"
                onClick={() => handleLeftChange(left + 1)}
              />
            </div>
          </>
        )}
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <ParkingSlotInfo
              id={slot.id}
              top={slot.top}
              left={slot.left}
              color={slot.color}
              status={slot.status}
              name={slot.name}
              countdown={slot.countdown}
              description={slot.description}
              pushNotification={slot.pushNotification}
              onSave={handleSave}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ParkingSlot;
