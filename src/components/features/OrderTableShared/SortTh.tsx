import { cn } from "@/utils/cn";

import ArrowDownIcon from "@/assets/icons/nav-arrow-down.inline.svg?react";
import ArrowUpIcon from "@/assets/icons/nav-arrow-up.inline.svg?react";

interface SortThProps {
  field: string;
  label: string;
  sortBy: string;
  orderBy: string;
  onSort: (key: string) => void;
  align?: "left" | "right";
}

const SortTh = ({
  field,
  label,
  sortBy,
  orderBy,
  onSort,
  align = "left",
}: SortThProps) => {
  const isActive = sortBy === field;
  const Icon = isActive
    ? orderBy === "asc"
      ? ArrowUpIcon
      : ArrowDownIcon
    : ArrowDownIcon;

  return (
    <th
      className="th-sort select-none"
      aria-sort={
        isActive ? (orderBy === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          "flex w-full items-center gap-1 text-left",
          align === "right" && "justify-end text-right"
        )}
        aria-label={`依${label}${isActive && orderBy === "asc" ? "降冪" : "升冪"}排序`}
      >
        {label}
        <Icon
          className={cn("th-sort-icon", !isActive && "th-sort-icon-inactive")}
        />
      </button>
    </th>
  );
};

export default SortTh;
