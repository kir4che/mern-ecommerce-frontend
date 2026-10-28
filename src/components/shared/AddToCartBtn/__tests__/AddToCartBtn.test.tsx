import { beforeEach, describe, expect, it, vi } from "vitest";

import AddToCartBtn from "@/components/shared/AddToCartBtn";
import { useAlert } from "@/context/AlertContext";
import { useCart } from "@/hooks/useCart";
import { makeMockProduct, render, screen } from "@/test/utils";

vi.mock("@/hooks/useCart", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/context/AlertContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/context/AlertContext")>();
  return {
    ...actual,
    useAlert: vi.fn(),
  };
});

const mockUseCart = vi.mocked(useCart);
const mockUseAlert = vi.mocked(useAlert);

const mockShowAlert = vi.fn();
const mockAddToCart = vi.fn().mockResolvedValue(undefined);

const createCartState = (
  overrides?: Partial<ReturnType<typeof useCart>>
): ReturnType<typeof useCart> => ({
  cart: [],
  removedInvalidCount: 0,
  overLimitAdjustedCount: 0,
  addToCart: mockAddToCart,
  isLoading: false,
  error: null,
  totalQuantity: 0,
  subtotal: 0,
  shippingInfo: {
    isFreeShipping: false,
    shippingFee: 60,
    message: "",
    threshold: 500,
    progress: 0,
  },
  removeFromCart: vi.fn(),
  changeQuantity: vi.fn(),
  clearCart: vi.fn(),
  refetchCart: vi.fn(),
  ...overrides,
});

const product = makeMockProduct({ countInStock: 5 });

describe("AddToCartBtn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCart.mockReturnValue(createCartState());
    mockUseAlert.mockReturnValue({
      showAlert: mockShowAlert,
      hideAlert: vi.fn(),
    });
  });

  it("未加入過時點擊加入購物車會呼叫 addToCart", async () => {
    const { user } = render(
      <AddToCartBtn btnType="text" product={product} quantity={1} />
    );

    const button = screen.getByRole("button", { name: "加入購物車" });
    await user.click(button);

    expect(mockAddToCart).toHaveBeenCalledWith(
      product._id,
      1,
      expect.objectContaining({ _id: product._id })
    );
  });

  it("已加入且未達庫存時點擊，仍可成功增加數量", async () => {
    mockUseCart.mockReturnValue(
      createCartState({
        cart: [
          {
            productId: product._id,
            quantity: 1,
            product,
          },
        ],
      })
    );

    const { user } = render(
      <AddToCartBtn btnType="text" product={product} quantity={1} />
    );

    const button = screen.getByRole("button", { name: "加入購物車" });
    await user.click(button);

    expect(mockAddToCart).toHaveBeenCalledWith(
      product._id,
      1,
      expect.objectContaining({ _id: product._id })
    );
  });

  it("超過可用庫存時跳出 warning alert 且不呼叫 addToCart", async () => {
    mockUseCart.mockReturnValue(
      createCartState({
        cart: [
          {
            productId: product._id,
            quantity: 5, // 已達庫存 5
            product,
          },
        ],
      })
    );

    const { user } = render(
      <AddToCartBtn btnType="text" product={product} quantity={1} />
    );

    const button = screen.getByRole("button", { name: "加入購物車" });
    await user.click(button);

    expect(mockShowAlert).toHaveBeenCalledWith(
      expect.objectContaining({
        variant: "warning",
      })
    );
    expect(mockAddToCart).not.toHaveBeenCalled();
  });

  it("庫存為 0 時按鈕為 disabled 且顯示補貨中", () => {
    render(
      <AddToCartBtn
        btnType="text"
        product={{ ...product, countInStock: 0 }}
        quantity={1}
      />
    );

    const button = screen.getByRole("button", { name: "加入購物車" });
    expect(button).toBeDisabled();
    expect(screen.getByText("補貨中")).toBeInTheDocument();
  });

  it("加入成功顯示『已加入』期間按鈕為 disabled 且無法再次點擊", async () => {
    const { user } = render(
      <AddToCartBtn btnType="text" product={product} quantity={1} />
    );

    const button = screen.getByRole("button", { name: "加入購物車" });
    await user.click(button);

    expect(mockAddToCart).toHaveBeenCalledTimes(1);

    // 進入已加入狀態
    expect(screen.getByText("已加入")).toBeInTheDocument();
    expect(button).toBeDisabled();

    // 再次點擊不應再觸發 addToCart
    await user.click(button);
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
  });
});
