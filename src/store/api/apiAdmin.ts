import { apiSlice } from "./apiSlice";
import type {
  AdminDashboardStatsResponse,
  AdminOrderAnalyticsResponse,
  AnalyticsRange,
  GetUsersParams,
  UsersResponse,
} from "@/types";

const adminApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, GetUsersParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.search) searchParams.append("search", params.search);
        return `/admin/users?${searchParams.toString()}`;
      },
      providesTags: ["Users"],
    }),
    getAdminDashboardStats: builder.query<AdminDashboardStatsResponse, void>({
      query: () => "/admin/orders/stats",
      providesTags: ["Orders", "Products", "Coupons"],
    }),
    getAdminOrderAnalytics: builder.query<
      AdminOrderAnalyticsResponse,
      { range: AnalyticsRange }
    >({
      query: ({ range }) => `/admin/orders/analytics?range=${range}`,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetAdminDashboardStatsQuery,
  useGetAdminOrderAnalyticsQuery,
} = adminApi;
