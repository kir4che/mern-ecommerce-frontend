import { isRouteErrorResponse, useRouteError } from "react-router";

import Button from "@/components/ui/Button";

const RouteErrorFallback = () => {
  const error = useRouteError();
  const errorMessage =
    error instanceof Error
      ? error.message
      : isRouteErrorResponse(error)
        ? `${error.status} ${error.statusText}`
        : "未知錯誤";

  return (
    <div className="flex-center min-h-[60vh] flex-col gap-4 p-8 text-center">
      <h2 className="text-xl font-bold text-red-600">頁面載入失敗</h2>
      <p className="max-w-md text-gray-600">
        {import.meta.env.DEV
          ? errorMessage
          : "應用程式版本已更新或網路暫時中斷，請重整頁面"}
      </p>
      <Button variant="secondary" onClick={() => window.location.reload()}>
        重整頁面
      </Button>
    </div>
  );
};

export default RouteErrorFallback;
