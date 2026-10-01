import { render, screen } from "@/test/utils";
import { vi } from "vitest";

vi.mock("@/hooks/useOrders", () => ({
  useOrders: vi.fn(),
}));

vi.mock("@/store/api/apiOrders", () => ({
  useUpdateOrderMutation: vi.fn(),
}));

import type { Mock } from "vitest";
import { useOrders } from "@/hooks/useOrders";
import { useUpdateOrderMutation } from "@/store/api/apiOrders";
import AdminOrdersTable from "@/components/features/AdminOrdersTable";

const mockOrder = {
  _id: "ord1",
  orderNo: "O20250101001",
  userId: { _id: "u1", name: "Test User", email: "test@test.com" },
  orderItems: [{ productId: "p1", title: "蛋糕", quantity: 2, price: 300 }],
  subtotal: 600,
  shippingFee: 0,
  discount: 0,
  totalAmount: 600,
  status: "paid" as const,
  paymentStatus: "paid" as const,
  shippingStatus: "pending" as const,
  createdAt: "2025-01-01T00:00:00.000Z",
  updatedAt: "2025-01-01T00:00:00.000Z",
};

const mockOrders = [mockOrder];

const renderTable = (overrides?: Record<string, unknown>) => {
  (useOrders as unknown as Mock).mockReturnValue({
    orders: mockOrders,
    isLoading: false,
    error: null,
    totalPages: 1,
    currentPage: 1,
    filterType: 0,
    sortBy: "createdAt",
    orderBy: "desc",
    inputKeyword: "",
    expandedOrderId: null,
    handleSearchChange: vi.fn(),
    handleFilterChange: vi.fn(),
    handlePageChange: vi.fn(),
    handleSort: vi.fn(),
    handleToggleExpandOrder: vi.fn(),
    refreshOrders: vi.fn(),
    ...overrides,
  });
  (useUpdateOrderMutation as unknown as Mock).mockReturnValue([
    vi.fn(),
    { isLoading: false },
  ]);

  return render(<AdminOrdersTable />);
};

describe("AdminOrdersTable", () => {
  it("error 時顯示錯誤與載入按鈕", () => {
    renderTable({ error: { message: "error" }, orders: [] });
    expect(screen.getByRole("button", { name: "載入" })).toBeInTheDocument();
  });

  it("空資料時顯示無訂單", () => {
    renderTable({ orders: [] });
    expect(screen.getByText("尚無訂單資訊")).toBeInTheDocument();
  });

  it("paid 狀態訂單顯示出貨按鈕", () => {
    renderTable();
    expect(screen.getByRole("button", { name: "出貨" })).toBeInTheDocument();
  });

  it("paid 狀態訂單顯示取消按鈕", () => {
    renderTable();
    expect(screen.getByRole("button", { name: "取消" })).toBeInTheDocument();
  });
});
