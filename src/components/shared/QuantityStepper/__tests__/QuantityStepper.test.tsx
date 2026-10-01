import { fireEvent, render, screen } from "@testing-library/react";

import QuantityStepper from "@/components/shared/QuantityStepper";

describe("QuantityStepper 元件", () => {
  it("點擊增減按鈕時呼叫 onChange 並傳入正確的值", () => {
    const onChange = vi.fn();

    render(<QuantityStepper value={2} min={1} max={5} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "增加數量" }));
    fireEvent.click(screen.getByRole("button", { name: "減少數量" }));

    expect(onChange).toHaveBeenNthCalledWith(1, 3);
    expect(onChange).toHaveBeenNthCalledWith(2, 1);
  });

  it("將輸入的值限制至最大值", () => {
    const onChange = vi.fn();

    render(<QuantityStepper value={2} min={1} max={5} onChange={onChange} />);

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "10" },
    });

    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("忽略非數字輸入", () => {
    const onChange = vi.fn();

    render(<QuantityStepper value={2} min={1} max={5} onChange={onChange} />);

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "" },
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("disabled 為真時 disabled 控制項", () => {
    render(
      <QuantityStepper value={2} min={1} max={5} onChange={vi.fn()} disabled />
    );

    expect(screen.getByRole("button", { name: "減少數量" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "增加數量" })).toBeDisabled();
    expect(screen.getByRole("spinbutton")).toBeDisabled();
  });
});
