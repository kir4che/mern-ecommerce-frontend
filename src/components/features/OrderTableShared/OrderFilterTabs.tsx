import { cn } from "@/utils/cn";

interface OrderFilterOption {
  id: string;
  value: number;
  label: string;
}

interface OrderFilterTabsProps {
  options: readonly OrderFilterOption[];
  activeFilter: number;
  onChange: (value: number) => void;
}

const OrderFilterTabs = ({
  options,
  activeFilter,
  onChange,
}: OrderFilterTabsProps) => (
  <div
    role="tablist"
    aria-label="訂單狀態篩選"
    className="tabs-bordered hide-scrollbar mb-4 tabs w-full overflow-x-auto"
  >
    {options.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={activeFilter === tab.value}
        onClick={() => onChange(tab.value)}
        className={cn(
          "tab h-9 font-medium text-nowrap transition-colors select-none",
          activeFilter === tab.value
            ? "tab-active border-b-2 border-primary text-primary"
            : "hover:bg-gray-200"
        )}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default OrderFilterTabs;
