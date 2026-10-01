import { createPortal } from "react-dom";

import Button from "@/components/ui/Button";
import { useConfirmDialogContext } from "@/context/ConfirmDialogContext";

const ConfirmDialog = () => {
  const {
    options,
    isLoading,
    handleConfirm,
    handleCancel,
    close: handleClose,
  } = useConfirmDialogContext();

  if (!options) return null;

  return createPortal(
    <dialog open className="modal">
      <div className="modal-box max-w-md">
        <h3 className="text-lg font-bold">{options.title}</h3>
        <p className="py-4 text-gray-600">{options.message}</p>
        {options.action && (
          <div className="mb-4 rounded-md bg-blue-50 p-3">
            <Button
              variant="link"
              onClick={() => {
                options.action?.onClick();
                handleClose();
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              {options.action.label} →
            </Button>
          </div>
        )}
        <div className="modal-action">
          <Button
            variant="secondary"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {options.cancelText || "取消"}
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "處理中..." : options.confirmText || "確認"}
          </Button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" disabled={isLoading} onClick={handleClose} />
      </form>
    </dialog>,
    document.body
  );
};

export default ConfirmDialog;
