import { useNavigate } from "react-router";

import Button from "@/components/ui/Button";

type ErrorType = "not-found" | "network-error" | "server-error";

interface NotFoundProps {
  message?: string | string[];
  type?: ErrorType;
  onRetry?: () => void;
}

const DEFAULT_MESSAGES: Record<ErrorType, string> = {
  "not-found": "抱歉，找不到您要找的頁面。",
  "network-error": "網路連線失敗，請檢查您的網路狀態。",
  "server-error": "伺服器發生錯誤，請稍後再試。",
};

const STATUS_CODES: Record<ErrorType, string> = {
  "not-found": "404",
  "network-error": "ERROR",
  "server-error": "500",
};

const TITLE_MAP: Record<ErrorType, string> = {
  "not-found": "您查找的商品或頁面不存在",
  "network-error": "網路連線問題",
  "server-error": "伺服器出現問題",
};

const NotFound = ({ message, type = "not-found", onRetry }: NotFoundProps) => {
  const navigate = useNavigate();

  const normalizedMessage = Array.isArray(message)
    ? message.filter(Boolean).join("\n")
    : message || DEFAULT_MESSAGES[type];

  const isNetworkError = type === "network-error";
  const isServerError = type === "server-error";

  return (
    <div className="m-auto flex-center flex-col px-5 text-center">
      <div className="relative">
        <h1 className="text-9xl font-black text-gray-200 select-none">
          {STATUS_CODES[type]}
        </h1>
        <p className="absolute inset-0 flex-center text-2xl font-medium xs:text-nowrap">
          {TITLE_MAP[type]}
        </p>
      </div>
      <p className="leading-relaxed whitespace-pre-line text-gray-500">
        {normalizedMessage}
      </p>
      <div className="mt-8 flex-center flex-wrap gap-3">
        {(isNetworkError || isServerError) && onRetry && (
          <Button variant="secondary" onClick={onRetry} className="px-8">
            重新嘗試
          </Button>
        )}
        <Button
          variant={isNetworkError || isServerError ? "secondary" : "primary"}
          onClick={() => navigate("/")}
          className="px-8"
        >
          回到首頁
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
