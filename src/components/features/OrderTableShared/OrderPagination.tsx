import Button from "@/components/ui/Button";

import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";

interface OrderPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const OrderPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: OrderPaginationProps) => {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-2 flex items-center justify-end gap-2 text-sm text-gray-600">
      <Button
        variant="icon"
        icon={ArrowLeftIcon}
        onClick={() => onPageChange(currentPage - 1)}
        iconStyle="size-4"
        aria-label="上一頁"
        disabled={currentPage <= 1}
      />
      <span>{currentPage}</span>
      <span>/</span>
      <span>{totalPages}</span>
      <Button
        variant="icon"
        icon={ArrowRightIcon}
        onClick={() => onPageChange(currentPage + 1)}
        iconStyle="size-4"
        aria-label="下一頁"
        disabled={currentPage >= totalPages}
      />
    </div>
  );
};

export default OrderPagination;
