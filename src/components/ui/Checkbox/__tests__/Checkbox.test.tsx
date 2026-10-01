import { fireEvent, render, screen } from "@testing-library/react";

import Checkbox from "@/components/ui/Checkbox";

describe("Checkbox 元件", () => {
  it("點擊 checkbox 時呼叫 onChange", () => {
    const handleChange = vi.fn();
    render(
      <Checkbox
        id="test-checkbox"
        label="Test Checkbox"
        onChange={handleChange}
      />
    );

    const checkbox = screen.getByRole("checkbox", { name: "Test Checkbox" });
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("當 disabled 為 true 時 disabled checkbox", () => {
    render(
      <Checkbox
        id="disabled-checkbox"
        label="Disabled Checkbox"
        disabled
        onChange={vi.fn()}
      />
    );

    const checkbox = screen.getByRole("checkbox", {
      name: "Disabled Checkbox",
    });
    expect(checkbox).toBeDisabled();
  });
});
