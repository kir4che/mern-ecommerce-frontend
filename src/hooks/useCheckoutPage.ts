import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate, useParams } from "react-router";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { useCart } from "@/hooks/useCart";
import { useCartCoupon } from "@/hooks/useCartCoupon";
import { useGetAddressesQuery } from "@/store/api/apiAddresses";
import {
  useCreateOrderMutation,
  useGetOrderByIdQuery,
} from "@/store/api/apiOrders";
import {
  useCreatePaymentMutation,
  useDevPayOrderMutation,
} from "@/store/api/apiPayment";
import type {
  BuyerFormData,
  CheckoutOrderItem,
  Order,
  PaymentMethod,
  UserAddress,
} from "@/types";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { submitPaymentForm } from "@/utils/submitPaymentForm";

const buyerSchema = z.object({
  name: z.string().trim().min(1, ""),
  phone: z
    .string()
    .trim()
    .min(1, "")
    .regex(/^09\d{8}$/, "請輸入有效手機號碼"),
  address: z.string().trim().min(1, ""),
  note: z.string().optional(),
});

type CheckoutScreenState =
  | { kind: "loading" }
  | { kind: "notFound"; message: string }
  | { kind: "redirect"; to: string }
  | { kind: "ready" };

interface CheckoutDisplayState {
  displayOrder?: Order;
  isRepaymentMode: boolean;
  orderItems: CheckoutOrderItem[];
  displaySubtotal: number;
  finalCouponDiscount: number;
  displayShippingFee: number;
  finalAmount: number;
}

// 訂單明細來源：重覆付款時回放既有訂單，一般結帳用購物車。
const getOrderItems = (
  order: Order | undefined,
  isRepaymentMode: boolean,
  cartItems: Array<{
    productId: string;
    quantity: number;
    product: { title: string; price: number; imageUrl?: string };
  }>
): CheckoutOrderItem[] => {
  if (isRepaymentMode && order) {
    return order.orderItems.map((item) => ({
      productId: item.productId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
    }));
  }

  return cartItems.map((item) => ({
    productId: item.productId,
    title: item.product.title,
    price: item.product.price,
    quantity: item.quantity,
    imageUrl: item.product.imageUrl,
  }));
};

// 取得收件人資訊
const getShippingContact = ({
  formData,
  selectedAddress,
  useManualAddress,
}: {
  formData: BuyerFormData;
  selectedAddress?: UserAddress;
  useManualAddress: boolean;
}) => {
  if (useManualAddress) {
    return {
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    };
  }

  return {
    name: selectedAddress?.name ?? formData.name,
    phone: selectedAddress?.phone ?? formData.phone,
    address: selectedAddress?.address ?? formData.address,
  };
};

// 計算結帳頁面顯示的訂單資訊
const getCheckoutDisplayState = ({
  couponDiscount,
  order,
  orderId,
  shippingFee,
  subtotal,
  validCartItems,
}: {
  couponDiscount: number;
  order: Order | undefined;
  orderId: string | undefined;
  shippingFee: number;
  subtotal: number;
  validCartItems: Array<{
    productId: string;
    quantity: number;
    product: { title: string; price: number; imageUrl?: string };
  }>;
}): CheckoutDisplayState => {
  const isRepaymentMode = !!orderId && !!order;
  const orderItems = getOrderItems(order, isRepaymentMode, validCartItems);
  const displaySubtotal = isRepaymentMode ? (order?.subtotal ?? 0) : subtotal;
  const finalCouponDiscount = isRepaymentMode
    ? (order?.discount ?? 0)
    : couponDiscount;
  const displayShippingFee = isRepaymentMode
    ? (order?.shippingFee ?? 0)
    : shippingFee;
  const finalAmount = isRepaymentMode
    ? (order?.totalAmount ?? 0)
    : displaySubtotal + displayShippingFee - finalCouponDiscount;

  return {
    displayOrder: order,
    isRepaymentMode,
    orderItems,
    displaySubtotal,
    finalCouponDiscount,
    displayShippingFee,
    finalAmount,
  };
};

