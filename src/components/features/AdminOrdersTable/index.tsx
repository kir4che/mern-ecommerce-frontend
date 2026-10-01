import { Fragment, useRef, useState } from "react";

import ConfirmDeliveryForm from "@/components/forms/ConfirmDeliveryForm";
import OrderDetailPanel from "@/components/features/OrderTableShared/OrderDetailPanel";
import OrderFilterTabs from "@/components/features/OrderTableShared/OrderFilterTabs";
import OrderPagination from "@/components/features/OrderTableShared/OrderPagination";
import SortTh from "@/components/features/OrderTableShared/SortTh";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Loading from "@/components/ui/Loading";
import Modal, { type ModalRef } from "@/components/shared/Modal";
import {
  ORDER_FILTER_OPTIONS,
  ORDER_STATUS_MAP,
} from "@/constants/actionTypes";
import { useAlert } from "@/context/AlertContext";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import { useOrders } from "@/hooks/useOrders";
import { useUpdateOrderMutation } from "@/store/api/apiOrders";
import type { Order, OrderStatus } from "@/types";
import { addComma } from "@/utils/addComma";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  canCancelOrder,
  canShipOrder,
  getCancellationNotice,
  getOrderStatus,
  getPaymentStatusLabel,
  getRefundStatusLabel,
} from "@/utils/getOrderStatus";
import { getResponseMessage } from "@/utils/getResponseMessage";

import ArrowDownIcon from "@/assets/icons/nav-arrow-down.inline.svg?react";
import ArrowUpIcon from "@/assets/icons/nav-arrow-up.inline.svg?react";
import SearchIcon from "@/assets/icons/search.inline.svg?react";

const ORDER_STATUS_COLORS: Record<string, string> = {
  created: "bg-gray-100 text-gray-700",
  paid: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  shipped: "bg-orange-100 text-orange-700",
  delivered: "bg-green-100 text-green-700",
  picked_up: "bg-teal-100 text-teal-700",
  completed: "bg-green-100 text-green-700",
  canceled: "bg-red-100 text-red-700",
  return_requested: "bg-purple-100 text-purple-700",
  returned: "bg-gray-100 text-gray-700",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  unpaid: "text-red-600",
  paid: "text-green-600",
};

