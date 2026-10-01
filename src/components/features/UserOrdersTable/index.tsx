import { Fragment, useState } from "react";
import { useNavigate } from "react-router";

import OrderDetailPanel from "@/components/features/OrderTableShared/OrderDetailPanel";
import OrderFilterTabs from "@/components/features/OrderTableShared/OrderFilterTabs";
import OrderPagination from "@/components/features/OrderTableShared/OrderPagination";
import SortTh from "@/components/features/OrderTableShared/SortTh";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { USER_ORDER_FILTER_OPTIONS } from "@/constants/actionTypes";
import { useAlert } from "@/context/AlertContext";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import { useOrders } from "@/hooks/useOrders";
import {
  useCancelOrderMutation,
  useUpdateOrderMutation,
} from "@/store/api/apiOrders";
import type { Order } from "@/types";
import { addComma } from "@/utils/addComma";
import { cn } from "@/utils/cn";
import { formatDate } from "@/utils/formatDate";
import { getErrorMessage } from "@/utils/getErrorMessage";
import {
  canCancelOrder,
  getCancellationNotice,
  getOrderStatus,
  getPaymentStatusLabel,
  getRefundStatusLabel,
} from "@/utils/getOrderStatus";
import { getResponseMessage } from "@/utils/getResponseMessage";

import ArrowDownIcon from "@/assets/icons/nav-arrow-down.inline.svg?react";
import ArrowUpIcon from "@/assets/icons/nav-arrow-up.inline.svg?react";
import SearchIcon from "@/assets/icons/search.inline.svg?react";

const getOrderStatusBadgeClass = (order: Order) => {
  if (order.status === "canceled") return "bg-red-100 text-red-700";
  if (order.status === "completed") return "bg-green-100 text-green-700";
  if (order.shippingStatus === "delivered") return "bg-teal-100 text-teal-700";
  if (order.shippingStatus === "in_transit")
    return "bg-orange-100 text-orange-700";
  if (order.status === "paid") return "bg-blue-100 text-blue-700";
  if (order.paymentStatus === "unpaid") return "bg-amber-100 text-amber-700";

  return "bg-gray-100 text-gray-700";
};

