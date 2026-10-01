import { fireEvent, render, screen } from "@testing-library/react";

import ProductImg from "@/components/ui/ProductImg";
import { makeMockProduct } from "@/test/utils";

describe("ProductImg 元件", () => {
  const product = makeMockProduct({
    imageUrl: "https://example.com/product.jpg",
  });

  it("無標題時使用預設 alt 文字", () => {
    render(<ProductImg product={{ imageUrl: "test.jpg" }} />);

    const image = screen.getByRole("img", { name: "商品圖片" });
    expect(image).toBeInTheDocument();
  });

  it("圖片載入失敗時顯示 fallback 圖片", () => {
    render(<ProductImg product={product} />);

    const image = screen.getByRole("img");
    fireEvent.error(image);

    expect(image).toHaveAttribute(
      "src",
      "https://placehold.co/300x300?text=No+Image"
    );
  });

  it("圖片載入成功時顯示原始圖片", () => {
    render(<ProductImg product={product} />);

    const image = screen.getByRole("img");
    fireEvent.load(image);

    expect(image).toHaveAttribute("src", product.imageUrl);
  });
});
