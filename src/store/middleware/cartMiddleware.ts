import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { toast } from "sonner";
import type { RootState } from "@/store";
import { cartApi } from "@/store/api/apiCart";
import { logout, loginSuccess } from "@/store/slices/authSlice";
import {
  addItem,
  changeItemQuantity,
  clearItems,
  removeItem,
} from "@/store/slices/guestCartSlice";
import {
  clearGuestCartItems,
  saveGuestCartItems,
} from "@/store/storage/cartStorage";

export const cartListenerMiddleware = createListenerMiddleware();

// 訪客購物車變更後，把目前的 Redux state 保存到 localStorage。
cartListenerMiddleware.startListening({
  matcher: isAnyOf(addItem, removeItem, changeItemQuantity),
  effect: (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    saveGuestCartItems(state.guestCart.items);
  },
});

cartListenerMiddleware.startListening({
  actionCreator: clearItems,
  effect: () => {
    clearGuestCartItems();
  },
});

// 登入成功後，把訪客購物車同步到會員購物車。
cartListenerMiddleware.startListening({
  actionCreator: loginSuccess,
  effect: async (_, listenerApi) => {
    const state = listenerApi.getState() as RootState;
    const guestItems = state.guestCart.items;

    // 有商品才需要呼叫同步 API
    if (guestItems.length > 0) {
      const localCart = guestItems.map(({ productId, quantity }) => ({
        productId,
        quantity,
      }));

      try {
        await listenerApi
          .dispatch(cartApi.endpoints.syncCart.initiate({ localCart }))
          .unwrap();
      } catch {
        toast.warning("網路似乎有點不穩，正在背景為您保留原本的購物車商品。");
        return;
      }
    }

    // 同步成功（或沒有商品可同步）才清空本地購物車
    listenerApi.dispatch(clearItems());
  },
});

// 登出後清空訪客購物車，避免下一位使用者看到前一位的資料。
cartListenerMiddleware.startListening({
  actionCreator: logout,
  effect: (_, listenerApi) => {
    listenerApi.dispatch(clearItems());
  },
});
