import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import Select from "@/components/ui/Select";

describe("Select 元件", () => {
  const options = [
    { label: "Item 1", value: "/item1" },
    { label: "Item 2", value: "/item2" },
  ];

  it("呼叫 onChange 並傳遞 name 和 value", () => {
    const handleChange = vi.fn();

    render(
      <MemoryRouter>
        <Select
          name="category"
          label="Menu"
          options={options}
          onChange={handleChange}
        />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByRole("combobox", { name: "Menu" }), {
      target: { value: "/item2" },
    });

    expect(handleChange).toHaveBeenCalledWith("category", "/item2");
  });
});
