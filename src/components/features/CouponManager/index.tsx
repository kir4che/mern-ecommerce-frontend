import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import ManagerTable, {
  type TableColumn,
} from "@/components/features/ManagerTable";
import Modal, { type ModalRef } from "@/components/shared/Modal";
import { useAlert } from "@/context/AlertContext";
import { useConfirmDialog } from "@/context/ConfirmDialogContext";
import {
  useCreateCouponMutation,
  useDeactivateCouponMutation,
  useGetCouponsQuery,
  useUpdateCouponMutation,
} from "@/store/api/apiCoupons";
import type { CreateCouponData } from "@/types";
import type { CouponItem } from "@/types";
import { cn } from "@/utils/cn";
import { getErrorMessage } from "@/utils/getErrorMessage";

import EditIcon from "@/assets/icons/edit.inline.svg?react";
import RefreshIcon from "@/assets/icons/refresh.inline.svg?react";
import CloseIcon from "@/assets/icons/xmark.inline.svg?react";
import PlusIcon from "@/assets/icons/plus.inline.svg?react";

import CouponForm, {
  couponSchema,
  INITIAL_FORM,
  buildCouponPayload,
  type CouponFormInput,
  type CouponFormData,
} from "./CouponForm";

type CouponStatusType = "active" | "inactive" | "expired";

const STATUS_TEXT_MAP: Record<CouponStatusType, string> = {
  active: "啟用中",
  inactive: "已停用",
  expired: "已過期",
};

const STATUS_COLOR_MAP: Record<CouponStatusType, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  expired: "bg-yellow-100 text-yellow-800",
};

const getCouponStatus = (coupon: CouponItem): CouponStatusType => {
  if (!coupon.isActive) return "inactive";
  return new Date(coupon.expiryDate).getTime() < Date.now()
    ? "expired"
    : "active";
};