const AdminOrdersTable = () => {
  const { showAlert } = useAlert();
  const { open: openConfirmDialog } = useConfirmDialog();

  const {
    orders,
    isLoading,
    error,
    totalPages,
    currentPage,
    filterType,
    sortBy,
    orderBy,
    inputKeyword,
    startDate,
    endDate,
    dateRangeError,
    expandedOrderId,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handleSort,
    handleStartDateChange,
    handleEndDateChange,
    handleToggleExpandOrder,
    refreshOrders,
  } = useOrders(true);
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [shippingTrackingNo, setShippingTrackingNo] = useState<string>("");
  const [shippingCarrier, setShippingCarrier] = useState<string>("黑貓宅急便");

  const confirmModalRef = useRef<ModalRef>(null);

  const openModal = (_modalId: string, order: Order) => {
    setSelectedOrder(order);
    confirmModalRef.current?.showModal();
  };

  const handleDeliverOrder = async () => {
    if (!selectedOrder) return false;

    try {
      await updateOrder({
        id: selectedOrder._id,
        status: "shipped",
        shippingTrackingNo,
      } as Parameters<typeof updateOrder>[0]).unwrap();

      showAlert({ variant: "success", message: "訂單已出貨！" });
      setShippingTrackingNo("");
      setShippingCarrier("黑貓宅急便");
      refreshOrders();

      return true;
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "更新失敗"),
      });

      return false;
    }
  };

  return (
    <>
      <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-center">
        <h3 className="shrink-0 font-bold">訂單管理</h3>
        <div className="flex flex-1 items-center gap-3 max-tablet:flex-col">
          <Input
            value={inputKeyword}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="搜尋訂單編號或商品名稱"
            icon={SearchIcon}
            className="w-full tablet:flex-1 md:max-w-sm"
            aria-label="搜尋訂單"
          />
          <div
            className={cn(
              "flex w-full items-center overflow-hidden rounded border border-gray-300 bg-white tablet:w-auto",
              dateRangeError && "border-red-500"
            )}
          >
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              aria-label="開始日期"
              aria-invalid={!!dateRangeError}
              className="h-8.5 flex-1 px-2 text-[13px] outline-none tablet:h-10 tablet:w-40 tablet:px-4 tablet:text-sm"
            />
            <span className="shrink-0 text-gray-300">-</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              aria-label="結束日期"
              aria-invalid={!!dateRangeError}
              className="h-8.5 flex-1 px-2 text-[13px] outline-none tablet:h-10 tablet:w-40 tablet:px-4 tablet:text-sm"
            />
          </div>
        </div>
      </div>
      {dateRangeError && (
        <p className="-mt-2 mb-4 text-sm text-red-600 lg:text-right">
          {dateRangeError}
        </p>
      )}
      <OrderFilterTabs
        options={ORDER_FILTER_OPTIONS}
        activeFilter={filterType}
        onChange={handleFilterChange}
      />
      {isLoading ? (
        <div className="flex-center h-96">
          <Loading />
        </div>
      ) : error ? (
        <div className="flex-center h-64 flex-col gap-4">
          <p className="text-gray-700">
            {getErrorMessage(error, "載入訂單時發生錯誤")}
          </p>
          <Button variant="secondary" onClick={refreshOrders}>
            載入
          </Button>
        </div>
      ) : dateRangeError ? null : orders.length > 0 ? (
        <>
          <div className="overflow-x-auto border border-gray-200 bg-white">
            <table className="table w-full table-zebra">
              <thead className="bg-gray-100 text-nowrap">
                <tr>
                  <SortTh
                    field="orderNo"
                    label="訂單編號"
                    sortBy={sortBy}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />
                  <th>會員</th>
                  <SortTh
                    field="createdAt"
                    label="成立日期"
                    sortBy={sortBy}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />
                  <th>商品</th>
                  <SortTh
                    field="status"
                    label="訂單狀態"
                    sortBy={sortBy}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />
                  <SortTh
                    field="paymentStatus"
                    label="付款"
                    sortBy={sortBy}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />
                  <SortTh
                    field="totalAmount"
                    label="總金額"
                    sortBy={sortBy}
                    orderBy={orderBy}
                    onSort={handleSort}
                    align="right"
                  />
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: Order) => {
                  const orderStatusLabel = getOrderStatus(order);
                  const paymentStatusLabel = getPaymentStatusLabel(order);
                  const refundStatusLabel = getRefundStatusLabel(order);
                  const cancellationNotice = getCancellationNotice(order);

                  return (
                    <Fragment key={order._id}>
                      <tr className="text-nowrap">
                        <td className="font-mono text-sm">{order.orderNo}</td>
                        <td>
                          {typeof order.userId === "object" &&
                          order.userId !== null ? (
                            <div>
                              <p className="text-sm font-medium">
                                {order.userId.name || "無名稱"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {order.userId.email || "-"}
                              </p>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td className="text-center text-sm">
                          {order.orderItems.length} 件
                        </td>
                        <td>
                          <span
                            className={cn(
                              "badge h-6 border-none text-xs font-medium",
                              ORDER_STATUS_COLORS[order.status] ??
                                "bg-gray-100 text-gray-700"
                            )}
                          >
                            {orderStatusLabel ||
                              ORDER_STATUS_MAP[order.status as OrderStatus] ||
                              order.status}
                          </span>
                        </td>
                        <td>
                          <div className="flex flex-col items-start gap-1">
                            {paymentStatusLabel && (
                              <span
                                className={cn(
                                  "text-xs font-medium",
                                  PAYMENT_STATUS_COLORS[order.paymentStatus] ??
                                    "text-gray-600"
                                )}
                              >
                                {paymentStatusLabel}
                              </span>
                            )}
                            {refundStatusLabel && (
                              <span
                                className={cn(
                                  "badge h-6 border-none text-xs font-medium",
                                  order.refundStatus === "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-green-100 text-green-700"
                                )}
                              >
                                {refundStatusLabel}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-right font-medium text-gray-900">
                          NT$ {addComma(order.totalAmount)}
                        </td>
                        <td className="flex items-center justify-end gap-1 border-none">
                          {canShipOrder(order) && (
                            <Button
                              onClick={() =>
                                openModal("confirmDeliveryModal", order)
                              }
                              disabled={isUpdating}
                              className="rounded-full btn-sm"
                            >
                              出貨
                            </Button>
                          )}
                          {canCancelOrder(order) && (
                            <Button
                              variant="secondary"
                              onClick={() =>
                                openConfirmDialog({
                                  title: "取消訂單",
                                  message: `確定要取消訂單 ${order.orderNo}？`,
                                  confirmText: "取消訂單",
                                  cancelText: "返回",
                                  onConfirm: async () => {
                                    try {
                                      const result = await updateOrder({
                                        id: order._id,
                                        status: "canceled",
                                      }).unwrap();
                                      showAlert({
                                        variant: "success",
                                        message: getResponseMessage(
                                          result,
                                          "訂單已取消"
                                        ),
                                      });
                                      refreshOrders();
                                    } catch (err: unknown) {
                                      showAlert({
                                        variant: "error",
                                        message: getErrorMessage(
                                          err,
                                          "操作失敗"
                                        ),
                                      });
                                    }
                                  },
                                })
                              }
                              disabled={isUpdating}
                              className="rounded-full border-red-200 text-red-500 btn-sm hover:bg-red-50"
                            >
                              取消
                            </Button>
                          )}
                          <Button
                            variant="icon"
                            icon={
                              expandedOrderId === order._id
                                ? ArrowUpIcon
                                : ArrowDownIcon
                            }
                            onClick={() => handleToggleExpandOrder(order._id)}
                            aria-label={
                              expandedOrderId === order._id
                                ? "收合訂單明細"
                                : "查看訂單明細"
                            }
                          />
                        </td>
                      </tr>
                      {expandedOrderId === order._id && (
                        <tr>
                          <td colSpan={8} className="p-0">
                            <OrderDetailPanel
                              order={order}
                              paymentStatusLabel={paymentStatusLabel}
                              refundStatusLabel={refundStatusLabel}
                              cancellationNotice={cancellationNotice}
                            />
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <OrderPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <div className="flex-center h-64 flex-col gap-2 rounded-lg border border-gray-200 bg-gray-100">
          <p className="text-gray-content/60">尚無訂單資訊</p>
        </div>
      )}
      <Modal
        ref={confirmModalRef}
        id="confirmDeliveryModal"
        onConfirm={handleDeliverOrder}
        title="訂單出貨"
        confirmText="確認出貨"
        isShowCloseBtn={false}
        disabled={
          !shippingTrackingNo.trim() ||
          shippingTrackingNo.length > 100 ||
          isUpdating
        }
      >
        {selectedOrder && (
          <ConfirmDeliveryForm
            order={selectedOrder}
            shippingTrackingNo={shippingTrackingNo}
            setShippingTrackingNo={setShippingTrackingNo}
            shippingCarrier={shippingCarrier}
            setShippingCarrier={setShippingCarrier}
          />
        )}
      </Modal>
    </>
  );
};

export default AdminOrdersTable;
