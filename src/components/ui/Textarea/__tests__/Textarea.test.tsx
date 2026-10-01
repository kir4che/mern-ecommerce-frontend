import { fireEvent, render, screen } from "@testing-library/react";

import Textarea from "@/components/ui/Textarea";

describe("Textarea 元件", () => {
  it("接受 input 值", () => {
    render(<Textarea label="Test Textarea" />);

    const textarea = screen.getByRole("textbox", { name: "Test Textarea" });
    fireEvent.change(textarea, { target: { value: "Test Content" } });
    expect(textarea).toHaveValue("Test Content");
  });

  it("值變化時呼叫 onChange", () => {
    const handleChange = vi.fn();
    render(<Textarea label="Test Textarea" onChange={handleChange} />);

    const textarea = screen.getByRole("textbox", { name: "Test Textarea" });
    fireEvent.change(textarea, { target: { value: "New Value" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("disabled 為 true 時 disabled textarea", () => {
    render(<Textarea label="Test Textarea" disabled />);

    const textarea = screen.getByRole("textbox", { name: "Test Textarea" });
    expect(textarea).toBeDisabled();
  });

  it("提供 error 時顯示錯誤訊息", () => {
    render(<Textarea label="Test Textarea" error="This field is required" />);

    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });
});
