import type { Order } from "@/types";
import {
  canCancelOrder,
  getCancellationNotice,
  getOrderStatus,
  getPaymentStatusLabel,
  getRefundStatusLabel,
} from "@/utils/getOrderStatus";

const order: Order = {
  _id: "order-1",
  orderNo: "NO-1",
  userId: "user-1",
  name: "Test User",
  phone: "0912345678",
  address: "台北市",
  orderItems: [],
  subtotal: 100,
  shippingFee: 60,
  totalAmount: 160,
  status: "processing",
  paymentStatus: "paid",
  refundStatus: "not_required",
  shippingStatus: "pending",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

const makeMockOrder = (patch: Partial<Order> = {}): Order => ({
  ...order,
  ...patch,
});

describe("getOrderStatus 函式", () => {
  it("已取消的訂單顯示已取消", () => {
    expect(
      getOrderStatus(
        makeMockOrder({ status: "canceled", refundStatus: "pending" })
      )
    ).toBe("已取消");
  });

  it("配送中的訂單顯示配送中", () => {
    expect(
      getOrderStatus(makeMockOrder({ shippingStatus: "in_transit" }))
    ).toBe("配送中");
  });

  it("未付款的訂單顯示待付款", () => {
    expect(getOrderStatus(makeMockOrder({ paymentStatus: "unpaid" }))).toBe(
      "待付款"
    );
  });

  it("一般訂單顯示處理中", () => {
    expect(getOrderStatus(order)).toBe("處理中");
  });

  it("一般已付款的訂單顯示付款狀態", () => {
    expect(getPaymentStatusLabel(makeMockOrder({ status: "paid" }))).toBe(
      "已付款"
    );
  });

  it("退款追蹤中的訂單不重複顯示付款狀態", () => {
    expect(
      getPaymentStatusLabel(
        makeMockOrder({ status: "canceled", refundStatus: "pending" })
      )
    ).toBeNull();
  });

  it("只有退款追蹤中的訂單才顯示退款狀態", () => {
    expect(
      getRefundStatusLabel(
        makeMockOrder({
          status: "returned",
          shippingStatus: "returned",
          refundStatus: "refunded",
        })
      )
    ).toBe("已退款");
    expect(getRefundStatusLabel(order)).toBeNull();
  });

  it("已取消且待退款顯示退款提醒", () => {
    expect(
      getCancellationNotice(
        makeMockOrder({ status: "canceled", refundStatus: "pending" })
      )
    ).toBe("此訂單已完成付款，退款將由客服另行處理。");
  });

  it("已退貨且已退款顯示退款完成提醒", () => {
    expect(
      getCancellationNotice(
        makeMockOrder({
          status: "returned",
          shippingStatus: "returned",
          refundStatus: "refunded",
        })
      )
    ).toBe("此訂單已退貨完成，退款已處理完成。");
  });

  it("一般訂單沒有取消提醒", () => {
    expect(getCancellationNotice(order)).toBeNull();
  });

  it("未付款訂單可以取消", () => {
    expect(
      canCancelOrder(
        makeMockOrder({ paymentStatus: "unpaid", status: "created" })
      )
    ).toBe(true);
  });

  it("已付款待出貨訂單可以取消", () => {
    expect(canCancelOrder(makeMockOrder({ status: "paid" }))).toBe(true);
  });

  it("已出貨訂單不能取消", () => {
    expect(
      canCancelOrder(
        makeMockOrder({ status: "shipped", shippingStatus: "in_transit" })
      )
    ).toBe(false);
  });
});
