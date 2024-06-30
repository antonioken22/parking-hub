import {
  Car,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import React, { useState, useEffect } from "react";

interface ParkingSlotComponentProps {
  slot: {
    id: string;
    top: number;
    left: number;
    color: string;
  };
  index: number;
  onPositionChange: (index: number, top: number, left: number) => void;
  onColorChange: (index: number, color: string) => void;
  role: string | null;
  selected: boolean;
  onSelect: () => void;
}

const ParkingSlotComponent: React.FC<ParkingSlotComponentProps> = ({
  slot,
  index,
  onPositionChange,
  onColorChange,
  role,
  selected,
  onSelect,
}) => {
  const [top, setTop] = useState(slot.top);
  const [left, setLeft] = useState(slot.left);
  const [zIndex, setZIndex] = useState(10); // Initial z-index

  // Effect to reset zIndex when deselected
  useEffect(() => {
    if (!selected) {
      setZIndex(10); // Reset zIndex to 10 when not selected
    }
  }, [selected]);

  const handleTopChange = (newTop: number) => {
    newTop = Math.max(1, Math.min(100, newTop));
    setTop(newTop);
    onPositionChange(index, newTop, left);
  };

  const handleLeftChange = (newLeft: number) => {
    newLeft = Math.max(1, Math.min(100, newLeft));
    setLeft(newLeft);
    onPositionChange(index, top, newLeft);
  };

  const handleColorChange = () => {
    const colors = ["gray", "green", "red", "yellow"];
    const currentIndex = colors.indexOf(slot.color);
    const nextIndex = (currentIndex + 1) % colors.length;
    const nextColor = colors[nextIndex];
    onColorChange(index, nextColor);
  };

  const handleClick = () => {
    setZIndex(20); // Set zIndex to 20 when selected
    onSelect();
  };

  return (
    <div
      className={`absolute z-${zIndex} w-12 h-6 md:w-20 md:h-10 bg-primary flex justify-center items-center ${
        selected ? "border border-secondary" : ""
      }`}
      style={{ top: `${top}%`, left: `${left}%` }}
      onClick={handleClick}
    >
      <Car
        className="w-6 h-6 md:w-8 md:h-8 absolute z-20"
        style={{ color: slot.color }}
      />
      {role === "admin" && selected && (
        <>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <ChevronUp
              className="w-10 h-10 text-secondary cursor-pointer"
              onClick={() => handleTopChange(top - 1)}
            />
          </div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <ChevronDown
              className="w-10 h-10 text-secondary cursor-pointer"
              onClick={() => handleTopChange(top + 1)}
            />
          </div>
          <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
            <ChevronLeft
              className="w-10 h-10 text-secondary cursor-pointer"
              onClick={() => handleLeftChange(left - 1)}
            />
          </div>
          <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
            <ChevronRight
              className="w-10 h-10 text-secondary cursor-pointer"
              onClick={() => handleLeftChange(left + 1)}
            />
          </div>
          <RefreshCw
            className="w-3 h-3 md:w-4 md:h-4 text-gray-600 absolute z-30 top-1 right-1 cursor-pointer"
            onClick={handleColorChange}
          />
        </>
      )}
    </div>
  );
};

export default ParkingSlotComponent;
