import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { type Mock, vi } from "vitest";
import ConfirmDialog from "@/components/shared/ConfirmDialog";
import {
  ConfirmDialogProvider,
  useConfirmDialog,
  type ConfirmDialogOptions,
} from "@/context/ConfirmDialogContext";

const openDialog = async (overrides?: Partial<ConfirmDialogOptions>) => {
  const options: ConfirmDialogOptions = {
    title: "刪除確認",
    message: "確定要刪除嗎？",
    confirmText: "刪除",
    cancelText: "取消",
    ...overrides,
  };

  const TestOpener = () => {
    const { open } = useConfirmDialog();
    return (
      <button type="button" onClick={() => open(options)}>
        開啟對話框
      </button>
    );
  };

  render(
    <ConfirmDialogProvider>
      <TestOpener />
      <ConfirmDialog />
    </ConfirmDialogProvider>
  );
  const user = userEvent.setup();
  await user.click(screen.getByRole("button", { name: "開啟對話框" }));
  return { user };
};

describe("ConfirmDialog 元件", () => {
  it("打開時顯示標題與訊息", async () => {
    await openDialog();
    expect(
      screen.getByRole("heading", { name: "刪除確認" })
    ).toBeInTheDocument();
    expect(screen.getByText("確定要刪除嗎？")).toBeInTheDocument();
  });

  it("點擊取消呼叫 onCancel 並關閉", async () => {
    const onCancel = vi.fn(() => {});
    const { user } = await openDialog({ onCancel });
    await user.click(screen.getByRole("button", { name: "取消" }));
    expect(onCancel).toHaveBeenCalledOnce();
    expect(
      screen.queryByRole("heading", { name: "刪除確認" })
    ).not.toBeInTheDocument();
  });

  it("點擊確認執行 onConfirm", async () => {
    const onConfirm = vi.fn();
    const { user } = await openDialog({ onConfirm });
    await user.click(screen.getByRole("button", { name: "刪除" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("載入中時按鈕為 disabled", async () => {
    const onConfirm = vi.fn(() => new Promise(() => {})) as Mock<
      () => Promise<void>
    >;
    const { user } = await openDialog({ onConfirm });
    await user.click(screen.getByRole("button", { name: "刪除" }));
    expect(screen.getByRole("button", { name: /處理中/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "取消" })).toBeDisabled();
  });
});
