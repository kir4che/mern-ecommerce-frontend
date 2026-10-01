import { screen } from "@testing-library/react";

import HeaderMenu from "@/components/features/HeaderMenu";
import { render } from "@/test/utils";

const mockUseAuth = vi.fn();
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock("@/hooks/useCart", () => ({
  useCart: () => ({ totalQuantity: 3 }),
}));

describe("HeaderMenu 元件", () => {
  const renderHeaderMenu = () => render(<HeaderMenu />);

  it("未登入時顯示登入與註冊按鈕", () => {
    mockUseAuth.mockReturnValue({ user: null });
    renderHeaderMenu();

    expect(screen.getByRole("link", { name: "登入" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "註冊" })).toBeInTheDocument();
  });

  it("已登入時顯示會員 icon", () => {
    mockUseAuth.mockReturnValue({ user: { id: "u1", email: "test@test.com" } });
    renderHeaderMenu();

    const userLink = screen.getByRole("link", { name: "前往會員中心" });
    expect(userLink).toHaveAttribute("href", "/my-account");
  });

  it("點擊 menu 按鈕時打開和關閉 menu", async () => {
    mockUseAuth.mockReturnValue({ user: null });
    const { user } = renderHeaderMenu();

    const menuBtn = screen.getByRole("button", { name: "開啟選單" });
    await user.click(menuBtn);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "關閉選單" })
    ).toBeInTheDocument();
  });

  it("顯示購物車及項目數量", () => {
    mockUseAuth.mockReturnValue({ user: null });
    renderHeaderMenu();
    expect(
      screen.getByRole("link", { name: /購物車目前有/ })
    ).toBeInTheDocument();
  });
});
