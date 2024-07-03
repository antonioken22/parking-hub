import { useState, ReactNode } from "react";

interface DropdownProps {
  title: string;
  children: ReactNode;
  expanded: boolean;
  onToggle: () => void;
}

const Dropdown = ({ title, children, expanded, onToggle }: DropdownProps) => {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="py-2 bg-transparent text-muted-foreground rounded-md focus:outline-none relative z-10"
      >
        {title}
      </button>
      {expanded && (
        <div className="absolute w-full bg-background z-20">
          <div className="p-4">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
