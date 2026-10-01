import { addComma } from "@/utils/addComma";
import {
  FREE_SHIPPING_THRESHOLD,
  calculateShippingFee,
  getRemainingForFreeShipping,
  getShippingProgress,
  isFreeShipping,
} from "@/utils/shipping";

interface ShippingInfo {
  isFreeShipping: boolean;
  shippingFee: number;
  message: string;
  threshold: number;
  progress: number;
}

// 根據小計金額計算運費、免運門檻與提示訊息
export const useShippingInfo = (subtotal: number): ShippingInfo => {
  const freeShipping = isFreeShipping(subtotal);
  const diff = getRemainingForFreeShipping(subtotal);
  const progress = getShippingProgress(subtotal);
  const shippingFee = calculateShippingFee(subtotal);

  let message = `全館滿 NT$${addComma(FREE_SHIPPING_THRESHOLD)} 即可享免運費！`;
  if (freeShipping && subtotal > 0)
    message = `已達 NT$${addComma(FREE_SHIPPING_THRESHOLD)} 最低免運門檻！`;
  else if (!freeShipping && subtotal > 0)
    message = `再湊 NT$${addComma(diff)} 元即可享免運費！`;

  return {
    isFreeShipping: freeShipping,
    shippingFee,
    message,
    threshold: FREE_SHIPPING_THRESHOLD,
    progress,
  };
};
