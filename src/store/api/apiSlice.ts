import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:8080/api" : undefined);

if (!BASE_URL) throw new Error("VITE_API_URL is required.");

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  // ngrok 免費版會對瀏覽器請求回攔截頁（無 CORS header），帶此 header 可跳過
  prepareHeaders: (headers) => {
    headers.set("ngrok-skip-browser-warning", "1");
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: [
    "Products",
    "Product",
    "News",
    "NewsItem",
    "Orders",
    "Cart",
    "Coupons",
    "Addresses",
    "Users",
    "Categories",
    "Tags",
  ],
  endpoints: () => ({}),
});
