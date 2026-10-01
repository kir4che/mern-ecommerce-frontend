import { useParams } from "react-router";
import AdminPageSkeleton from "@/components/features/AdminPageSkeleton";
import ProductForm from "@/components/forms/ProductForm";
import { useGetProductByIdQuery } from "@/store/api/apiProducts";
import { getErrorMessage } from "@/utils/getErrorMessage";
import Button from "@/components/ui/Button";
import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";

const AdminEditProductPage = () => {
  const { id } = useParams();
  const { data, isLoading, error, refetch } = useGetProductByIdQuery(id!, {
    skip: !id,
  });

  if (isLoading) return <AdminPageSkeleton tableRows={3} />;

  if (error || !data?.product)
    return (
      <div className="flex-center h-64 flex-col gap-4">
        <p className="text-gray-600">
          {getErrorMessage(error, "無法載入商品資料")}
        </p>
        <Button onClick={refetch} icon={RefreshIcon}>
          重新載入
        </Button>
      </div>
    );

  return <ProductForm product={data.product} />;
};

export default AdminEditProductPage;
