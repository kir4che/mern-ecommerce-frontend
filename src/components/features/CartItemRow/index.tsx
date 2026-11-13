import { useEffect, useOptimistic, useRef, useTransition } from "react";

import QuantityStepper from "@/components/shared/QuantityStepper";
import type { CartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
  onChangeQuantity: (
    productId: string,
    quantity: number
  ) => void | Promise<void>;
}

const CartItemRow = ({ item, onChangeQuantity }: CartItemRowProps) => {
  const [displayQuantity, addOptimisticQuantity] = useOptimistic(
    item.quantity,
    (_currentQuantity, nextQuantity: number) => nextQuantity
  );
  const [, startTransition] = useTransition();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const cancelDebounceRef = useRef<(() => void) | null>(null);

  const cancelPendingChange = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;
    cancelDebounceRef.current?.();
    cancelDebounceRef.current = null;
  };

  // 外部數量更新時取消還沒送出的舊操作，避免覆蓋最新資料。
  useEffect(() => {
    cancelPendingChange();
  }, [item.quantity]);

  const handleQuantityChange = (newQuantity: number) => {
    cancelPendingChange();

    let cancelled = false;
    let resolveDebounce: () => void = () => {};
    const debounce = new Promise<void>((resolve) => {
      resolveDebounce = resolve;
      timerRef.current = setTimeout(resolve, 220);
    });

    cancelDebounceRef.current = () => {
      cancelled = true;
      resolveDebounce();
    };

    startTransition(async () => {
      addOptimisticQuantity(newQuantity);

      await debounce;

      if (cancelled) return;
      await onChangeQuantity(item.productId, newQuantity);
    });
  };

  useEffect(() => {
    return () => {
      cancelPendingChange();
    };
  }, []);

  return (
    <QuantityStepper
      value={displayQuantity}
      max={item.product.countInStock}
      onChange={handleQuantityChange}
    />
  );
};

export default CartItemRow;
