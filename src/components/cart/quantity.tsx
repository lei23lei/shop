import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuantityProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  disabled?: boolean;
  className?: string;
}

export function Quantity({
  value,
  onChange,
  max,
  min = 1,
  disabled = false,
  className,
}: QuantityProps) {
  const handleDecrease = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrease = () => {
    if (max === undefined || value < max) {
      onChange(value + 1);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex bg-neutral-200 dark:bg-neutral-800 rounded-full p-1 flex-row items-center gap-4",
        className
      )}
    >
      <div
        className={cn(
          "cursor-pointer bg-white rounded-full p-1",
          (disabled || value <= min) && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleDecrease}
      >
        <Minus className="w-4 h-4 text-zinc-700 cursor-pointer hover:text-primary" />
      </div>
      <div className="text-sm text-neutral-700 dark:text-neutral-300 min-w-[20px] text-center">
        {value}
      </div>
      <div
        className={cn(
          "cursor-pointer bg-white rounded-full p-1",
          (disabled || (max !== undefined && value >= max)) &&
            "opacity-50 cursor-not-allowed"
        )}
        onClick={handleIncrease}
      >
        <Plus className="w-4 h-4 text-zinc-700 cursor-pointer hover:text-primary" />
      </div>
    </div>
  );
}
