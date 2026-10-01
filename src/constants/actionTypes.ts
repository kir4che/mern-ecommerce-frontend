export const ORDER_STATUS_MAP = {
  created: "已成立",
  paid: "已付款",
  processing: "處理中",
  shipped: "已出貨",
  delivered: "已送達",
  picked_up: "已取貨",
  completed: "已完成",
  canceled: "已取消",
  return_requested: "退貨申請中",
  returned: "已退貨",
} as const;

export const PAYMENT_STATUS_MAP = {
  unpaid: "未付款",
  paid: "已付款",
} as const;

export const REFUND_STATUS_MAP = {
  not_required: "不需退款",
  pending: "待退款",
  refunded: "已退款",
} as const;

export const SHIPPING_STATUS_MAP = {
  pending: "待出貨",
  in_transit: "配送中",
  delivered: "已送達",
  picked_up: "已取貨",
  returning: "退貨中",
  returned: "已退貨",
  canceled: "已取消",
} as const;

export const ORDER_FILTER_OPTIONS = [
  { id: "ALL", value: 0, label: "全部" },
  { id: "UNPAID", value: 1, label: "待付款" },
  { id: "PENDING", value: 2, label: "待出貨" },
  { id: "SHIPPED", value: 3, label: "已出貨" },
  { id: "COMPLETED", value: 4, label: "已完成" },
  { id: "CANCELED", value: 5, label: "已取消" },
] as const;

export const USER_ORDER_FILTER_OPTIONS = [
  { id: "ALL", value: 0, label: "全部" },
  { id: "UNPAID", value: 1, label: "待付款" },
  { id: "PENDING", value: 2, label: "待出貨" },
  { id: "DELIVERED", value: 6, label: "待取貨" },
  { id: "COMPLETED", value: 4, label: "已完成" },
  { id: "CANCELED", value: 5, label: "已取消" },
] as const;
