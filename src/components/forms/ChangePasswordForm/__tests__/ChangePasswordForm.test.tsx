import { vi } from "vitest";

import ChangePasswordForm from "@/components/forms/ChangePasswordForm";
import { render, screen } from "@/test/utils";

const { changePasswordMock } = vi.hoisted(() => ({
  changePasswordMock: vi.fn(),
}));

vi.mock("@/store/api/apiAuth", () => ({
  useChangePasswordMutation: () => [changePasswordMock, { isLoading: false }],
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ logout: vi.fn() }),
}));

vi.mock("@/context/AlertContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/context/AlertContext")>();
  return { ...actual, useAlert: () => ({ showAlert: vi.fn() }) };
});

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return { ...actual, useNavigate: () => vi.fn() };
});

describe("ChangePasswordForm 元件", () => {
  it("空白送出時顯示 validation 訊息", async () => {
    const { user } = render(<ChangePasswordForm />);

    await user.click(screen.getByRole("button", { name: "修改密碼" }));

    expect(await screen.findByText("請輸入目前密碼")).toBeInTheDocument();
    expect(screen.getByText("新密碼至少需要 8 個字元")).toBeInTheDocument();
    expect(screen.getByText("請再次輸入新密碼")).toBeInTheDocument();
    expect(changePasswordMock).not.toHaveBeenCalled();
  });

  it("新密碼缺少大小寫或數字時顯示格式錯誤", async () => {
    const { user } = render(<ChangePasswordForm />);

    await user.type(screen.getByLabelText("目前密碼"), "oldPass123");
    await user.type(screen.getByLabelText("新密碼"), "abcdefgh");
    await user.type(screen.getByLabelText("確認新密碼"), "abcdefgh");
    await user.click(screen.getByRole("button", { name: "修改密碼" }));

    expect(
      await screen.findByText("新密碼需包含大小寫英文及數字")
    ).toBeInTheDocument();
    expect(changePasswordMock).not.toHaveBeenCalled();
  });

  it("兩次新密碼不一致時顯示錯誤", async () => {
    const { user } = render(<ChangePasswordForm />);

    await user.type(screen.getByLabelText("目前密碼"), "oldPass123");
    await user.type(screen.getByLabelText("新密碼"), "NewPass123");
    await user.type(screen.getByLabelText("確認新密碼"), "NewPass456");
    await user.click(screen.getByRole("button", { name: "修改密碼" }));

    expect(
      await screen.findByText("兩次輸入的新密碼不一致")
    ).toBeInTheDocument();
    expect(changePasswordMock).not.toHaveBeenCalled();
  });
});
