import { useState } from "react";
import { useNavigate } from "react-router";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Pagination from "@/components/shared/Pagination";
import AdminPageHeader from "@/components/shared/AdminPageHeader";
import ManagerTable, {
  type TableColumn,
} from "@/components/features/ManagerTable";
import { useAlert } from "@/context/AlertContext";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";
import {
  useDeleteProductMutation,
  useGetProductsQuery,
} from "@/store/api/apiProducts";
import { useGetCategoriesQuery } from "@/store/api/apiCategories";
import type { Product } from "@/types";
import { addComma } from "@/utils/addComma";
import { buildCatNameMap } from "@/utils/category";
import { getErrorMessage } from "@/utils/getErrorMessage";

import EditIcon from "@/assets/icons/edit.inline.svg?react";
import PlusIcon from "@/assets/icons/plus.inline.svg?react";
import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";
import SearchIcon from "@/assets/icons/search.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";

const PAGE_LIMIT = 25;

const AdminProductsPage = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { open: openConfirmDialog } = useConfirmDialog();
  const { search, inputKeyword, handleSearchChange } = useDebouncedSearch();
  const { data: catData } = useGetCategoriesQuery();

  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data, isLoading, isFetching, error, refetch } = useGetProductsQuery({
    page,
    limit: PAGE_LIMIT,
    search: search || undefined,
    sortBy: sortBy || undefined,
    order: sortOrder,
  });
  const [deleteProduct] = useDeleteProductMutation();

  const totalPages = data?.pages ?? 1;

  const catNameMap = buildCatNameMap(catData?.categories ?? []);

  const handleSort = (key: string, order: "asc" | "desc") => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleDelete = (product: Product) => {
    openConfirmDialog({
      title: "刪除商品",
      message: `確定要刪除「${product.title}」嗎？`,
      confirmText: "刪除",
      cancelText: "取消",
      onConfirm: async () => {
        try {
          await deleteProduct(product._id).unwrap();
          showAlert({ variant: "success", message: `已刪除 ${product.title}` });
        } catch (err: unknown) {
          showAlert({
            variant: "error",
            message: getErrorMessage(err, "刪除失敗"),
          });
        }
      },
    });
  };

  const columns: TableColumn<Product>[] = [
    {
      key: "imageUrl",
      label: "圖片",
      render: (value) => (
        <img
          src={value as string}
          alt=""
          className="size-10 rounded bg-gray-100 object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "";
            (e.target as HTMLImageElement).classList.add("opacity-20");
          }}
        />
      ),
      className: "w-14",
    },
    {
      key: "title",
      label: "商品名稱",
      sortable: true,
      render: (value) => (
        <span className="block max-w-56 truncate font-medium">
          {value as string}
        </span>
      ),
    },
    {
      key: "categories",
      label: "分類",
      render: (value) =>
        (value as string[]).map((v) => catNameMap[v] ?? v).join("、"),
      className: "text-gray-500",
    },
    {
      key: "price",
      label: "售價",
      sortable: true,
      render: (value) => `NT$ ${addComma(value as number)}`,
      className: "whitespace-nowrap",
    },
    {
      key: "countInStock",
      label: "庫存",
      sortable: true,
      render: (value) => {
        const stock = value as number;
        return (
          <span className={stock <= 5 ? "font-medium text-red-600" : ""}>
            {stock}
          </span>
        );
      },
      className: "whitespace-nowrap",
    },
    {
      key: "salesCount",
      label: "銷量",
      sortable: true,
      render: (value) => addComma(value as number),
      className: "whitespace-nowrap",
    },
  ];

  if (error)
    return (
      <>
        <AdminPageHeader title="商品管理" />
        <div className="flex-center h-64 flex-col gap-4">
          <p className="text-gray-600">
            {getErrorMessage(error, "無法載入商品資料")}
          </p>
          <Button onClick={refetch} icon={RefreshIcon}>
            重新載入
          </Button>
        </div>
      </>
    );

  return (
    <>
      <AdminPageHeader
        title="商品管理"
        actions={
          <Button
            onClick={() => navigate("/admin/products/new")}
            icon={PlusIcon}
            className="h-9"
          >
            新增商品
          </Button>
        }
      />
      <Input
        placeholder="搜尋商品名稱"
        value={inputKeyword}
        onChange={(e) => {
          handleSearchChange(e.target.value);
          setPage(1);
        }}
        icon={SearchIcon}
        className="mb-4 max-w-sm"
      />
      <ManagerTable<Product>
        columns={columns}
        data={data?.products ?? []}
        loading={isLoading || isFetching}
        emptyMessage="尚無商品"
        sortKey={sortBy}
        sortOrder={sortOrder}
        onSort={handleSort}
        renderRowActions={(row) => (
          <div className="flex items-center gap-1">
            <Button
              variant="icon"
              icon={EditIcon}
              onClick={() => navigate(`/admin/products/${row._id}/edit`)}
              aria-label="編輯商品"
              className="rounded-full hover:bg-gray-50"
            />
            <Button
              variant="icon"
              icon={CloseIcon}
              onClick={() => handleDelete(row)}
              aria-label="刪除商品"
              className="rounded-full text-red-600 hover:bg-red-50"
            />
          </div>
        )}
      />
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            page={page}
            totalPages={totalPages}
            handlePageChange={setPage}
          />
        </div>
      )}
    </>
  );
};

export default AdminProductsPage;
