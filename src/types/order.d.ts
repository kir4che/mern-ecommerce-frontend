import {
  ORDER_STATUS_MAP,
  PAYMENT_STATUS_MAP,
  REFUND_STATUS_MAP,
  SHIPPING_STATUS_MAP,
} from "@/constants/actionTypes";
import type { BaseResponse } from "./common";

export type OrderStatus = keyof typeof ORDER_STATUS_MAP;
export type PaymentStatus = keyof typeof PAYMENT_STATUS_MAP;
export type RefundStatus = keyof typeof REFUND_STATUS_MAP;
export type ShippingStatus = keyof typeof SHIPPING_STATUS_MAP;

export interface OrderItem {
  _id: string;
  productId: string;
  quantity: number;
  price: number;
  title: string;
  imageUrl?: string;
}

interface OrderUser {
  _id: string;
  name?: string;
  email?: string;
}

export interface Order {
  _id: string;
  orderNo: string;
  userId: string | OrderUser;
  name: string;
  phone: string;
  address: string;
  orderItems: OrderItem[];
  subtotal: number;
  shippingFee: number;
  couponCode?: string;
  discount?: number;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  refundStatus?: RefundStatus;
  shippingStatus: ShippingStatus;
  shippingTrackingNo?: string;
  paymentMethod?: string;
  paymentDate?: string;
  note?: string;
  expiresAt?: string;
  idempotencyKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetOrdersParams {
  page?: number;
  limit?: number;
  status?: string;
  keyword?: string;
  startDate?: string;
  endDate?: string;
  userId?: string;
  sortBy?: string;
  orderBy?: string;
  isAdmin?: boolean;
}

export interface CreateOrderData {
  orderItems: Array<{ productId: string; quantity: number }>;
  couponCode?: string;
  idempotencyKey?: string;
}

export interface UpdateOrderData {
  status?: OrderStatus;
  shippingTrackingNo?: string;
}

export interface OrderDetailResponse extends BaseResponse {
  order: Order;
}

export interface OrdersResponse extends BaseResponse {
  orders: Order[];
  totalOrders: number;
  totalPages: number;
  currentPage: number;
}

export type AnalyticsRange = "7d" | "30d" | "90d" | "12m";

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  completedOrders: number;
}

export interface AdminDashboardStatsResponse extends BaseResponse {
  totalOrders: number;
  pendingOrders: number;
  totalProducts: number;
  activeCoupons: number;
}

export interface AdminOrderAnalyticsResponse extends BaseResponse {
  summary: AnalyticsSummary;
  revenueTrend: Array<{ label: string; revenue: number }>;
  orderTrend: Array<{ label: string; orders: number }>;
  orderStatusDistribution: Array<{ status: OrderStatus; count: number }>;
  topProducts: Array<{
    title: string;
    quantity: number;
    revenue: number;
  }>;
}
