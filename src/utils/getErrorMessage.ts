import { RESPONSE_CODE_MAP } from "@/constants/responseCodes";

type ApiError = {
  data?: unknown;
  status?: number;
};

type ApiErrorData = Record<string, unknown> & {
  code?: string;
  message?: string;
};

const isApiErrorData = (value: unknown): value is ApiErrorData =>
  !!value && typeof value === "object" && !Array.isArray(value);

export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (!error || typeof error !== "object") return fallback;

  const rawData = "data" in error ? (error as ApiError).data : undefined;
  const data = isApiErrorData(rawData) ? rawData : undefined;
  const code = typeof data?.code === "string" ? data.code : undefined;
  const message = typeof data?.message === "string" ? data.message : undefined;

  // 優先用 response code 對應的可讀訊息
  if (code) {
    try {
      const errorValue = RESPONSE_CODE_MAP[code];
      if (typeof errorValue === "function") return errorValue(data ?? {});
      if (typeof errorValue === "string") return errorValue;
    } catch {
      return fallback;
    }
  }

  // 有 code（即使不在 map 裡）且 status 非 500，用後端有意義的錯誤訊息。
  if (code && message && (error as ApiError).status !== 500) return message;

  return fallback;
};

export const getErrorStatus = (error: unknown): number | undefined => {
  if (!error || typeof error !== "object") return undefined;
  const status = (error as ApiError).status;
  return typeof status === "number" ? status : undefined;
};
