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
      async onQueryStarted(_body, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            cartApi.util.updateQueryData("getCart", undefined, (draft) => {
              Object.assign(draft, data);
            })
          );
        } catch {
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        }
      },
    }),
    addCartItem: builder.mutation<CartResponse, AddCartItemParams>({
      query: ({ productId, quantity }) => ({
        url: "/cart",
        method: "POST",
        body: { productId, quantity },
      }),
      async onQueryStarted(
        { productId, quantity, product },
        { dispatch, queryFulfilled }
      ) {
        // 樂觀更新：立刻更新本地快取，讓右上角購物車數字與數量在 0 毫秒立即增加
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const existingItem = draft.cart.find(
              (item) => item.productId === productId
            );
            if (existingItem) {
              const maxStock = existingItem.product.countInStock ?? Infinity;
              existingItem.quantity = Math.min(
                existingItem.quantity + quantity,
                maxStock
              );
            } else if (product) {
              const maxStock = product.countInStock ?? Infinity;
              draft.cart.push({
                productId,
                quantity: Math.min(quantity, maxStock),
                product,
              });
            }
          })
        );
        try {
          const { data } = await queryFulfilled;
          // 直接使用後端回傳的完整最新資料覆蓋快取，免去重複的 GET /cart 請求
          dispatch(
            cartApi.util.updateQueryData("getCart", undefined, (draft) => {
              Object.assign(draft, data);
            })
          );
        } catch {
          // 失敗時回滾並觸發 refetch
          patchResult.undo();
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        }
      },
    }),
    removeCartItem: builder.mutation<CartResponse, string>({
      query: (productId) => ({ url: `/cart/${productId}`, method: "DELETE" }),
      async onQueryStarted(productId, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            draft.cart = draft.cart.filter(
              (item) => item.productId !== productId
            );
          })
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            cartApi.util.updateQueryData("getCart", undefined, (draft) => {
              Object.assign(draft, data);
            })
          );
        } catch {
          patchResult.undo();
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        }
      },
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
      async onQueryStarted(
        { productId, quantity },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            const item = draft.cart.find((i) => i.productId === productId);
            if (item) {
              const maxStock = item.product.countInStock ?? Infinity;
              item.quantity = Math.max(1, Math.min(quantity, maxStock));
            }
          })
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            cartApi.util.updateQueryData("getCart", undefined, (draft) => {
              Object.assign(draft, data);
            })
          );
        } catch {
          patchResult.undo();
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        }
      },
    }),
    clearCartItems: builder.mutation<CartResponse, void>({
      query: () => ({ url: "/cart", method: "DELETE" }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApi.util.updateQueryData("getCart", undefined, (draft) => {
            draft.cart = [];
          })
        );
        try {
          const { data } = await queryFulfilled;
          dispatch(
            cartApi.util.updateQueryData("getCart", undefined, (draft) => {
              Object.assign(draft, data);
            })
          );
        } catch {
          patchResult.undo();
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        }
      },
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
