import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";

import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";

interface PaginationProps {
  page: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const Pagination = ({
  page,
  totalPages,
  handlePageChange,
}: PaginationProps) => {
  // 計算要顯示的頁碼，包含省略號。
  const pageNumbers: (number | string)[] = [];
  const siblingCount = 1; // 顯示當前頁前後的頁碼數量

  pageNumbers.push(1);

  const start = Math.max(2, page - siblingCount);
  const end = Math.min(totalPages - 1, page + siblingCount);

  if (start > 2) pageNumbers.push("...");

  for (let i = start; i <= end; i++) pageNumbers.push(i);

  if (end < totalPages - 1) pageNumbers.push("...");
  if (totalPages > 1) pageNumbers.push(totalPages);

  if (totalPages <= 1) return null;

  return (
    <nav aria-label="分頁導航" className="flex-center gap-2 pt-8 pb-2">
      <Button
        variant="icon"
        icon={ArrowLeftIcon}
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className={cn(
          "size-8 rounded-full",
          page === 1 ? "cursor-not-allowed opacity-25" : "hover:bg-primary/5"
        )}
        aria-label="返回上一頁"
      />
      <ul className="flex items-center gap-1 md:gap-2">
        {pageNumbers.map((pageNum, index) => {
          if (typeof pageNum === "string")
            return (
              <li key={`ellipsis-${index}`} className="px-1">
                <span className="text-gray-500 select-none">...</span>
              </li>
            );
          const isActive = page === pageNum;

          return (
            <li key={pageNum}>
              <Button
                variant={isActive ? "primary" : "icon"}
                onClick={() => handlePageChange(pageNum)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`前往第 ${pageNum} 頁`}
                className={cn(
                  "size-8 rounded-full text-sm font-medium transition-all",
                  isActive ? "shadow" : "hover:bg-primary/5 hover:text-primary"
                )}
              >
                {pageNum}
              </Button>
            </li>
          );
        })}
      </ul>
      <Button
        variant="icon"
        icon={ArrowRightIcon}
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className={cn(
          "size-8 rounded-full",
          page === totalPages
            ? "cursor-not-allowed opacity-25"
            : "hover:bg-primary/5"
        )}
        aria-label="前往下一頁"
      />
    </nav>
  );
};

export default Pagination;
