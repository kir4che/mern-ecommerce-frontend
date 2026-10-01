import { useParams } from "react-router";
import AdminPageSkeleton from "@/components/features/AdminPageSkeleton";
import NewsForm from "@/components/forms/NewsForm";
import { useGetNewsByIdQuery } from "@/store/api/apiNews";
import { getErrorMessage } from "@/utils/getErrorMessage";
import Button from "@/components/ui/Button";
import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";

const AdminEditNewsPage = () => {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useGetNewsByIdQuery(id!, {
    skip: !id,
  });

  if (isLoading) return <AdminPageSkeleton tableRows={3} />;

  if (error || !data?.newsItem)
    return (
      <div className="flex-center h-64 flex-col gap-4">
        <p className="text-gray-600">
          {getErrorMessage(error, "無法載入公告資料")}
        </p>
        <Button onClick={refetch} icon={RefreshIcon}>
          重新載入
        </Button>
      </div>
    );

  return <NewsForm news={data.newsItem} />;
};

export default AdminEditNewsPage;
