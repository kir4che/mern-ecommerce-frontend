import { fireEvent, render, screen } from "@testing-library/react";

import Input from "@/components/ui/Input";

describe("Input 元件", () => {
  it("接受 input 值", () => {
    render(<Input label="Test Input" placeholder="Enter text" />);

    const input = screen.getByRole("textbox", { name: "Test Input" });
    fireEvent.change(input, { target: { value: "Test" } });
    expect(input).toHaveValue("Test");
  });

  it("當必填欄位為空時顯示錯誤訊息", () => {
    render(
      <Input
        id="test-input"
        label="Test Required Input"
        error="This field is required"
        required
      />
    );

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("根據 type 驗證輸入", () => {
    render(<Input label="Test Input" type="number" />);

    const input = screen.getByRole("spinbutton", { name: "Test Input" });
    fireEvent.change(input, { target: { value: "abc" } });
    expect(input).toHaveValue(null);

    fireEvent.change(input, { target: { value: "123" } });
    expect(input).toHaveValue(123);
  });

  it("輸入變化時呼叫 onChange", () => {
    const handleChange = vi.fn();
    render(<Input label="Test Input" onChange={handleChange} />);

    fireEvent.change(screen.getByRole("textbox", { name: "Test Input" }), {
      target: { value: "Hello" },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
