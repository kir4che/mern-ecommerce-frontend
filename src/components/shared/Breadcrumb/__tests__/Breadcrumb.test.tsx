import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import Breadcrumb from "@/components/shared/Breadcrumb";

const renderBreadcrumb = (props?: { textColor?: string }) =>
  render(
    <MemoryRouter>
      <Breadcrumb link="collections/cake" text="蛋糕" {...props} />
    </MemoryRouter>
  );

describe("Breadcrumb 元件", () => {
  it("渲染當前頁面的連結與文字", () => {
    renderBreadcrumb();
    const link = screen.getByRole("link", { name: "蛋糕" });
    expect(link).toHaveAttribute("href", "/collections/cake");
  });
});
