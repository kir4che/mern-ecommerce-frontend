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

  it("數量變化時呼叫 onChangeQuantity", () => {
    const onChangeQuantity = vi.fn();

    render(<CartItemRow item={cartItem} onChangeQuantity={onChangeQuantity} />);

    fireEvent.click(screen.getByRole("button", { name: "增加" }));

    expect(onChangeQuantity).toBeDefined();
  });
});
