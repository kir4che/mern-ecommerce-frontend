import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { addComma } from "@/utils/addComma";

interface ShippingInfo {
  message: string;
  progress: number;
  shippingFee: number;
}

interface CartSummaryProps {
  hasItems: boolean;
  totalQuantity: number;
  subtotal: number;
  shippingInfo: ShippingInfo;
  finalAmount: number;
  coupon: { input: string; code: string; message: string | null };
  couponDiscount: number;
  hasAppliedCoupon: boolean;
  isValidatingCoupon: boolean;
  setCouponInput: (value: string) => void;
  handleApplyCoupon: () => void;
  handleRemoveCoupon: () => void;
  handleCheckout: () => void;
}

const CartSummary = ({
  hasItems,
  totalQuantity,
  subtotal,
  shippingInfo,
  finalAmount,
  coupon,
  couponDiscount,
  hasAppliedCoupon,
  isValidatingCoupon,
  setCouponInput,
  handleApplyCoupon,
  handleRemoveCoupon,
  handleCheckout,
}: CartSummaryProps) => {
  return (
    <div className="w-full shrink-0 md:w-80 lg:w-96">
      <div className="sticky top-24 rounded-xl border border-gray-200 p-6 shadow-md">
        <h3 className="text-lg font-bold">訂單摘要</h3>
        <div className="my-4 space-y-2">
          <p className="flex-between">
            <span>商品總計 ({totalQuantity} 件)</span>
            <span className="font-medium">NT$ {addComma(subtotal)}</span>
          </p>
          <p className="flex-between">
            <span>運費</span>
            <span className="font-medium">
              {shippingInfo.shippingFee === 0
                ? "免運費"
                : `NT$ ${shippingInfo.shippingFee}`}
            </span>
          </p>
          {hasAppliedCoupon && couponDiscount > 0 && (
            <p className="flex-between">
              <span>優惠折扣</span>
              <span className="font-medium text-red-600">
                - NT$ {addComma(couponDiscount)}
              </span>
            </p>
          )}
        </div>
        <div className="mt-4 mb-8 space-y-2 border-b border-gray-300 pb-4">
          <div className="flex items-end gap-2">
            <Input
              value={coupon.input}
              onChange={(e) => setCouponInput(e.target.value)}
              placeholder="輸入優惠碼"
              className="flex-1"
              disabled={isValidatingCoupon}
            />
            <Button
              onClick={handleApplyCoupon}
              disabled={isValidatingCoupon}
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
                onClick={handleRemoveCoupon}
                className="h-auto min-h-0 p-0 text-xs"
              >
                移除
              </Button>
            </div>
          )}
          {coupon.message && (
            <p className="text-xs text-gray-600">{coupon.message}</p>
          )}
        </div>
        <div className="mb-6 flex-between">
          <span className="font-medium">總付款金額</span>
          <span className="text-2xl font-bold">
            NT$ {addComma(finalAmount)}
          </span>
        </div>
        <Button
          onClick={handleCheckout}
          disabled={!hasItems}
          className="w-full rounded-full py-2.5"
        >
          前往結帳
        </Button>
      </div>
    </div>
  );
};

export default CartSummary;
