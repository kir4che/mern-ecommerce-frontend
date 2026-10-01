import { useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";

import Button from "@/components/ui/Button";
import { cn } from "@/utils/cn";
import { useAlert } from "@/context/AlertContext";

import CloseIcon from "@/assets/icons/xmark.inline.svg?react";

export interface ModalRef {
  showModal: () => void;
  close: () => void;
}

interface ModalProps {
  ref?: React.Ref<ModalRef>;
  id?: string;
  onConfirm?: () => void | boolean | Promise<void | boolean>;
  onClose?: () => void;
  title?: string;
  confirmText?: string;
  width?: string;
  className?: string;
  isShowCloseIcon?: boolean;
  isShowCloseBtn?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

const Modal = ({
  ref,
  id,
  onConfirm,
  onClose,
  title,
  confirmText = "確認",
  width = "max-w-lg",
  className = "",
  isShowCloseIcon = false,
  isShowCloseBtn = true,
  isLoading = false,
  disabled = false,
  children,
}: ModalProps) => {
  const { showAlert } = useAlert();

  const dialogRef = useRef<HTMLDialogElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // 將 ref 轉交給父元件，讓父元件可以控制 modal 開關。
  useImperativeHandle(ref, () => ({
    showModal: () => {
      previousActiveElement.current = document.activeElement;
      dialogRef.current?.showModal();
    },
    close: () => {
      dialogRef.current?.close();
    },
  }));

  const handleClose = useCallback(() => {
    if (isLoading) return;

    dialogRef.current?.close();
    onClose?.();
    (previousActiveElement.current as HTMLElement)?.focus?.();
  }, [isLoading, onClose]);

  // 避免 loading 時關閉 modal
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const handleCancel = (e: Event) => {
      if (isLoading) e.preventDefault();
      else handleClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [isLoading, handleClose]);

  const handleConfirm = async () => {
    if (isLoading) return;

    try {
      const isSuccess = (await onConfirm?.()) ?? true;
      if (isSuccess) handleClose();
    } catch {
      showAlert({ variant: "error", message: "操作失敗，請稍後再試" });
    }
  };

  return createPortal(
    <dialog
      id={id}
      ref={dialogRef}
      className="modal"
      onClick={(e) => {
        if (e.target === dialogRef.current) handleClose();
      }}
    >
      <div className={cn("modal-box", width, className)}>
        {(title || isShowCloseIcon) && (
          <div
            className={cn(
              "flex-between",
              children ? "border-b border-gray-100 pb-4" : ""
            )}
          >
            {title && <h3 className="text-lg font-bold">{title}</h3>}
            {isShowCloseIcon && (
              <Button
                variant="icon"
                icon={CloseIcon}
                onClick={handleClose}
                disabled={isLoading}
                className={cn(!title && "ml-auto")}
              />
            )}
          </div>
        )}
        {children && (
          <div className="max-h-[60vh] overflow-y-auto py-4">{children}</div>
        )}
        <div
          className={cn(
            "flex justify-end gap-3",
            children && "border-t border-gray-100 pt-4"
          )}
        >
          {isShowCloseBtn && (
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={disabled || isLoading}
            >
              取消
            </Button>
          )}
          {onConfirm && (
            <Button onClick={handleConfirm} disabled={disabled || isLoading}>
              {confirmText}
            </Button>
          )}
        </div>
      </div>
    </dialog>,
    document.body
  );
};

export default Modal;
