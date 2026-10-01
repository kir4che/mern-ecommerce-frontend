import { beforeEach, vi } from "vitest";

import ProductActionForm from "@/components/shared/ProductActionForm";
import { useCart } from "@/hooks/useCart";
import { makeMockProduct, render, screen } from "@/test/utils";

vi.mock("@/hooks/useCart", () => ({
  useCart: vi.fn(),
}));

vi.mock("@/components/shared/AddToCartBtn", () => ({
  default: ({
    quantity = 1,
    onAddSuccess,
  }: {
    quantity?: number;
    onAddSuccess?: () => void;
  }) => (
    <div>
      <p>加入數量：{quantity}</p>
      <button onClick={() => onAddSuccess?.()}>模擬加入成功</button>
    </div>
  ),
}));

const mockUseCart = vi.mocked(useCart);

const product = makeMockProduct({ countInStock: 5 });

const createCartState = (
  overrides?: Partial<ReturnType<typeof useCart>>
): ReturnType<typeof useCart> => ({
  cart: [],
  removedInvalidCount: 0,
  overLimitAdjustedCount: 0,
  addToCart: vi.fn(),
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

describe("ProductActionForm 元件", () => {
  // 每個測試前重置 useCart 的 mock 回傳值
  beforeEach(() => {
    mockUseCart.mockReturnValue(createCartState());
  });

  it("card 模式在加入成功後會把數量重設為 1", async () => {
    const { user } = render(
      <ProductActionForm
        product={{ ...product, countInStock: 2 }}
        variant="card"
      />
    );

    const quantityInput = screen.getByRole("spinbutton");
    await user.clear(quantityInput);
    await user.type(quantityInput, "2");

    expect(screen.getByText(/加入數量：2/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "模擬加入成功" }));

    expect(screen.getByText(/加入數量：1/)).toBeInTheDocument();
  });

  it("detail 模式在無可用庫存時會停用增加按鈕", () => {
    mockUseCart.mockReturnValue(
      createCartState({
        cart: [
          {
            productId: product._id,
            quantity: 5, // 加入購物車的數量已達庫存上限
            product,
          },
        ],
      })
    );

    render(<ProductActionForm product={product} variant="detail" />);

    expect(screen.getByRole("spinbutton")).toHaveAttribute("max", "0");
    expect(screen.getByRole("button", { name: "增加數量" })).toBeDisabled();
  });
});
