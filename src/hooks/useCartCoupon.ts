import { useState } from "react";

import { useCouponMutation } from "@/store/api/apiCoupons";
import { addComma } from "@/utils/addComma";
import { getErrorMessage } from "@/utils/getErrorMessage";

const COUPON_MESSAGES = {
  EMPTY_INPUT: "請先輸入優惠碼",
  REMOVED: "已移除優惠碼",
  INVALID: "優惠碼不可使用",
  VALIDATION_FAILED: "優惠碼驗證失敗，請稍後再試。",
  APPLIED: (code: string, discount: number) =>
    `已套用優惠碼 ${code}，折抵 NT$ ${addComma(discount)}。`,
};

type CouponState = {
  code: string;
  discountAmount: number;
  message: string | null;
  input: string;
};

type CheckoutCoupon = Pick<CouponState, "code" | "discountAmount">;

const INITIAL_COUPON_STATE: CouponState = {
  code: "",
  discountAmount: 0,
  message: null,
  input: "",
};

export const useCartCoupon = (
  subtotal: number,
  initialCoupon?: CheckoutCoupon | null
) => {
  const [validateCoupon, { isLoading }] = useCouponMutation();

  // 初始化 coupon 狀態，若從購物車帶入已套用優惠碼則直接填入。
  const [coupon, setCoupon] = useState<CouponState>(() => {
    if (initialCoupon?.code)
      return {
        code: initialCoupon.code,
        discountAmount: initialCoupon.discountAmount,
        message: COUPON_MESSAGES.APPLIED(
          initialCoupon.code,
          initialCoupon.discountAmount
        ),
        input: initialCoupon.code,
      };
    return INITIAL_COUPON_STATE;
  });

  // 計算折抵金額，若折抵金額大於小計則以小計為上限。
  const couponDiscount = Math.min(coupon.discountAmount, subtotal);

  const setCouponInput = (value: string) => {
    setCoupon((prev) => ({
      ...prev,
      input: value.trim().toUpperCase(),
      message: null,
    }));
  };

  const resetCoupon = (message: string) => {
    setCoupon({ ...INITIAL_COUPON_STATE, message });
  };

  // 套用優惠碼：先驗證，可用則更新 coupon 狀態，不可用則重置狀態並顯示錯誤訊息。
  const handleApplyCoupon = async () => {
    const code = coupon.input;
    if (!code) {
      resetCoupon(COUPON_MESSAGES.EMPTY_INPUT);
      return;
    }

    try {
      const result = await validateCoupon({ code, subtotal }).unwrap();
      if (
        !result.valid ||
        !result.code ||
        typeof result.discountAmount !== "number"
      ) {
        resetCoupon(getErrorMessage({ data: result }, COUPON_MESSAGES.INVALID));
        return;
      }

      setCoupon({
        code: result.code,
        discountAmount: result.discountAmount,
        input: result.code,
        message: COUPON_MESSAGES.APPLIED(result.code, result.discountAmount),
      });
    } catch (err: unknown) {
      resetCoupon(getErrorMessage(err, COUPON_MESSAGES.VALIDATION_FAILED));
    }
  };

  const handleRemoveCoupon = () => {
    resetCoupon(COUPON_MESSAGES.REMOVED);
  };

  // 是否已套用優惠碼
  const hasAppliedCoupon = coupon.code.length > 0;
  const getCheckoutCoupon = (): CheckoutCoupon | null => {
    if (!hasAppliedCoupon) return null;
    return {
      code: coupon.code,
      discountAmount: coupon.discountAmount,
    };
  };

  return {
    coupon,
    couponDiscount,
    hasAppliedCoupon,
    isValidatingCoupon: isLoading,
    setCouponInput,
    handleApplyCoupon,
    handleRemoveCoupon,
    getCheckoutCoupon,
  };
};
