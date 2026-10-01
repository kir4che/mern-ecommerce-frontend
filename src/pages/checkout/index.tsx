import { Navigate } from "react-router";

import {
  CheckoutAddressSection,
  CheckoutOrderSummary,
  CheckoutPaymentSection,
  CheckoutSidebar,
} from "@/components/features/Checkout";
import { useCheckoutPage } from "@/hooks/useCheckoutPage";

import Loading from "@/components/ui/Loading";
import NotFound from "@/pages/notFound";

const Checkout = () => {
  const {
    coupon,
    displayOrder,
    displayShippingFee,
    displaySubtotal,
    errors,
    finalAmount,
    finalCouponDiscount,
    handleApplyCoupon,
    handleRemoveCoupon,
    hasAppliedCoupon,
    isDisabled,
    isProcessing,
    isRepaymentMode,
    isValidatingCoupon,
    orderItems,
    paymentMethod,
    register,
    savedAddresses,
    screenState,
    selectSavedAddress,
    selectedAddressId,
    setCouponInput,
    setPaymentMethod,
    showManualAddressForm,
    submitCheckout,
    toggleManualAddress,
    totalItems,
    useManualAddress,
  } = useCheckoutPage();

  if (screenState.kind === "loading") return <Loading fullPage />;
  if (screenState.kind === "notFound")
    return <NotFound message={screenState.message} />;
  if (screenState.kind === "redirect")
    return <Navigate to={screenState.to} replace />;

  return (
    <>
      <div className="mx-auto flex w-full max-w-7xl items-start justify-center gap-x-10 gap-y-8 px-5 py-8 max-lg:flex-col">
        <form
          id="checkout-form"
          className="order-2 w-full flex-1 lg:order-1"
          onSubmit={submitCheckout}
          aria-busy={isProcessing}
          noValidate
        >
          <CheckoutAddressSection
            errors={errors}
            isDisabled={isDisabled}
            isProcessing={isProcessing}
            register={register}
            savedAddresses={savedAddresses}
            selectedAddressId={selectedAddressId}
            showManualAddressForm={showManualAddressForm}
            useManualAddress={useManualAddress}
            onSelectAddress={selectSavedAddress}
            onToggleManualAddress={toggleManualAddress}
          />
          <CheckoutPaymentSection
            isDisabled={isDisabled}
            paymentMethod={paymentMethod}
            onChangePaymentMethod={setPaymentMethod}
          />
          <CheckoutOrderSummary
            coupon={coupon}
            displayOrder={displayOrder}
            displayShippingFee={displayShippingFee}
            displaySubtotal={displaySubtotal}
            finalAmount={finalAmount}
            finalCouponDiscount={finalCouponDiscount}
            hasAppliedCoupon={hasAppliedCoupon}
            isDisabled={isDisabled}
            isProcessing={isProcessing}
            isRepaymentMode={isRepaymentMode}
            isValidatingCoupon={isValidatingCoupon}
            totalItems={totalItems}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            onSetCouponInput={setCouponInput}
          />
          <div className="mt-12 space-y-2">
            <h3 className="text-xl font-medium">官網購物須知</h3>
            <ul className="list-disc pl-5 text-sm leading-6">
              <li>訂單完成後，請務必確認您的收貨資訊是否正確。</li>
              <li>本網站提供多種支付方式，包括 ATM 轉帳、信用卡支付等。</li>
              <li>商品一經售出，恕無法退換貨，除非商品有瑕疵或錯誤。</li>
              <li>
                我們會在收到付款後 24 小時內處理您的訂單，並發送出貨通知。
              </li>
            </ul>
          </div>
        </form>
        <CheckoutSidebar
          isProcessing={isProcessing}
          orderItems={orderItems}
          register={register}
        />
      </div>
    </>
  );
};

export default Checkout;
