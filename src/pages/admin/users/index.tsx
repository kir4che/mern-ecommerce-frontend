import { useState } from "react";
import Button from "@/components/ui/Button";
import ManagerTable, {
  type TableColumn,
} from "@/components/features/ManagerTable";
import Pagination from "@/components/shared/Pagination";
import AdminPageHeader from "@/components/shared/AdminPageHeader";
import { useGetUsersQuery } from "@/store/api/apiAdmin";
import type { AdminUser } from "@/types";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";
import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";

const PAGE_LIMIT = 25;

const AdminUsersPage = () => {
  const [page, setPage] = useState(1);

  const { data, isLoading, error, refetch } = useGetUsersQuery({
    page,
    limit: PAGE_LIMIT,
  });
  const users = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;

  const columns: TableColumn<AdminUser>[] = [
    {
      key: "email",
      label: "Email",
      render: (value) => <span className="font-medium">{value as string}</span>,
    },
    { key: "name", label: "姓名", render: (value) => (value as string) || "-" },
    {
      key: "role",
      label: "角色",
      render: (value) => (
        <span className={value === "admin" ? "font-medium text-primary" : ""}>
          {value === "admin" ? "管理員" : "會員"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "註冊日期",
      render: (value) => formatDate(value as string),
    },
  ];

  if (error)
    return (
      <>
        <AdminPageHeader title="會員管理" />
        <div className="flex-center h-64 flex-col gap-4">
          <p className="text-gray-600">
            {getErrorMessage(error, "無法載入會員資料")}
          </p>
          <Button onClick={refetch} icon={RefreshIcon}>
            重新載入
          </Button>
        </div>
      </>
    );

  return (
    <>
      <AdminPageHeader title="會員管理" />
      <ManagerTable<AdminUser>
        columns={columns}
        data={users}
        loading={isLoading}
        emptyMessage="尚無會員資料"
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

export default AdminUsersPage;
