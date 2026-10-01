import { vi } from "vitest";

import Button from "@/components/ui/Button";
import { render, screen } from "@/test/utils";

describe("Button 元件", () => {
  it("點擊按鈕時觸發 onClick", async () => {
    const handleClick = vi.fn();
    const { user } = render(<Button onClick={handleClick}>加入購物車</Button>);

    await user.click(screen.getByRole("button", { name: "加入購物車" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("disabled 時不觸發 onClick", async () => {
    const handleClick = vi.fn();
    const { user } = render(
      <Button onClick={handleClick} disabled>
        無法點擊
      </Button>
    );

    await user.click(screen.getByRole("button", { name: "無法點擊" }));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
