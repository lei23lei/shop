import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, ArrowUpDown, ArrowDown } from "lucide-react";

interface SortProps {
  onSortChange: (sort: string, order: "asc" | "desc") => void;
  currentSort: string;
  currentOrder: "asc" | "desc";
}

export default function Sort({
  onSortChange,
  currentSort,
  currentOrder,
}: SortProps) {
  const handleValueChange = (value: string) => {
    const [sort, order] = value.split("-");
    onSortChange(sort, order as "asc" | "desc");
  };

  const getDisplayValue = () => {
    switch (currentSort) {
      case "price":
        return currentOrder === "asc"
          ? "Price: Low to High"
          : "Price: High to Low";
      case "name":
        return currentOrder === "asc" ? "Name: A to Z" : "Name: Z to A";
      case "created_at":
        return "Newest First";
      default:
        return "Sort by";
    }
  };

  return (
    <Select
      value={`${currentSort}-${currentOrder}`}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[150px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="created_at-desc">Newest First</SelectItem>
        <SelectItem value="price-asc">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Low to High
          </div>
        </SelectItem>
        <SelectItem value="price-desc">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> High to Low
          </div>
        </SelectItem>
        <SelectItem value="name-asc">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" /> A to Z
          </div>
        </SelectItem>
        <SelectItem value="name-desc">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4" /> Z to A
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
