import Modal, { type ModalRef } from "@/components/shared/Modal";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { createRef } from "react";
import { beforeEach, describe, expect, vi } from "vitest";
import { render } from "@/test/utils";

describe("Modal 元件", () => {
  const onConfirm = vi.fn();
  const onClose = vi.fn();

  // 模擬 showModal 與 close 方法，因為 jsdom 不支援 dialog 元素。
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (
      this: HTMLDialogElement
    ) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function (
      this: HTMLDialogElement
    ) {
      this.removeAttribute("open");
    });
  });

  const renderModal = (overrides = {}) => {
    const ref = createRef<ModalRef>();
    render(
      <Modal
        ref={ref}
        id="test-modal"
        onConfirm={onConfirm}
        onClose={onClose}
        title="標題"
        {...overrides}
      >
        <p>內容</p>
      </Modal>
    );
    return { ref };
  };

  it("呼叫 showModal 後渲染標題", async () => {
    const { ref } = renderModal();
    await act(() => ref.current?.showModal());
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "標題" })).toBeInTheDocument();
    });
  });

  it("點擊確認按鈕時呼叫 onConfirm", async () => {
    const { ref } = renderModal();
    await act(() => ref.current?.showModal());
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "確認" })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: "確認" }));
    expect(onConfirm).toHaveBeenCalled();
  });

  it("點擊取消按鈕時呼叫 onClose", async () => {
    const { ref } = renderModal();
    await act(() => ref.current?.showModal());
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "取消" })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: "取消" }));
    expect(onClose).toHaveBeenCalled();
  });

  it("onConfirm 回傳假值時不關閉", async () => {
    const onConfirmFalse = vi.fn(() => false);
    const ref = createRef<ModalRef>();
    render(
      <Modal
        ref={ref}
        id="test-modal-2"
        onConfirm={onConfirmFalse}
        onClose={onClose}
        title="標題 2"
      >
        <p>內容 2</p>
      </Modal>
    );
    await act(() => ref.current?.showModal());
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "標題 2" })
      ).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: "確認" }));
    expect(onConfirmFalse).toHaveBeenCalled();
    expect(screen.getByRole("heading", { name: "標題 2" })).toBeInTheDocument();
  });

  it("點擊外部時呼叫 onClose", async () => {
    const { ref } = renderModal();
    await act(() => ref.current?.showModal());
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "標題" })).toBeInTheDocument();
    });
    const dialog = document.querySelector("dialog") as HTMLElement;
    fireEvent.click(dialog);
    expect(onClose).toHaveBeenCalled();
  });
});
