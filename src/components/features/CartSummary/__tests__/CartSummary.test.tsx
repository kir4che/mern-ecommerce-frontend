import { screen } from "@testing-library/react";
import { vi } from "vitest";
import CartSummary from "@/components/features/CartSummary";
import { render } from "@/test/utils";

const defaultProps = {
  hasItems: true,
  totalQuantity: 3,
  subtotal: 1500,
  shippingInfo: { message: "可享免運", progress: 50, shippingFee: 0 },
  finalAmount: 1500,
  coupon: { input: "", code: "", message: null },
  couponDiscount: 0,
  hasAppliedCoupon: false,
  isValidatingCoupon: false,
  setCouponInput: vi.fn(),
  handleApplyCoupon: vi.fn(),
  handleRemoveCoupon: vi.fn(),
  handleCheckout: vi.fn(),
};

describe("CartSummary 元件", () => {
  it("運費為 0 時顯示免運費", () => {
    render(<CartSummary {...defaultProps} />);
    expect(screen.getByText("免運費")).toBeInTheDocument();
  });

  it("運費不為 0 時顯示金額", () => {
    render(
      <CartSummary
        {...defaultProps}
        shippingInfo={{ message: "", progress: 0, shippingFee: 100 }}
      />
    );
    expect(screen.getByText("NT$ 100")).toBeInTheDocument();
  });

  it("套用優惠券後顯示折扣與移除按鈕", () => {
    render(
      <CartSummary
        {...defaultProps}
        hasAppliedCoupon
        couponDiscount={100}
        coupon={{ input: "SAVE100", code: "SAVE100", message: null }}
      />
    );
    expect(screen.getByText("- NT$ 100")).toBeInTheDocument();
    expect(screen.getByText("移除")).toBeInTheDocument();
  });

  it("點擊結帳觸發 handleCheckout", async () => {
    const { user } = render(<CartSummary {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: "前往結帳" }));
    expect(defaultProps.handleCheckout).toHaveBeenCalledOnce();
  });
});
