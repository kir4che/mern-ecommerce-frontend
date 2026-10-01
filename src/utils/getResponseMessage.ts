import { RESPONSE_CODE_MAP } from "@/constants/responseCodes";

type ResponseData = Record<string, unknown> & {
  code?: string;
};

const isResponseData = (value: unknown): value is ResponseData =>
  !!value && typeof value === "object" && !Array.isArray(value);

export const getResponseMessage = (
  response: unknown,
  fallback: string
): string => {
  if (!isResponseData(response)) return fallback;

  const code = typeof response.code === "string" ? response.code : undefined;
  if (!code) return fallback;

  try {
    const responseValue = RESPONSE_CODE_MAP[code];
    if (typeof responseValue === "function") return responseValue(response);
    if (typeof responseValue === "string") return responseValue;
  } catch {
    return fallback;
  }

  return fallback;
};
