import { describe, expect, it } from "vitest";

import guestCartReducer, {
  addItem,
  changeItemQuantity,
  clearItems,
  removeItem,
  type GuestCartState,
} from "../guestCartSlice";
import type { CartItem } from "@/types";

const mockItem: CartItem = {
  productId: "p1",
  quantity: 1,
  product: {
    _id: "p1",
    title: "吐司",
    price: 80,
    imageUrl: "toast.jpg",
    countInStock: 5,
  },
};

describe("guestCartSlice", () => {
  const initialState: GuestCartState = {
    items: [],
    hasShownLoginPrompt: false,
  };

  it("初始狀態加入新商品", () => {
    const state = guestCartReducer(initialState, addItem(mockItem));
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toEqual(mockItem);
  });

  it("已存在商品時累加數量，且不超過庫存上限", () => {
    let state = guestCartReducer(initialState, addItem(mockItem));
    // 再加入 2 件
    state = guestCartReducer(
      state,
      addItem({ ...mockItem, quantity: 2 })
    );
    expect(state.items[0].quantity).toBe(3);

    // 再加入 10 件（超過剩餘庫存），應受限於 countInStock (5)
    state = guestCartReducer(
      state,
      addItem({ ...mockItem, quantity: 10 })
    );
    expect(state.items[0].quantity).toBe(5);
  });

  it("修改商品數量時受庫存與最小值限制", () => {
    let state = guestCartReducer(initialState, addItem(mockItem));

    // 修改至 4
    state = guestCartReducer(
      state,
      changeItemQuantity({ productId: "p1", quantity: 4 })
    );
    expect(state.items[0].quantity).toBe(4);

    // 修改至 99（超庫存）
    state = guestCartReducer(
      state,
      changeItemQuantity({ productId: "p1", quantity: 99 })
    );
    expect(state.items[0].quantity).toBe(5);

    // 修改至 0（小於 1）
    state = guestCartReducer(
      state,
      changeItemQuantity({ productId: "p1", quantity: 0 })
    );
    expect(state.items[0].quantity).toBe(1);
  });

  it("移除商品", () => {
    let state = guestCartReducer(initialState, addItem(mockItem));
    expect(state.items).toHaveLength(1);

    state = guestCartReducer(state, removeItem("p1"));
    expect(state.items).toHaveLength(0);
  });

  it("清空購物車", () => {
    let state = guestCartReducer(initialState, addItem(mockItem));
    state = guestCartReducer(state, clearItems());
    expect(state.items).toHaveLength(0);
  });
});
