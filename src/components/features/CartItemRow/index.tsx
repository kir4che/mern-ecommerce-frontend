import { useEffect, useRef, useState } from "react";

import QuantityStepper from "@/components/shared/QuantityStepper";
import type { CartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
  onChangeQuantity: (productId: string, quantity: number) => void;
}

const CartItemRow = ({ item, onChangeQuantity }: CartItemRowProps) => {
  const [displayQuantity, setDisplayQuantity] = useState(item.quantity);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 當外部 item.quantity 變更（如推薦商品區按加入購物車）時，同步更新內部顯示數量，並取消待發送的請求。
  useEffect(() => {
    setDisplayQuantity(item.quantity);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, [item.quantity]);

  // 僅在使用者主動操作 Stepper 時觸發防抖更新
  const handleQuantityChange = (newQuantity: number) => {
    setDisplayQuantity(newQuantity);
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onChangeQuantity(item.productId, newQuantity);
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
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
