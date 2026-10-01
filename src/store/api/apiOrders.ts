import { apiSlice } from "./apiSlice";
import type {
  BaseResponse,
  CreateOrderData,
  GetOrdersParams,
  Order,
  OrderDetailResponse,
  OrdersResponse,
  UpdateOrderData,
} from "@/types";

const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getOrders: builder.query<OrdersResponse, GetOrdersParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.status) searchParams.append("type", params.status);
        if (params.keyword) searchParams.append("keyword", params.keyword);
        if (params.startDate)
          searchParams.append("startDate", params.startDate);
        if (params.endDate) searchParams.append("endDate", params.endDate);
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.orderBy) searchParams.append("orderBy", params.orderBy);
        if (params.userId) searchParams.append("userId", params.userId);
        return `${params.isAdmin ? "/admin/orders" : "/orders"}?${searchParams.toString()}`;
      },
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query<OrderDetailResponse, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Orders" as const, id }],
    }),
    createOrder: builder.mutation<OrderDetailResponse, CreateOrderData>({
      query: (body) => ({ url: "/orders", method: "POST", body }),
      invalidatesTags: ["Orders"],
    }),
    updateOrder: builder.mutation<
      BaseResponse & { order?: Order },
      { id: string } & UpdateOrderData
    >({
      query: ({ id, ...body }) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Orders",
        { type: "Orders" as const, id },
      ],
    }),
    cancelOrder: builder.mutation<BaseResponse, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "PATCH",
        body: { status: "canceled" },
      }),
      invalidatesTags: (_result, _error, id) => [
        "Orders",
        { type: "Orders" as const, id },
      ],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useCancelOrderMutation,
} = ordersApi;
