import { useState } from "react";
import { useNavigate } from "react-router";

import Button from "@/components/ui/Button";
import AdminPageSkeleton from "@/components/features/AdminPageSkeleton";
import Pagination from "@/components/shared/Pagination";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import { useDeleteNewsMutation, useGetNewsQuery } from "@/store/api/apiNews";
import type { NewsItem } from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAlert } from "@/context/AlertContext";

import CloseIcon from "@/assets/icons/xmark.inline.svg?react";
import EditIcon from "@/assets/icons/edit.inline.svg?react";
import PlusIcon from "@/assets/icons/plus.inline.svg?react";

const PAGE_LIMIT = 25;

const AdminNewsPage = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { open: openConfirmDialog } = useConfirmDialog();
  const [deleteNews] = useDeleteNewsMutation();

  const [page, setPage] = useState(1);
  const { data, isLoading } = useGetNewsQuery({ page, limit: PAGE_LIMIT });

  const handleDelete = (item: NewsItem) => {
    openConfirmDialog({
      title: "刪除公告",
      message: `確定要刪除「${item.title}」嗎？`,
      confirmText: "刪除",
      cancelText: "取消",
      onConfirm: async () => {
        try {
          await deleteNews(item._id).unwrap();
          showAlert({ variant: "success", message: "刪除成功" });
        } catch (err: unknown) {
          showAlert({
            variant: "error",
            message: getErrorMessage(err, "刪除失敗，請稍後再試。"),
          });
        }
      },
    });
  };

  if (isLoading) return <AdminPageSkeleton />;

  return (
    <div className="space-y-3">
      <div className="flex-between">
        <h1 className="text-2xl font-bold text-gray-900">消息公告</h1>
        <Button
          onClick={() => navigate("/admin/news/new")}
          icon={PlusIcon}
          className="h-9"
        >
          新增公告
        </Button>
      </div>
      {!data?.news?.length ? (
        <div className="flex-center min-h-48 text-gray-400">尚無公告</div>
      ) : (
        <>
          <div className="space-y-2">
            {data.news.map((item) => (
              <div
                key={item._id}
                className="flex-between rounded border bg-white p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">
                    {item.category} ·{" "}
                    {new Date(item.date).toLocaleDateString("zh-TW")}
                  </p>
                </div>
                <div className="ml-4 flex shrink-0 items-center gap-px">
                  <Button
                    variant="icon"
                    icon={EditIcon}
                    onClick={() => navigate(`/admin/news/${item._id}/edit`)}
                    className="rounded-full hover:bg-gray-50"
                    aria-label="編輯公告"
                  />
                  <Button
                    variant="icon"
                    icon={CloseIcon}
                    onClick={() => handleDelete(item)}
                    className="rounded-full text-red-600 hover:bg-red-50"
                    aria-label="刪除公告"
                  />
                </div>
              </div>
            ))}
          </div>
          {(data.totalPages ?? 0) > 1 && (
            <Pagination
              page={page}
              totalPages={data.totalPages ?? 1}
              handlePageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default AdminNewsPage;
