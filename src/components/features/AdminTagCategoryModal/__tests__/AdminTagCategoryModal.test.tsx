import { vi } from "vitest";
import type { ModalRef } from "@/components/shared/Modal";
import AdminTagCategoryModal from "@/components/features/AdminTagCategoryModal";
import { render, screen } from "@/test/utils";

vi.mock("@/components/shared/Modal", () => ({
  default: ({
    title,
    children,
  }: {
    title?: string;
    children?: React.ReactNode;
  }) => (
    <div>
      {title ? <h2>{title}</h2> : null}
      {children}
    </div>
  ),
}));

const mockModalRef = {
  current: { showModal: vi.fn(), close: vi.fn() },
} as unknown as React.RefObject<ModalRef | null>;

const defaultProps = {
  modalRef: mockModalRef,
  modalType: "create" as const,
  formData: { name: "測試", slug: "test", isActive: true },
  formErrors: {} as Record<string, string | undefined>,
  onChange: vi.fn(),
  onSubmit: vi.fn().mockResolvedValue(true),
  onClose: vi.fn(),
  entityName: "標籤",
};

describe("AdminTagCategoryModal 元件", () => {
  it("create 模式顯示標題與基本欄位", () => {
    render(<AdminTagCategoryModal {...defaultProps} />);

    expect(
      screen.getByRole("heading", { name: "新增標籤" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/名稱/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Slug/)).toBeInTheDocument();
  });

  it("showSortOrder 為 true 時顯示排序欄位", () => {
    render(<AdminTagCategoryModal {...defaultProps} showSortOrder />);

    expect(
      screen.getByRole("spinbutton", { name: /顯示順序/ })
    ).toBeInTheDocument();
  });
});
