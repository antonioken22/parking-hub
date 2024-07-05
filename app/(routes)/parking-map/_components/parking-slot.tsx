import React, { useState, useEffect, useCallback } from "react";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  SquarePen,
  Info,
  RotateCcwSquare,
  RotateCwSquare,
  ChevronsRightLeft,
  ChevronsLeftRight,
  ChevronsUpDown,
  ChevronsDownUp,
} from "lucide-react";

import { ParkingSlotInfoCard } from "./parking-slot-info-card";
import { ParkingSlotData } from "@/types/ParkingSlotData";
import { ParkingSlotInfoDrawer } from "./parking-slot-info-drawer";

interface ParkingSlotProps {
  slot: ParkingSlotData;
  index: number;
  stepSize: number;
  onPositionChange: (index: number, top: number, left: number) => void;
  onSizeChange: (index: number, width: number, height: number) => void;
  onRotationChange: (index: number, rotation: number) => void;
  onEdit: (index: number, updatedSlot: ParkingSlotData) => void;
  role: string | null;
  selected: boolean;
  onSelect: () => void;
}

const ParkingSlot: React.FC<ParkingSlotProps> = ({
  slot,
  index,
  stepSize,
  onPositionChange,
  onSizeChange,
  onRotationChange,
  onEdit,
  role,
  selected,
  onSelect,
}) => {
  const [top, setTop] = useState(slot.top);
  const [left, setLeft] = useState(slot.left);
  const [width, setWidth] = useState(slot.width);
  const [height, setHeight] = useState(slot.height);
  const [rotation, setRotation] = useState(slot.rotation);
  const [zIndex, setZIndex] = useState(10);
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
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

  const handleWidthChange = useCallback(
    (newWidth: number) => {
      newWidth = Math.max(1, Math.min(100, newWidth));
      setWidth(newWidth);
      onSizeChange(index, newWidth, height);
    },
    [index, height, onSizeChange]
  );

  const handleHeightChange = useCallback(
    (newHeight: number) => {
      newHeight = Math.max(1, Math.min(100, newHeight));
      setHeight(newHeight);
      onSizeChange(index, width, newHeight);
    },
    [index, width, onSizeChange]
  );

  const handleRotationChange = useCallback(
    (newRotation: number) => {
      newRotation = Math.max(-90, Math.min(90, newRotation));
      setRotation(newRotation);
      onRotationChange(index, newRotation);
    },
    [index, onRotationChange]
  );

  // Handle keyboard lister
  useEffect(() => {
    if (!selected) {
      setZIndex(10); // Reset zIndex to 10 when not selected
    } else {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (keyboardListenerActive) {
          switch (event.key) {
            case "ArrowUp":
            case "w":
              handleTopChange(top - stepSize);
              break;
            case "ArrowDown":
            case "s":
              handleTopChange(top + stepSize);
              break;
            case "ArrowLeft":
            case "a":
              handleLeftChange(left - stepSize);
              break;
            case "ArrowRight":
            case "d":
              handleLeftChange(left + stepSize);
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
    stepSize,
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

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = useCallback(
    (updatedSlot: ParkingSlotData) => {
      onEdit(index, updatedSlot);
      setIsEditing(false);
    },
    [index, onEdit]
  );

  const handleClose = () => {
    setIsEditing(false);
  };

  const handleInfoView = () => {
    setIsViewing(true);
  };

  const handleInfoClose = () => {
    setIsViewing(false);
  };

  return (
    <>
      <div
        className={`absolute z-${zIndex} flex justify-center items-center ${
          selected ? "border-2 border-primary" : "border border-primary"
        }`}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${width}%`,
          height: `${height}%`,
          transform: `rotate(${rotation}deg)`,
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
        {selected && (
          <div className="absolute top-1/2 -right-6 md:-right-8 transform -translate-y-1/2">
            <Info
              className="w-5 h-5 md:w-7 md:h-7 p-1 bg-secondary text-primary cursor-pointer border border-primary"
              onClick={handleInfoView}
            />
          </div>
        )}

        {role === "admin" && selected && (
          <>
            <div className="absolute -top-8 -left-3 md:-left-2 transform -translate-x-1/2">
              <RotateCcwSquare
                className="w-4 h-4 md:w-6 md:h-6 text-primary cursor-pointer"
                onClick={() => handleRotationChange(rotation - stepSize)}
              />
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
              <ChevronUp
                className="w-8 h-8 md:w-10 md:h-10 text-primary cursor-pointer"
                onClick={() => handleTopChange(top - stepSize)}
              />
            </div>
            <div className="absolute -top-8 -right-7 md:-right-8 transform -translate-x-1/2">
              <RotateCwSquare
                className="w-4 h-4 md:w-6 md:h-6 text-primary cursor-pointer"
                onClick={() => handleRotationChange(rotation + stepSize)}
              />
            </div>
            <div className="absolute -bottom-8 -left-3 md:-left-2 transform -translate-x-1/2">
              <ChevronsLeftRight
                className="w-4 h-4 md:w-6 md:h-6 text-primary cursor-pointer"
                onClick={() => handleWidthChange(width + stepSize)}
              />
            </div>
            <div className="absolute -bottom-8 -left-8 transform -translate-x-1/2">
              <ChevronsRightLeft
                className="w-4 h-4 md:w-6 md:h-6 text-primary cursor-pointer"
                onClick={() => handleWidthChange(width - stepSize)}
              />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
              <ChevronDown
                className="w-8 h-8 md:w-10 md:h-10 text-primary cursor-pointer"
                onClick={() => handleTopChange(top + stepSize)}
              />
            </div>
            <div className="absolute -bottom-8 -right-7 md:-right-8 transform -translate-x-1/2">
              <ChevronsUpDown
                className="w-4 h-4 md:w-6 md:h-6 text-primary cursor-pointer"
                onClick={() => handleHeightChange(height + stepSize)}
              />
            </div>
            <div className="absolute -bottom-8 -right-12 transform -translate-x-1/2">
              <ChevronsDownUp
                className="w-4 h-4 md:w-6 md:h-6 text-primary cursor-pointer"
                onClick={() => handleHeightChange(height - stepSize)}
              />
            </div>
            <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
              <ChevronLeft
                className="w-8 h-8 md:w-10 md:h-10 text-primary cursor-pointer"
                onClick={() => handleLeftChange(left - stepSize)}
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
                onClick={() => handleLeftChange(left + stepSize)}
              />
            </div>
          </>
        )}
      </div>
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <ParkingSlotInfoCard
              slot={slot}
              onSave={handleSave}
              onClose={handleClose}
            />
          </div>
        </div>
      )}
      <ParkingSlotInfoDrawer
        slot={slot}
        isOpen={isViewing}
        onClose={handleInfoClose}
      />
    </>
  );
};

export default ParkingSlot;
