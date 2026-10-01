import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import PageHeader, {
  type PageHeaderProps,
} from "@/components/shared/PageHeader";

describe("PageHeader 元件", () => {
  const defaultProps = {
    breadcrumbText: "商品一覽",
    titleEn: "Collections",
    titleCh: "商品一覽",
  };

  const renderPageHeader = (props?: Partial<PageHeaderProps>) =>
    render(
      <MemoryRouter>
        <PageHeader {...defaultProps} {...props} />
      </MemoryRouter>
    );

  it("link 為 undefined 時自動從 titleEn 產生路徑", () => {
    renderPageHeader();
    const link = screen.getByRole("link", { name: "商品一覽" });
    expect(link).toHaveAttribute("href", "/collections");
  });

  it("提供 link 時使用自訂路徑", () => {
    renderPageHeader({ link: "products" });
    const link = screen.getByRole("link", { name: "商品一覽" });
    expect(link).toHaveAttribute("href", "/products");
  });

  it("titleEn 含空格時轉換為連字號", () => {
    renderPageHeader({ titleEn: "New Arrivals" });
    const link = screen.getByRole("link", { name: "商品一覽" });
    expect(link).toHaveAttribute("href", "/new-arrivals");
  });
});
