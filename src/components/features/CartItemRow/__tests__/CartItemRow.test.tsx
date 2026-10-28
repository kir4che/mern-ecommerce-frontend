import { fireEvent, render, screen } from "@testing-library/react";

import CartItemRow from "@/components/features/CartItemRow";

vi.mock("@/components/shared/QuantityStepper", () => ({
  default: ({
    value,
    max,
    onChange,
  }: {
    value: number;
    max: number;
    onChange: (next: number) => void;
  }) => (
    <div>
      <span>{value}</span>
      <span>{max}</span>
      <button onClick={() => onChange(value + 1)}>增加</button>
    </div>
  ),
}));

describe("CartItemRow 元件", () => {
  const cartItem = {
    productId: "product-1",
    quantity: 2,
    product: {
      _id: "product-1",
      title: "測試商品",
      countInStock: 8,
      tagline: "tagline",
      categories: ["分類"],
      description: "desc",
      price: 100,
      content: "content",
      expiryDate: "2026-12-31",
      allergens: [],
      delivery: "宅配",
      storage: "常溫",
      ingredients: "ingredients",
      nutrition: "nutrition",
      salesCount: 0,
      tags: [],
      imageUrl: "img.jpg",
    },
  };

  it("在 QuantityStepper 中顯示正確的數量", () => {
    render(<CartItemRow item={cartItem} onChangeQuantity={vi.fn()} />);

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("使用者操作數量變化時，防抖 220ms 後呼叫 onChangeQuantity", () => {
    vi.useFakeTimers();
    const onChangeQuantity = vi.fn();

    render(<CartItemRow item={cartItem} onChangeQuantity={onChangeQuantity} />);

    fireEvent.click(screen.getByRole("button", { name: "增加" }));

    // 尚未滿 220ms 不應呼叫
    expect(onChangeQuantity).not.toHaveBeenCalled();

    // 快轉超過 220ms
    vi.advanceTimersByTime(250);

    expect(onChangeQuantity).toHaveBeenCalledTimes(1);
    expect(onChangeQuantity).toHaveBeenCalledWith("product-1", 3);
    vi.useRealTimers();
  });

  it("外部 item.quantity 更新時，會同步顯示新數量且不觸發 onChangeQuantity（避免回滾覆蓋）", () => {
    vi.useFakeTimers();
    const onChangeQuantity = vi.fn();

    const { rerender } = render(
      <CartItemRow
        item={{ ...cartItem, quantity: 1 }}
        onChangeQuantity={onChangeQuantity}
      />
    );

    expect(screen.getByText("1")).toBeInTheDocument();

    // 模擬外部（推薦商品區點擊加入購物車）使數量增加為 2
    rerender(
      <CartItemRow
        item={{ ...cartItem, quantity: 2 }}
        onChangeQuantity={onChangeQuantity}
      />
    );

    // 畫面應同步更新為 2
    expect(screen.getByText("2")).toBeInTheDocument();

    // 快轉 300ms，確認不會反向把數量覆蓋回舊值。
    vi.advanceTimersByTime(300);

    expect(onChangeQuantity).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("元件卸載時會清理計時器", () => {
    vi.useFakeTimers();
    const onChangeQuantity = vi.fn();

    const { unmount } = render(
      <CartItemRow item={cartItem} onChangeQuantity={onChangeQuantity} />
    );

    fireEvent.click(screen.getByRole("button", { name: "增加" }));

    unmount();

    vi.advanceTimersByTime(300);

    expect(onChangeQuantity).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
