import { cn } from "@/utils/cn";

const Row = ({
  cols = 4,
  className,
}: {
  cols?: number;
  className?: string;
}) => (
  <div className={cn("flex gap-4 px-6 py-4", className)}>
    {Array.from({ length: cols }).map((_, i) => (
      <div
        key={i}
        className={cn(
          "h-4 skeleton",
          i === 0 ? "w-1/4" : i === cols - 1 ? "w-1/6" : "flex-1"
        )}
      ></div>
    ))}
  </div>
);

const AdminPageSkeleton = ({ tableRows = 5 }: { tableRows?: number }) => (
  <div className="space-y-6 p-6">
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-2">
        <div className="h-6 w-32 skeleton"></div>
        <div className="h-4 w-56 skeleton"></div>
      </div>
      <div className="h-9 w-24 skeleton rounded-lg"></div>
    </div>
    <div className="flex gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-8 w-16 skeleton rounded-md"></div>
      ))}
    </div>
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 bg-gray-50">
        <Row cols={5} className="py-3" />
      </div>
      {Array.from({ length: tableRows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "border-b border-gray-100",
            i === tableRows - 1 && "border-b-0"
          )}
        >
          <Row cols={5} />
        </div>
      ))}
    </div>
  </div>
);

export default AdminPageSkeleton;
