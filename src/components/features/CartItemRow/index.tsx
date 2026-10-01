import { useEffect, useState } from "react";

import QuantityStepper from "@/components/shared/QuantityStepper";
import type { CartItem } from "@/types";

interface CartItemRowProps {
  item: CartItem;
  onChangeQuantity: (productId: string, quantity: number) => void;
}

const CartItemRow = ({ item, onChangeQuantity }: CartItemRowProps) => {
  const [displayQuantity, setDisplayQuantity] = useState(item.quantity);

  // 使用者停止操作 220ms 後呼叫 onChangeQuantity，避免頻繁打 API。
  useEffect(() => {
    if (displayQuantity === item.quantity) return;

    const timer = setTimeout(() => {
      onChangeQuantity(item.productId, displayQuantity);
    }, 220);

    return () => clearTimeout(timer);
  }, [displayQuantity, item.productId, item.quantity, onChangeQuantity]);

  return (
    <QuantityStepper
      value={displayQuantity}
      max={item.product.countInStock}
      onChange={setDisplayQuantity}
    />
  );
};

export default CartItemRow;
