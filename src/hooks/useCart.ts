import { useCallback, useMemo } from "react";

import { useShippingInfo } from "@/hooks/useShippingInfo";
import type { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  useAddCartItemMutation,
  useClearCartItemsMutation,
  useGetCartQuery,
  useRemoveCartItemMutation,
  useUpdateCartItemQuantityMutation,
} from "@/store/api/apiCart";
import {
  addItem,
  changeItemQuantity,
  clearItems,
  removeItem,
  selectGuestItems,
} from "@/store/slices/guestCartSlice";
import { productApi } from "@/store/api/apiProducts";
import type { CartItem } from "@/types";

export const useCart = () => {
  const dispatch = useAppDispatch();

  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const guestItems = useAppSelector(selectGuestItems);

  const {
    data: serverCartData,
    isLoading: serverLoading,
    error: serverError,
    refetch: refetchCart,
  } = useGetCartQuery(undefined, { skip: !isAuthenticated });

  const [addCartItem] = useAddCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [updateCartItemQuantity] = useUpdateCartItemQuantityMutation();
  const [clearCartItems] = useClearCartItemsMutation();

  // 同步合併購物車
  const mergedCart: CartItem[] = useMemo(() => {
    if (!isAuthenticated) return guestItems;

    const serverItems = serverCartData?.cart ?? [];
    const mergedMap = new Map(
      serverItems.map((item) => [item.productId, { ...item }])
    );

    guestItems.forEach((localItem) => {
      const existing = mergedMap.get(localItem.productId);
      if (existing) {
        const stock = existing.product.countInStock ?? 0;
        // 若商品庫存大於 0，則將數量限制在庫存範圍內；庫存為 0 則保留原本的數量（不增加）。
        existing.quantity =
          stock > 0
            ? Math.min(existing.quantity + localItem.quantity, stock)
            : existing.quantity;
      } else mergedMap.set(localItem.productId, { ...localItem });
    });

    return Array.from(mergedMap.values());
  }, [isAuthenticated, serverCartData?.cart, guestItems]);

  const cart = mergedCart;

  const isLoading = isAuthenticated && serverLoading;
  const cartError = isAuthenticated ? serverError : null;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce(
    (sum, item) => sum + item.quantity * (item.product?.price ?? 0),
    0
  );

  const shippingInfo = useShippingInfo(subtotal);

  // 加入購物車
  const handleAddToCart = useCallback(
    async (productId: string, quantity: number) => {
      if (!productId) throw new Error("商品 ID 不存在");
      const validQuantity = Math.max(1, quantity || 1);

      if (isAuthenticated)
        await addCartItem({ productId, quantity: validQuantity }).unwrap();
      else {
        const result = await dispatch(
          productApi.endpoints.getProductById.initiate(productId, {
            subscribe: false,
          })
        ).unwrap();
        dispatch(
          addItem({
            productId,
            quantity: validQuantity,
            product: result.product,
          })
        );
      }
    },
    [isAuthenticated, addCartItem, dispatch]
  );

  // 從購物車移除商品
  const handleRemoveFromCart = useCallback(
    async (productId: string) => {
      if (isAuthenticated) {
        try {
          await removeCartItem(productId).unwrap();
        } catch (err: unknown) {
          if ((err as { status?: number })?.status !== 404) throw err;
        }
        return;
      }
      dispatch(removeItem(productId));
    },
    [isAuthenticated, removeCartItem, dispatch]
  );

  // 修改商品數量（樂觀更新 + 非同步同步到後端）
  const handleChangeQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (!Number.isInteger(quantity) || quantity < 1) return;

      if (isAuthenticated) {
        void updateCartItemQuantity({ productId, quantity })
          .unwrap()
          .catch(() => {
            // 若同步失敗，則重新抓取購物車資料以回復正確狀態。
            void refetchCart();
          });
        return;
      }

      dispatch(changeItemQuantity({ productId, quantity }));
    },
    [isAuthenticated, dispatch, refetchCart, updateCartItemQuantity]
  );

  // 清空購物車
  const handleClearCart = useCallback(async () => {
    if (isAuthenticated) await clearCartItems().unwrap();
    else dispatch(clearItems());
    return true;
  }, [isAuthenticated, clearCartItems, dispatch]);

  // 後端回傳的移除無效商品數量、超過庫存限制的商品數量
  const removedInvalidCount = serverCartData?.removedInvalidCount ?? 0;
  const overLimitAdjustedCount = serverCartData?.overLimitAdjustedCount ?? 0;

  return {
    cart,
    removedInvalidCount,
    overLimitAdjustedCount,
    isLoading,
    error: cartError,
    totalQuantity,
    subtotal,
    shippingInfo,
    refetchCart,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    changeQuantity: handleChangeQuantity,
    clearCart: handleClearCart,
  };
};
