import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import CartImg from "@/assets/images/ecommerce-cart-illustration.inline.svg?react";
import Button from "@/components/ui/Button";
import CartSkeleton from "@/components/features/CartSkeleton";
import CartItemRow from "@/components/features/CartItemRow";
import CartRecommendations from "@/components/features/CartRecommendations";
import CartSummary from "@/components/features/CartSummary";
import { useAlert } from "@/context/AlertContext";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { useCartCoupon } from "@/hooks/useCartCoupon";
import { useGetProductsQuery } from "@/store/api/apiProducts";
import { addComma } from "@/utils/addComma";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";

import DeliveryTrunkIcon from "@/assets/icons/delivery-trunk.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const {
    cart,
    isLoading,
    error,
    subtotal,
    shippingInfo,
    refetchCart,
    changeQuantity,
    removeFromCart,
    clearCart,
    removedInvalidCount,
    overLimitAdjustedCount,
  } = useCart();
  const { showAlert } = useAlert();
  const { open: openConfirmDialog } = useConfirmDialog();
  const {
    coupon,
    couponDiscount,
    hasAppliedCoupon,
    isValidatingCoupon,
    setCouponInput,
    handleApplyCoupon,
    handleRemoveCoupon,
    getCheckoutCoupon,
  } = useCartCoupon(subtotal);
  const { data: productsData } = useGetProductsQuery({
    tag: "recommend",
  });

  const notifiedCleanupRef = useRef(false);
  const notifiedOverLimitRef = useRef(false);

  // 計算購物車內商品總數量與小計金額，並計算結帳金額。
  const displayQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const displaySubtotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );
  const finalAmount =
    displaySubtotal + shippingInfo.shippingFee - couponDiscount;

  useEffect(() => {
    if (removedInvalidCount > 0 && !notifiedCleanupRef.current) {
      notifiedCleanupRef.current = true;
      showAlert({
        variant: "warning",
        message: "部分商品已失效，已自動從購物車移除。",
      });
    }
  }, [removedInvalidCount, showAlert]);

  useEffect(() => {
    if (overLimitAdjustedCount > 0 && !notifiedOverLimitRef.current) {
      notifiedOverLimitRef.current = true;
      showAlert({
        variant: "warning",
        message: "部分商品數量已超過現有庫存，已自動調整。",
      });
    }
  }, [overLimitAdjustedCount, showAlert]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      openConfirmDialog({
        title: "需要登入",
        message: "請先登入會員帳戶才能繼續結帳",
        confirmText: "前往登入",
        cancelText: "繼續購物",
        onConfirm: () => navigate("/login", { state: { from: location } }),
      });
      return;
    }

    navigate("/checkout", {
      state: {
        coupon: getCheckoutCoupon(),
      },
    });
  };

  if (isLoading) return <CartSkeleton itemCount={cart.length || 3} />;

  if (error)
    return (
      <div className="m-auto flex-center gap-8 px-4 py-12 max-md:flex-col">
        <CartImg className="w-full" />
        <div className="w-full space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-semibold">無法讀取購物車資料</h2>
          <p className="pb-4 text-gray-500">
            {getErrorMessage(error, "發生錯誤")}，或請檢查您的網路狀態。
          </p>
          <Button
            onClick={() => refetchCart()}
            className="h-11 w-full rounded-full md:w-40"
          >
            重新讀取
          </Button>
        </div>
      </div>
    );

  if (cart.length === 0)
    return (
      <div className="m-auto flex-center gap-8 px-4 max-md:flex-col">
        <CartImg className="w-full" />
        <div className="w-full space-y-4 text-center md:text-left">
          <h2 className="text-2xl font-semibold">您的購物車是空的</h2>
          <p className="pb-4 text-gray-500">
            看起來您還沒有挑選任何美味的麵包呢！
          </p>
          <Button
            onClick={() => navigate("/collections/all")}
            className="h-11 w-full rounded-full md:w-40"
          >
            去逛逛
          </Button>
        </div>
      </div>
    );

  return (
    <div className="relative mx-auto flex w-full max-w-7xl gap-8 px-5 py-8 max-md:flex-col md:gap-6 lg:gap-12">
      <section className="min-w-0 flex-1 space-y-6">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">購物車 ({displayQuantity})</h2>
          <Button
            variant="link"
            onClick={() =>
              openConfirmDialog({
                title: "清空購物車",
                message: "確定要清空購物車嗎？",
                confirmText: "確認清空",
                cancelText: "取消",
                onConfirm: () => {
                  void clearCart().catch((err) => {
                    showAlert({
                      variant: "error",
                      message: getErrorMessage(
                        err,
                        "清空購物車失敗，請稍後再試！"
                      ),
                    });
                  });
                },
              })
            }
          >
            清空購物車
          </Button>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <ul className="flex flex-col divide-y divide-gray-200 px-4 tablet:px-6">
            {cart.map((item) => {
              const isOutOfStock = (item.product.countInStock ?? 0) <= 0;

              return (
                <li
                  className={cn(
                    "flex w-full gap-4 py-6 transition-opacity tablet:gap-6",
                    isOutOfStock && "opacity-50"
                  )}
                  key={item.productId}
                >
                  <Link
                    to={`/products/${item.productId}`}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "aspect-square w-24 shrink-0 rounded bg-gray-200 tablet:w-32",
                      isOutOfStock && "pointer-events-none"
                    )}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className="size-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src =
                          "https://placehold.co/144x144?text=No+Image")
                      }
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex-between gap-2">
                      <Link
                        to={`/products/${item.productId}`}
                        rel="noreferrer"
                        className={cn(
                          "line-clamp-2 font-medium hover:text-gray-800",
                          isOutOfStock && "pointer-events-none"
                        )}
                      >
                        {item.product.title}
                      </Link>
                      <Button
                        variant="icon"
                        icon={CloseIcon}
                        className="hover:text-red-600"
                        onClick={() => {
                          void removeFromCart(item.productId).catch((err) => {
                            showAlert({
                              variant: "error",
                              message: getErrorMessage(
                                err,
                                "移除商品失敗，請稍後再試！"
                              ),
                            });
                          });
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-600">
                      NT$ {addComma(item.product.price)}
                    </p>
                    <div className="mt-auto flex-between items-end">
                      {isOutOfStock ? (
                        <span className="badge badge-outline font-medium text-red-600">
                          已售完
                        </span>
                      ) : (
                        <CartItemRow
                          item={item}
                          onChangeQuantity={changeQuantity}
                        />
                      )}
                      <p className="text-lg font-bold">
                        NT$ {addComma(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <p className="flex items-center gap-2 text-sm font-medium text-primary tablet:text-base">
              <DeliveryTrunkIcon className="size-5" />
              {shippingInfo.message}
            </p>
            <progress
              className="progress mt-3 w-full progress-warning"
              value={shippingInfo.progress}
              max="100"
            />
          </div>
        </div>
        <CartRecommendations products={productsData?.products ?? []} />
      </section>
      <CartSummary
        hasItems={cart.length > 0}
        totalQuantity={displayQuantity}
        subtotal={displaySubtotal}
        shippingInfo={shippingInfo}
        finalAmount={finalAmount}
        coupon={coupon}
        couponDiscount={couponDiscount}
        hasAppliedCoupon={hasAppliedCoupon}
        isValidatingCoupon={isValidatingCoupon}
        setCouponInput={setCouponInput}
        handleApplyCoupon={handleApplyCoupon}
        handleRemoveCoupon={handleRemoveCoupon}
        handleCheckout={handleCheckout}
      />
    </div>
  );
};

export default Cart;