const UserOrdersTable = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const confirmDialog = useConfirmDialog();

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
    expandedOrderId,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
    handleSort,
    handleToggleExpandOrder,
    refreshOrders,
  } = useOrders(false);

  const [updateOrder] = useUpdateOrderMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const handleCompleteOrder = async (orderId: string) => {
    if (loadingOrderId) return;
    setLoadingOrderId(orderId);

    try {
      await updateOrder({
        id: orderId,
        status: "completed",
      }).unwrap();

      showAlert({ variant: "success", message: "訂單已完成！" });
      refreshOrders();
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "更新失敗"),
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (loadingOrderId) return;
    setLoadingOrderId(orderId);

    try {
      const result = await cancelOrder(orderId).unwrap();
      showAlert({
        variant: "success",
        message: getResponseMessage(result, "訂單已取消"),
      });
      refreshOrders();
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "取消失敗"),
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  return (
    <>
      <Input
        value={inputKeyword}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="搜尋訂單編號或商品名稱"
        icon={SearchIcon}
        className="mb-4 max-w-sm"
        aria-label="搜尋訂單"
      />
      <OrderFilterTabs
        options={USER_ORDER_FILTER_OPTIONS}
        activeFilter={filterType}
        onChange={handleFilterChange}
      />
      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-4 py-3">
              <div className="h-5 w-28 skeleton" />
              <div className="h-5 w-24 skeleton" />
              <div className="h-5 w-20 skeleton" />
              <div className="ml-auto h-5 w-16 skeleton" />
              <div className="h-5 w-8 skeleton" />
            </div>
          ))}
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
      ) : orders.length > 0 ? (
        <>
          <div className="overflow-x-auto border border-gray-200">
            <table className="table w-full table-zebra">
              <thead className="bg-gray-100 text-nowrap">
                <tr>
                  <th>訂單編號</th>
                  <SortTh
                    field="createdAt"
                    label="成立日期"
                    sortBy={sortBy}
                    orderBy={orderBy}
                    onSort={handleSort}
                  />
                  <th>訂單狀態</th>
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
                  const orderStatus = getOrderStatus(order);
                  const cancellationNotice = getCancellationNotice(order);
                  const paymentStatusLabel = getPaymentStatusLabel(order);
                  const refundStatusLabel = getRefundStatusLabel(order);

                  return (
                    <Fragment key={order._id}>
                      <tr className="text-nowrap">
                        <td>{order.orderNo}</td>
                        <td>{formatDate(order.createdAt)}</td>
                        <td>
                          <div className="flex flex-col items-start gap-0.5">
                            <span
                              className={cn(
                                "badge h-6 border-none text-xs font-medium",
                                getOrderStatusBadgeClass(order)
                              )}
                            >
                              {orderStatus}
                            </span>
                            {refundStatusLabel && (
                              <span
                                className={cn(
                                  "text-xs font-medium",
                                  order.refundStatus === "pending"
                                    ? "text-amber-700"
                                    : "text-emerald-700"
                                )}
                              >
                                {refundStatusLabel === "待退款"
                                  ? "退款處理中"
                                  : "退款已完成"}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="text-right font-medium text-primary">
                          NT$ {addComma(order.totalAmount)}
                        </td>
                        <td className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {canCancelOrder(order) &&
                              (order.paymentStatus === "unpaid" ? (
                                <div className="flex items-center gap-1">
                                  <Button
                                    onClick={() => {
                                      confirmDialog.open({
                                        title: "取消訂單",
                                        message:
                                          "確定要取消此訂單嗎？取消後無法復原。",
                                        confirmText: "確認取消訂單",
                                        cancelText: "保留訂單",
                                        onConfirm: () =>
                                          handleCancelOrder(order._id),
                                      });
                                    }}
                                    disabled={loadingOrderId !== null}
                                    className="h-8 rounded-full border-gray-200 bg-white text-xs text-gray-800 shadow hover:border-gray-300 hover:bg-gray-100"
                                  >
                                    {loadingOrderId === order._id
                                      ? "處理中..."
                                      : "取消"}
                                  </Button>
                                  <Button
                                    onClick={() =>
                                      navigate(`/checkout/${order._id}`)
                                    }
                                    className="h-8 rounded-full border-none bg-orange-500 text-xs shadow hover:bg-orange-600"
                                  >
                                    前往付款
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  onClick={() => {
                                    confirmDialog.open({
                                      title: "取消訂單",
                                      message:
                                        "確定要取消此訂單嗎？取消後無法復原。",
                                      confirmText: "確認取消訂單",
                                      cancelText: "保留訂單",
                                      onConfirm: () =>
                                        handleCancelOrder(order._id),
                                    });
                                  }}
                                  disabled={loadingOrderId !== null}
                                  className="h-8 rounded-full border-gray-200 bg-white text-xs text-gray-800 shadow hover:border-gray-300 hover:bg-gray-100"
                                >
                                  {loadingOrderId === order._id
                                    ? "處理中..."
                                    : "取消"}
                                </Button>
                              ))}
                            {order.shippingStatus === "delivered" &&
                              !["completed", "canceled", "returned"].includes(
                                order.status
                              ) && (
                                <Button
                                  onClick={() => {
                                    confirmDialog.open({
                                      title: "完成訂單",
                                      message:
                                        "確認收到商品無誤，再按下「確認完成」以完成訂單。",
                                      confirmText: "確認完成",
                                      onConfirm: () =>
                                        handleCompleteOrder(order._id),
                                    });
                                  }}
                                  disabled={loadingOrderId !== null}
                                  className="h-8.5 rounded-full text-xs"
                                >
                                  {loadingOrderId === order._id
                                    ? "處理中..."
                                    : "完成訂單"}
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
                          </div>
                        </td>
                      </tr>
                      {expandedOrderId === order._id && (
                        <tr>
                          <td colSpan={5} className="border-b-0 p-0">
                            <OrderDetailPanel
                              order={order}
                              paymentStatusLabel={paymentStatusLabel}
                              refundStatusLabel={refundStatusLabel}
                              cancellationNotice={cancellationNotice}
                              showRecipientInfo
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
    </>
  );
};

export default UserOrdersTable;
