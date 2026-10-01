import { fireEvent, render, screen } from "@testing-library/react";

import BlurImage from "@/components/ui/BlurImage";

const testSrc = "test-image.jpg";
const testAlt = "Test Image";

describe("BlurImage 元件", () => {
  it("圖片載入前顯示 Skeleton 並隱藏圖片", () => {
    render(<BlurImage src={testSrc} alt={testAlt} />);

    const skeleton = screen.getByRole("status", { name: "圖片載入中" });
    expect(skeleton).toHaveClass("skeleton");

    const image = screen.getByRole("img", { name: testAlt });
    expect(image).toHaveClass("opacity-0");
  });

  it("當圖片順利載入後，應隱藏 Skeleton 並顯示圖片", () => {
    render(<BlurImage src={testSrc} alt={testAlt} />);

    const image = screen.getByRole("img", { name: testAlt });
    fireEvent.load(image); // 觸發圖片載入事件

    expect(
      screen.queryByRole("status", { name: "圖片載入中" })
    ).not.toBeInTheDocument();
    expect(image).toHaveClass("opacity-100");
    expect(image).not.toHaveClass("opacity-0");
  });
});
