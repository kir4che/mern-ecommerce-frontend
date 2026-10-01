import { useCallback, useState, useTransition } from "react";

import { useGetOrdersQuery } from "@/store/api/apiOrders";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import type { GetOrdersParams } from "@/types";

export const useOrders = (isAdmin: boolean) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filterType, setFilterType] = useState<number>(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("desc");
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const {
    search: searchKeyword,
    inputKeyword,
    handleSearchChange: onSearch,
  } = useDebouncedSearch(500);

  const [isPending, startTransition] = useTransition();
  const dateRangeError =
    isAdmin && startDate && endDate && startDate > endDate
      ? "開始日期不能晚於結束日期"
      : null;

  const queryArgs: GetOrdersParams = {
    page: currentPage,
    limit: 20,
    status: String(filterType),
    keyword: searchKeyword || undefined,
    startDate: isAdmin && !dateRangeError ? startDate || undefined : undefined,
    endDate: isAdmin && !dateRangeError ? endDate || undefined : undefined,
    sortBy,
    orderBy,
    isAdmin,
  };

  const {
    data: ordersData,
    isLoading,
    error,
    refetch: refreshOrders,
  } = useGetOrdersQuery(queryArgs, { skip: Boolean(dateRangeError) });

  const orders = ordersData?.orders ?? [];
  const totalPages = ordersData?.totalPages ?? 1;

  const handleSearchChange = useCallback(
    (value: string) => {
      setCurrentPage(1);
      onSearch(value);
    },
    [onSearch]
  );

  const handleFilterChange = useCallback((type: number) => {
    setFilterType(type);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages)
        startTransition(() => {
          setCurrentPage(newPage);
        });
    },
    [totalPages]
  );

  const handleSort = useCallback(
    (key: string) => {
      startTransition(() => {
        setCurrentPage(1);
        setOrderBy((prev) =>
          sortBy === key && prev === "asc" ? "desc" : "asc"
        );
        setSortBy(key);
      });
    },
    [sortBy]
  );

  const handleToggleExpandOrder = useCallback((orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  }, []);

  const handleStartDateChange = useCallback((value: string) => {
    setStartDate(value);
    setCurrentPage(1);
  }, []);

  const handleEndDateChange = useCallback((value: string) => {
    setEndDate(value);
    setCurrentPage(1);
  }, []);

  return {
    orders,
    isLoading,
    isPending,
    error,
    totalPages,
    currentPage,
    filterType,
    sortBy,
    orderBy,
    inputKeyword,
    startDate,
    endDate,
    dateRangeError,
    expandedOrderId,
    handleFilterChange,
    handlePageChange,
    handleSort,
    handleSearchChange,
    handleStartDateChange,
    handleEndDateChange,
    handleToggleExpandOrder,
    refreshOrders,
  };
};
