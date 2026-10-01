import Loading from "@/components/ui/Loading";
import { cn } from "@/utils/cn";

import ArrowDownIcon from "@/assets/icons/nav-arrow-down.inline.svg?react";
import ArrowUpIcon from "@/assets/icons/nav-arrow-up.inline.svg?react";

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
  className?: string;
}

interface ManagerTableProps<T extends { _id: string }> {
  columns: TableColumn<T>[];
  data: T[];
  onSort?: (key: string, order: "asc" | "desc") => void;
  sortKey?: string;
  sortOrder?: "asc" | "desc";
  renderRowActions?: (row: T) => React.ReactNode; // 操作欄位
  loading?: boolean;
  emptyMessage?: string;
}

const ManagerTable = <T extends { _id: string }>({
  columns,
  data,
  onSort,
  sortKey,
  sortOrder,
  renderRowActions,
  loading = false,
  emptyMessage = "暫無資料",
}: ManagerTableProps<T>) => {
  const handleSort = (key: string) => {
    if (!onSort) return;
    onSort(key, sortKey === key && sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading) return <Loading />;
  if (data.length === 0)
    return (
      <div className="flex-center py-20 text-gray-500">{emptyMessage}</div>
    );

  return (
    <div className="overflow-x-auto border border-gray-200 bg-white">
      <table className="table table-sm">
        <thead>
          <tr className="bg-gray-100">
            {columns.map(({ key, label, sortable, className }) => {
              const isSorted = sortable && sortKey === String(key);
              const SortIcon =
                sortOrder === "asc" ? ArrowUpIcon : ArrowDownIcon;

              return (
                <th
                  key={String(key)}
                  className={cn(sortable && "th-sort", className)}
                  onClick={() => sortable && handleSort(String(key))}
                >
                  <div className="flex items-center gap-2">
                    <span>{label}</span>
                    {sortable && (
                      <SortIcon
                        className={cn(
                          "th-sort-icon",
                          !isSorted && "th-sort-icon-inactive"
                        )}
                      />
                    )}
                  </div>
                </th>
              );
            })}
            {renderRowActions && <th className="w-20" />}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row._id}>
              {columns.map(({ key, render, className }) => (
                <td key={String(key)} className={cn("max-w-xs", className)}>
                  {render ? render(row[key], row) : String(row[key] ?? "-")}
                </td>
              ))}
              {renderRowActions && <td>{renderRowActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagerTable;
