import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router";

import type { Product } from "@/types";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAlert } from "@/context/AlertContext";
import { useCart } from "@/hooks/useCart";
import {
  CART_BUTTON_LABEL,
  CART_ALERT_MESSAGE,
  CART_ALERT_ACTION,
  ARIA_LABEL,
} from "@/constants/cartMessages";

import CartPlusIcon from "@/assets/icons/cart-plus.inline.svg?react";
import PlusIcon from "@/assets/icons/plus.inline.svg?react";
import Button from "@/components/ui/Button";

interface AddToCartBtnProps {
  btnType?: "icon" | "text";
  className?: string;
  product: Partial<Product> & { _id: string };
  quantity?: number;
  onAddSuccess?: () => void; // 成功後要做的事
}

const AddToCartBtn = ({
  btnType = "icon",
  className,
  product,
  quantity = 1,
  onAddSuccess,
}: AddToCartBtnProps) => {
  const navigate = useNavigate();
  const { cart, addToCart } = useCart();
  const { showAlert } = useAlert();

  const [addState, setAddState] = useState<"idle" | "adding" | "success">(
    "idle"
  );
  const isAdding = addState === "adding";
  const isSuccess = addState === "success";

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 計算可用庫存
  const existingItem = cart.find((item) => item.productId === product._id);
  const existingQuantity = existingItem?.quantity || 0;
  const totalStock = product.countInStock || 0;
  const availableStock = Math.max(totalStock - existingQuantity, 0);
  const isOutOfStock = totalStock <= 0;

  const handleAdd = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (isOutOfStock || addState === "adding") return;

      // 檢查是否超過可用庫存
      if (quantity > availableStock) {
        showAlert({
          variant: "warning",
          message: CART_ALERT_MESSAGE.STOCK_LIMIT(
            existingQuantity,
            availableStock
          ),
          action: {
            label: CART_ALERT_ACTION.GO_TO_CART,
            onClick: () => navigate("/cart"),
          },
        });
        return;
      }

      setAddState("adding");

      try {
        await addToCart(product._id, quantity);
        setAddState("success");

        // 設定成功訊息顯示時間，1.5 秒後自動隱藏。
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setAddState("idle"), 1500);

        onAddSuccess?.();
      } catch (err: unknown) {
        showAlert({
          variant: "error",
          message: getErrorMessage(err, "加入購物車失敗，請稍後再試。"),
        });
      } finally {
        // 成功時 timer 會自行 reset，這裡只清 loading 或 error 狀態。
        setAddState((prev) => (prev === "adding" ? "idle" : prev));
      }
    },
    [
      isOutOfStock,
      addState,
      availableStock,
      existingQuantity,
      quantity,
      product,
      showAlert,
      navigate,
      addToCart,
      onAddSuccess,
    ]
  );

  if (btnType === "icon") {
    return (
      <Button
        variant="icon"
        icon={isSuccess ? undefined : PlusIcon}
        onClick={handleAdd}
        disabled={isOutOfStock || isAdding}
        aria-label={ARIA_LABEL.ADD_TO_CART}
        className={cn(
          "size-8.5 rounded-full border-primary transition-colors hover:bg-primary hover:text-white",
          !isOutOfStock && !isAdding && "active:scale-95",
          className
        )}
      >
        {isSuccess && <span className="text-sm font-bold">✔</span>}
      </Button>
    );
  }

  return (
    <Button
      icon={!isOutOfStock && !isAdding && !isSuccess ? CartPlusIcon : undefined}
      onClick={handleAdd}
      disabled={isOutOfStock || isAdding}
      aria-label={ARIA_LABEL.ADD_TO_CART}
      className={cn(
        "w-full transition-transform",
        isSuccess &&
          "border-green-600 bg-green-50 text-green-600 hover:bg-green-50",
        className
      )}
    >
      {isOutOfStock
        ? CART_BUTTON_LABEL.OUT_OF_STOCK
        : isAdding
          ? CART_BUTTON_LABEL.ADDING
          : isSuccess
            ? CART_BUTTON_LABEL.SUCCESS
            : CART_BUTTON_LABEL.DEFAULT}
    </Button>
  );
};

export default AddToCartBtn;