const CouponManager = () => {
  const { showAlert } = useAlert();
  const { open: openConfirmDialog } = useConfirmDialog();
  const {
    data: couponsData,
    error: couponsError,
    isLoading: couponsLoading,
    isFetching: couponsFetching,
    refetch: refreshCoupons,
  } = useGetCouponsQuery();
  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const [deactivateCoupon] = useDeactivateCouponMutation();

  const [modalMode, setModalMode] = useState<"create" | CouponItem | null>(
    null
  );

  const form = useForm<CouponFormInput, unknown, CouponFormData>({
    defaultValues: INITIAL_FORM,
  });

  const modalRef = useRef<ModalRef>(null);

  const coupons = couponsData?.coupons ?? [];
  const editingCoupon = modalMode !== "create" ? modalMode : null;
  const isEditing = editingCoupon !== null;

  useEffect(() => {
    if (modalMode !== null) modalRef.current?.showModal();
  }, [modalMode]);

  const openCreate = () => {
    form.reset(INITIAL_FORM);
    setModalMode("create");
  };

  const openEdit = (coupon: CouponItem) => {
    form.reset({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchaseAmount: coupon.minPurchaseAmount,
      expiryDate: coupon.expiryDate.includes("T")
        ? coupon.expiryDate.slice(0, 10)
        : coupon.expiryDate,
      isActive: coupon.isActive,
    });
    setModalMode(coupon);
  };

  const handleConfirm = async () => {
    const result = couponSchema.safeParse(form.getValues());
    if (!result.success) {
      showAlert({ variant: "error", message: "請檢查表單欄位" });
      return false;
    }

    try {
      if (isEditing) {
        await updateCoupon({
          id: editingCoupon._id,
          data: buildCouponPayload(result.data) as CreateCouponData,
        }).unwrap();
        showAlert({
          variant: "success",
          message: `優惠碼 ${result.data.code} 已更新。`,
        });
      } else {
        await createCoupon(buildCouponPayload(result.data)).unwrap();
        showAlert({ variant: "success", message: "優惠碼已建立。" });
      }

      return true;
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, isEditing ? "更新失敗" : "新增失敗"),
      });

      return false;
    }
  };

  const handleDelete = (coupon: CouponItem) => {
    openConfirmDialog({
      title: "刪除優惠碼",
      message: `確定要刪除「優惠碼 ${coupon.code}」嗎？`,
      confirmText: "刪除",
      cancelText: "取消",
      onConfirm: async () => {
        try {
          await deactivateCoupon(coupon._id).unwrap();
          await refreshCoupons();
          showAlert({
            variant: "success",
            message: `已刪除優惠碼 ${coupon.code}`,
          });
        } catch (err: unknown) {
          showAlert({
            variant: "error",
            message: getErrorMessage(err, "刪除優惠碼失敗，請稍後再試。"),
          });
        }
      },
    });
  };

  const columns: TableColumn<CouponItem>[] = [
    {
      key: "code",
      label: "優惠碼",
      render: (_, row) => <span className="font-semibold">{row.code}</span>,
      className: "min-w-32 whitespace-nowrap",
    },
    {
      key: "discountType",
      label: "折扣",
      render: (_, row) =>
        row.discountType === "percentage"
          ? `${row.discountValue}%`
          : `NT$ ${row.discountValue}`,
      className: "whitespace-nowrap",
    },
    {
      key: "minPurchaseAmount",
      label: "最低消費",
      render: (value) => `NT$ ${value}`,
      className: "whitespace-nowrap",
    },
    {
      key: "expiryDate",
      label: "到期日",
      render: (value) =>
        new Date(value as string).toLocaleDateString("zh-TW", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
      className: "w-32 whitespace-nowrap",
    },
    {
      key: "isActive",
      label: "狀態",
      render: (_, row) => {
        const status = getCouponStatus(row);
        return (
          <span
            className={cn(
              "badge border-none py-3 badge-sm",
              STATUS_COLOR_MAP[status]
            )}
          >
            {STATUS_TEXT_MAP[status]}
          </span>
        );
      },
      className: "w-28 whitespace-nowrap",
    },
  ];

  if (couponsLoading) return <Loading />;

  if (couponsError) {
    return (
      <div className="flex-center h-48 flex-col gap-4 rounded border border-slate-200 bg-white p-6 text-center shadow-sm">
        <p className="text-base text-gray-600">
          {getErrorMessage(couponsError, "抱歉，暫時無法取得優惠碼資訊")}
        </p>
        <Button
          onClick={refreshCoupons}
          icon={RefreshIcon}
          className="flex h-10 items-center gap-x-2"
          disabled={couponsFetching}
        >
          {couponsFetching ? "載入中" : "重新載入"}
        </Button>
      </div>
    );
  }

  const isLoadingAction = isCreating || isUpdating;

  return (
    <div className="space-y-3">
      <div className="flex-between">
        <h1 className="text-2xl font-bold text-gray-900">優惠碼管理</h1>
        <Button onClick={openCreate} icon={PlusIcon} className="h-9">
          新增優惠碼
        </Button>
      </div>
      <ManagerTable<CouponItem>
        columns={columns}
        data={coupons}
        emptyMessage="尚未建立任何優惠碼"
        renderRowActions={(row) => (
          <div className="flex items-center gap-px">
            <Button
              variant="icon"
              icon={EditIcon}
              onClick={() => openEdit(row)}
              className="rounded-full hover:bg-gray-50"
              aria-label="編輯優惠碼"
            />
            <Button
              variant="icon"
              icon={CloseIcon}
              onClick={() => handleDelete(row)}
              className="rounded-full text-red-600 hover:bg-red-50"
              aria-label="刪除優惠碼"
            />
          </div>
        )}
      />
      <Modal
        ref={modalRef}
        onClose={() => setModalMode(null)}
        title={isEditing ? "編輯優惠碼" : "新增優惠碼"}
        confirmText={isLoadingAction ? "處理中" : isEditing ? "更新" : "新增"}
        onConfirm={handleConfirm}
        disabled={isLoadingAction}
        width="max-w-xl"
      >
        {modalMode !== null && <CouponForm form={form} />}
      </Modal>
    </div>
  );
};

export default CouponManager;
