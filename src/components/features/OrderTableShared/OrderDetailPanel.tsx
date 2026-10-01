import { SHIPPING_STATUS_MAP } from "@/constants/actionTypes";
import type { Order, ShippingStatus } from "@/types";
import { addComma } from "@/utils/addComma";

interface OrderDetailPanelProps {
  order: Order;
  paymentStatusLabel: string | null;
  refundStatusLabel: string | null;
  cancellationNotice: string | null;
  showRecipientInfo?: boolean;
}

const OrderDetailPanel = ({
  order,
  paymentStatusLabel,
  refundStatusLabel,
  cancellationNotice,
  showRecipientInfo = false,
}: OrderDetailPanelProps) => (
  <div className="bg-gray-50/50 px-6 py-4 text-sm">
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className={showRecipientInfo ? "flex h-full flex-col" : undefined}>
        <div>
          <p className="mb-2 font-medium">商品明細</p>
          <ul className="space-y-1">
            {order.orderItems.map((item) => (
              <li key={item.productId} className="flex justify-between gap-4">
                <span className="flex-1 truncate">
                  {item.title} x{item.quantity}
                </span>
                <span className="font-medium">
                  NT$ {addComma(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        {order.note && (
          <div
            className={showRecipientInfo ? "flex flex-1 flex-col pt-4" : "pt-4"}
          >
            <p className="mb-2 font-medium">買家備註</p>
            <p
              className={
                showRecipientInfo
                  ? "flex-1 rounded-md bg-white p-3 text-sm wrap-break-word whitespace-pre-wrap shadow"
                  : "wrap-break-words bg-white p-2 text-sm whitespace-pre-wrap shadow"
              }
            >
              {order.note}
            </p>
          </div>
        )}
        {showRecipientInfo && (
          <div className="pt-4">
            <p className="mb-2 font-medium">收件資訊</p>
            <div className="space-y-1 text-gray-600">
              <p className="text-sm leading-loose">
                {order.name || "未提供姓名"}
              </p>
              <p className="text-sm leading-loose">
                {order.phone || "未提供電話"}
              </p>
              <p className="wrap-break-word">{order.address || "未提供地址"}</p>
            </div>
          </div>
        )}
      </div>
      <div>
        <div>
          <p className="mb-2 font-medium">物流資訊</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>配送進度</span>
              <span>
                {SHIPPING_STATUS_MAP[order.shippingStatus as ShippingStatus] ||
                  order.shippingStatus}
              </span>
            </div>
            {order.shippingTrackingNo && (
              <div className="flex justify-between">
                <span>物流單號</span>
                <span>{order.shippingTrackingNo}</span>
              </div>
            )}
          </div>
        </div>
        <div className="pt-4">
          <p className="mb-2 font-medium">金額明細</p>
          <div className="space-y-1">
            {paymentStatusLabel && (
              <div className="flex justify-between">
                <span>付款狀態</span>
                <span>{paymentStatusLabel}</span>
              </div>
            )}
            {refundStatusLabel && (
              <div className="flex justify-between">
                <span>退款狀態</span>
                <span>{refundStatusLabel}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>商品金額</span>
              <span>NT$ {addComma(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>運費</span>
              <span>
                {order.shippingFee === 0
                  ? "免運費"
                  : `NT$ ${addComma(order.shippingFee)}`}
              </span>
            </div>
            {order.couponCode && (
              <div className="flex justify-between text-green-600">
                <span>優惠碼：{order.couponCode}</span>
                <span className="font-medium">
                  - NT$ {addComma(order.discount)}
                </span>
              </div>
            )}
            {!order.couponCode && (order.discount ?? 0) > 0 && (
              <div className="flex justify-between text-red-600">
                <span>折扣</span>
                <span className="font-medium">
                  - NT$ {addComma(order.discount)}
                </span>
              </div>
            )}
            <hr className="my-3 border-t" />
            <div className="flex justify-between font-medium">
              <span>總金額</span>
              <span>NT$ {addComma(order.totalAmount)}</span>
            </div>
            {cancellationNotice && (
              <p className="mt-3 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-700">
                {cancellationNotice}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default OrderDetailPanel;
