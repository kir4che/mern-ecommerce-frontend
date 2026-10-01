import type { CartItem } from "@/types";

const GUEST_CART_STORAGE_KEY = "cart";

// 讀取訪客購物車，資料格式錯誤時回傳空購物車。
export const loadGuestCartItems = (): CartItem[] => {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(GUEST_CART_STORAGE_KEY) || "[]"
    );
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

// 保存訪客購物車，儲存失敗時仍保留 Redux 裡的資料。
export const saveGuestCartItems = (items: CartItem[]) => {
  try {
    localStorage.setItem(GUEST_CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // storage full 或私密模式時，保留記憶體中的購物車狀態。
  }
};

// 清除訪客購物車
export const clearGuestCartItems = () => {
  try {
    localStorage.removeItem(GUEST_CART_STORAGE_KEY);
  } catch {
    // storage 異常時，仍保留 Redux state 的清空結果。
  }
};
