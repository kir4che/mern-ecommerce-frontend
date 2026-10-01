import Accordion from "@/components/shared/Accordion";
import { screen } from "@testing-library/react";
import { render } from "@/test/utils";

describe("Accordion 元件", () => {
  const title = "Test Accordion";
  const children = "Accordion Content";

  it("預設為關閉狀態", () => {
    render(<Accordion title={title}>{children}</Accordion>);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();
  });

  it("defaultOpen true 為打開狀態", () => {
    render(
      <Accordion title={title} defaultOpen>
        {children}
      </Accordion>
    );

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
  });

  it("點擊時切換狀態", async () => {
    const { user } = render(<Accordion title={title}>{children}</Accordion>);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);
    expect(checkbox).toBeChecked();

    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it("提供 name 時渲染為單選按鈕", () => {
    const radioName = "faq-group";
    render(
      <Accordion title={title} name={radioName}>
        {children}
      </Accordion>
    );

    const radio = screen.getByRole("radio");
    expect(radio).toBeInTheDocument();
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();

    expect(radio).toHaveAttribute("name", radioName);
    expect(radio).toHaveAttribute("value", title);
  });
});
