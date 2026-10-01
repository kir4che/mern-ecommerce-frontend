import type { Order } from "@/types";
import { PAYMENT_STATUS_MAP, REFUND_STATUS_MAP } from "@/constants/actionTypes";

const isRefundTrackedOrder = (order: Order) =>
  order.paymentStatus === "paid" &&
  ["canceled", "returned"].includes(order.status) &&
  !!order.refundStatus &&
  order.refundStatus !== "not_required";

export const getOrderStatus = (order: Order) => {
  if (order.status === "canceled") return "已取消";
  if (order.status === "returned") return "已退貨";
  if (order.status === "completed") return "已完成";
  if (order.shippingStatus === "in_transit") return "配送中";
  if (order.shippingStatus === "delivered") return "待取貨";
  if (order.status === "shipped") return "已出貨";
  if (order.status === "paid") return "已付款";
  if (order.paymentStatus === "unpaid") return "待付款";

  return "處理中";
};

export const canCancelOrder = (order: Order) =>
  order.status !== "canceled" &&
  (order.paymentStatus === "unpaid" ||
    (order.paymentStatus === "paid" &&
      order.shippingStatus === "pending" &&
      order.status === "paid"));

export const canShipOrder = (order: Order) =>
  order.status === "paid" &&
  order.paymentStatus === "paid" &&
  order.shippingStatus === "pending";

export const getPaymentStatusLabel = (order: Order) => {
  if (isRefundTrackedOrder(order)) return null;

  return (
    PAYMENT_STATUS_MAP[
      order.paymentStatus as keyof typeof PAYMENT_STATUS_MAP
    ] || order.paymentStatus
  );
};

export const getRefundStatusLabel = (order: Order) => {
  if (!isRefundTrackedOrder(order)) return null;

  return (
    REFUND_STATUS_MAP[order.refundStatus as keyof typeof REFUND_STATUS_MAP] ||
    order.refundStatus
  );
};

export const getCancellationNotice = (order: Order) => {
  if (order.status === "canceled" && order.refundStatus === "pending")
    return "此訂單已完成付款，退款將由客服另行處理。";

  if (order.status === "canceled" && order.refundStatus === "refunded")
    return "此訂單已取消，退款已處理完成。";

  if (order.status === "returned" && order.refundStatus === "pending")
    return "此訂單已退貨完成，退款將由客服另行處理。";

  if (order.status === "returned" && order.refundStatus === "refunded")
    return "此訂單已退貨完成，退款已處理完成。";

  return null;
};
