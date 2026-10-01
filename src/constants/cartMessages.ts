export const CART_BUTTON_LABEL = {
  OUT_OF_STOCK: "補貨中",
  ADDING: "加入中",
  SUCCESS: "已加入",
  DEFAULT: "加入購物車",
} as const;

export const CART_ALERT_MESSAGE = {
  STOCK_LIMIT: (existing: number, available: number) =>
    `購物車已有 ${existing} 件，剩餘庫存 ${available} 件`,
  MAX_REACHED: "已達可購買數量上限，請至購物車調整。",
  LOGIN_SUGGESTION: "建議登入以保留購物車內容",
} as const;

export const CART_ALERT_ACTION = {
  VIEW_CART: "查看購物車",
  GO_TO_CART: "前往購物車",
  LOGIN_NOW: "立即登入",
} as const;

export const ARIA_LABEL = {
  ADD_TO_CART: "加入購物車",
} as const;
