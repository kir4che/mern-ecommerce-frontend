import type { Dispatch, SetStateAction } from "react";

import type { CheckoutCouponState, Order } from "@/types";
import { addComma } from "@/utils/addComma";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface CheckoutOrderSummaryProps {
  coupon: CheckoutCouponState;
  displayOrder?: Order;
  displayShippingFee: number;
  displaySubtotal: number;
  finalAmount: number;
  finalCouponDiscount: number;
  hasAppliedCoupon: boolean;
  isDisabled: boolean;
  isProcessing: boolean;
  isRepaymentMode: boolean;
  isValidatingCoupon: boolean;
  totalItems: number;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onSetCouponInput:
    | Dispatch<SetStateAction<string>>
    | ((value: string) => void);
}

export const CheckoutOrderSummary = ({
  coupon,
  displayOrder,
  displayShippingFee,
  displaySubtotal,
  finalAmount,
  finalCouponDiscount,
  hasAppliedCoupon,
  isDisabled,
  isProcessing,
  isRepaymentMode,
  isValidatingCoupon,
  totalItems,
  onApplyCoupon,
  onRemoveCoupon,
  onSetCouponInput,
}: CheckoutOrderSummaryProps) => (
  <div>
    <h3 className="mb-4 border-b border-gray-200 pb-4 text-xl font-bold">
      訂單摘要
    </h3>
    <div className="space-y-4 text-[15px]">
      <div className="flex w-full justify-between">
        <p className="text-sm leading-loose">商品總計 ({totalItems} 件)</p>
        <p className="font-medium">NT$ {addComma(displaySubtotal)}</p>
      </div>
      <div className="flex w-full justify-between">
        <p className="text-sm leading-loose">運費</p>
        <p className="font-medium">
          {displayShippingFee === 0
            ? "免運費"
            : `NT$ ${addComma(displayShippingFee)}`}
        </p>
      </div>
      {finalCouponDiscount > 0 && (
        <div className="flex w-full justify-between">
          <p className="text-sm leading-loose">優惠折扣</p>
          <p className="font-medium text-red-600">
            - NT$ {addComma(finalCouponDiscount)}
          </p>
        </div>
      )}
    </div>
    {!isRepaymentMode && (
      <div className="mt-6 space-y-2 border-b border-gray-300 pb-4">
        <div className="flex items-end gap-2">
          <Input
            value={coupon.input}
            onChange={(event) => onSetCouponInput(event.target.value)}
            placeholder="輸入優惠碼"
            className="flex-1"
            disabled={isValidatingCoupon || isProcessing}
          />
          <Button
            type="button"
            onClick={onApplyCoupon}
            disabled={isValidatingCoupon || isProcessing}
            className="rounded py-2"
          >
            套用
          </Button>
        </div>
        {hasAppliedCoupon && (
          <div className="flex-between rounded border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
            <span>已套用：{coupon.code}</span>
            <Button
              type="button"
              variant="link"
              onClick={onRemoveCoupon}
              className="h-auto min-h-0 p-0 text-xs text-green-700 hover:text-green-800"
              disabled={isDisabled}
            >
              移除
            </Button>
          </div>
        )}
        {coupon.message && (
          <p className="text-xs text-gray-600">{coupon.message}</p>
        )}
      </div>
    )}
    {isRepaymentMode && displayOrder?.couponCode && (
      <div className="mt-4 border-b border-gray-300 pb-4">
        <p className="text-xs text-gray-600">
          已套用優惠碼 {displayOrder.couponCode}，折抵 NT${" "}
          {addComma(displayOrder.discount)}。
        </p>
      </div>
    )}
    <div className="mt-8 mb-4 flex flex-col gap-y-4">
      <div className="flex w-full items-center justify-between font-bold">
        <p className="text-lg">總付款金額</p>
        <p className="text-2xl">NT$ {addComma(finalAmount)}</p>
      </div>
    </div>
    <Button
      type="submit"
      disabled={isDisabled}
      className="mt-4 h-12 w-full rounded-full text-lg"
    >
      {isProcessing ? "處理中..." : "確認付款"}
    </Button>
  </div>
);