export const useCheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const orderId = params.id;

  const {
    data: orderData,
    isLoading: isLoadingOrder,
    error: orderError,
  } = useGetOrderByIdQuery(orderId || "", {
    skip: !orderId,
  });

  const {
    cart,
    subtotal,
    shippingInfo,
    clearCart,
    isLoading: isLoadingCart,
    error: cartError,
  } = useCart();
  const { showAlert } = useAlert();

  const {
    coupon,
    couponDiscount,
    hasAppliedCoupon,
    isValidatingCoupon,
    setCouponInput,
    handleApplyCoupon,
    handleRemoveCoupon,
    getCheckoutCoupon,
  } = useCartCoupon(subtotal, location.state?.coupon);

  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();
  const [devPayOrder] = useDevPayOrderMutation();

  const { data: addrData } = useGetAddressesQuery();
  const savedAddresses = addrData?.addresses ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
    defaultValues: { name: "", phone: "", address: "", note: "" },
  });

  const [explicitAddressId, setExplicitAddressId] = useState<string | null>(
    null
  );
  const [useManualAddress, setUseManualAddress] = useState(false);
  // 防止重覆送單（crypto.randomUUID 不可用時退回 timestamp+random）
  const [idempotencyKey] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("ATM");
  const [isRedirectingToPayment, setIsRedirectingToPayment] = useState(false);

  // 選中地址優先級：使用者選擇 → 預設地址 → null
  const selectedAddressId =
    explicitAddressId ??
    savedAddresses.find((address) => address.isDefault)?._id ??
    null;
  const selectedAddress = savedAddresses.find(
    (address) => address._id === selectedAddressId
  );
  const hasSelectedAddress = !!selectedAddress;

  // 把選中地址的資訊帶入表單，除非使用者選擇手動輸入地址。
  useEffect(() => {
    if (useManualAddress || !selectedAddress) return;

    setValue("name", selectedAddress.name, { shouldDirty: false });
    setValue("phone", selectedAddress.phone, { shouldDirty: false });
    setValue("address", selectedAddress.address, { shouldDirty: false });
  }, [selectedAddress, setValue, useManualAddress]);

  // 篩掉 product 為 null 的無效品項
  const validCartItems = cart.filter(
    (
      item
    ): item is typeof item & {
      product: NonNullable<(typeof item)["product"]>;
    } => !!item.product
  );
  const hasInvalidCartItems = validCartItems.length !== cart.length;

  const checkoutDisplay = getCheckoutDisplayState({
    couponDiscount,
    order: orderData?.order,
    orderId,
    shippingFee: shippingInfo.shippingFee,
    subtotal,
    validCartItems,
  });
  const {
    displayOrder,
    displayShippingFee,
    displaySubtotal,
    finalAmount,
    finalCouponDiscount,
    isRepaymentMode,
    orderItems,
  } = checkoutDisplay;
  const usesCartCheckout = !isRepaymentMode;

  const isProcessing = isCreatingOrder || isCreatingPayment;
  const isDisabled = isLoadingOrder || isLoadingCart || isProcessing;
  const showManualAddressForm = savedAddresses.length === 0 || useManualAddress;
  const totalItems = orderItems.reduce((sum, item) => sum + item.quantity, 0);

  let screenState: CheckoutScreenState;
  if ((orderId && isLoadingOrder) || (!orderId && isLoadingCart))
    screenState = { kind: "loading" };
  else if (isRedirectingToPayment) screenState = { kind: "loading" };
  else if (orderId && orderError)
    screenState = { kind: "notFound", message: "訂單載入失敗，請稍後再試。" };
  else if (orderId && !displayOrder)
    screenState = { kind: "notFound", message: "訂單不存在，請檢查訂單 ID。" };
  else if (!orderId && cartError)
    screenState = { kind: "notFound", message: "購物車載入失敗，請稍後再試。" };
  else if (usesCartCheckout && (hasInvalidCartItems || cart.length === 0))
    screenState = { kind: "redirect", to: "/cart" };
  else screenState = { kind: "ready" };

  const selectSavedAddress = (address: UserAddress) => {
    setExplicitAddressId(address._id);
    setUseManualAddress(false);
    setValue("name", address.name);
    setValue("phone", address.phone);
    setValue("address", address.address);
  };

  const toggleManualAddress = () => {
    setUseManualAddress((value) => !value);
  };

  // 主流程：建立訂單 → 呼叫金流 API → 清除購物車 → 導向付款頁
  // 重覆付款模式跳過 createOrder / clearCart，直接取既有訂單建立付款。
  const submitCheckoutForm = handleSubmit(async (formData) => {
    if (isDisabled || isRedirectingToPayment) return;

    if (!useManualAddress && savedAddresses.length > 0 && !hasSelectedAddress) {
      showAlert({ variant: "error", message: "請先選擇一個收件地址。" });
      return;
    }

    if (usesCartCheckout && cart.length === 0) {
      navigate("/cart");
      return;
    }

    const shippingContact = getShippingContact({
      formData,
      selectedAddress,
      useManualAddress,
    });

    let orderIdForPayment: string | null = null;

    try {
      if (isRepaymentMode) orderIdForPayment = displayOrder!._id;
      else {
        const result = await createOrder({
          orderItems: cart.map(({ productId, quantity }) => ({
            productId,
            quantity,
          })),
          couponCode: getCheckoutCoupon()?.code,
          idempotencyKey,
        }).unwrap();

        orderIdForPayment = result.order._id;
      }

      setIsRedirectingToPayment(true);

      const paymentResponse = await createPayment({
        orderId: orderIdForPayment,
        name: (shippingContact.name ?? "").trim(),
        phone: (shippingContact.phone ?? "").trim(),
        address: (shippingContact.address ?? "").trim(),
        note: formData.note?.trim(),
        ChoosePayment: paymentMethod,
      }).unwrap();

      if (import.meta.env.DEV && import.meta.env.VITE_DEV_PAY === "true") {
        await devPayOrder(orderIdForPayment).unwrap();
        if (usesCartCheckout) await clearCart();
        navigate("/my-account");
        return;
      }

      if (usesCartCheckout) await clearCart();
      submitPaymentForm(paymentResponse.params);
    } catch (error: unknown) {
      setIsRedirectingToPayment(false);
      showAlert({
        variant: "error",
        message: getErrorMessage(error, "付款初始化失敗，請稍後再試。"),
      });

      if (orderIdForPayment) {
        navigate(`/checkout/${orderIdForPayment}`);
        return;
      }
    }
  });

  // 先檢查是否有選中地址，若沒有則阻止表單送出並顯示錯誤訊息。
  const submitCheckout = (event?: Parameters<typeof submitCheckoutForm>[0]) => {
    if (!useManualAddress && savedAddresses.length > 0 && !hasSelectedAddress) {
      event?.preventDefault();
      showAlert({ variant: "error", message: "請先選擇一個收件地址。" });
      return;
    }

    return submitCheckoutForm(event);
  };

  return {
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
  };
};
