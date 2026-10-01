import { apiSlice } from "./apiSlice";
import type {
  AddCartItemParams,
  CartResponse,
  SyncCartData,
  UpdateCartItemQuantityParams,
} from "@/types";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<CartResponse, void>({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    syncCart: builder.mutation<CartResponse, SyncCartData>({
      query: (body) => ({ url: "/cart/sync", method: "POST", body }),
      invalidatesTags: ["Cart"],
    }),
    addCartItem: builder.mutation<CartResponse, AddCartItemParams>({
      query: ({ productId, quantity }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: builder.mutation<CartResponse, string>({
      query: (productId) => ({ url: `/cart/${productId}`, method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
    updateCartItemQuantity: builder.mutation<
      CartResponse,
      UpdateCartItemQuantityParams
    >({
      query: ({ productId, quantity }) => ({
        url: `/cart/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCartItems: builder.mutation<CartResponse, void>({
      query: () => ({ url: "/cart", method: "DELETE" }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useSyncCartMutation,
  useAddCartItemMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
  useClearCartItemsMutation,
} = cartApi;
