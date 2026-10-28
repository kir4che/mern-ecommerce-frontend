import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type { RootState } from "@/store";
import type { CartItem } from "@/types";

export interface GuestCartState {
  items: CartItem[];
  hasShownLoginPrompt: boolean;
}

const initialState: GuestCartState = {
  items: [],
  hasShownLoginPrompt: false,
};

const guestCartSlice = createSlice({
  name: "guestCart",
  initialState,
  reducers: {
    // 新增商品或累加數量
    addItem(state, action: PayloadAction<CartItem>) {
      const existing = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (existing) {
        const stock =
          existing.product?.countInStock ??
          action.payload.product?.countInStock ??
          Infinity;
        existing.quantity = Math.min(
          existing.quantity + action.payload.quantity,
          stock
        );
      } else if (action.payload.product) {
        const stock = action.payload.product.countInStock ?? Infinity;
        state.items.push({
          ...action.payload,
          quantity: Math.min(action.payload.quantity, stock),
        });
      }
    },
    // 移除商品
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.productId !== action.payload);
    },
    // 修改商品數量
    changeItemQuantity(
      state,
      action: PayloadAction<{ productId: string; quantity: number }>
    ) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId
      );
      if (item) {
        const stock = item.product?.countInStock ?? Infinity;
        item.quantity = Math.max(1, Math.min(action.payload.quantity, stock));
      }
    },
    // 清空購物車
    clearItems(state) {
      state.items = [];
      state.hasShownLoginPrompt = false;
    },
    // 標記已顯示登入提示
    markLoginPromptShown(state) {
      state.hasShownLoginPrompt = true;
    },
  },
});

export const {
  addItem,
  removeItem,
  changeItemQuantity,
  clearItems,
  markLoginPromptShown,
} = guestCartSlice.actions;

export const selectGuestItems = (state: RootState) => state.guestCart.items;
export const selectHasShownLoginPrompt = (state: RootState) =>
  state.guestCart.hasShownLoginPrompt;

export default guestCartSlice.reducer;
