import { fireEvent } from "@testing-library/react";
import { vi } from "vitest";

import NewsForm from "@/components/forms/NewsForm";
import { render, screen } from "@/test/utils";
import type { NewsItem } from "@/types";

const { createNewsMock, updateNewsMock, navigateMock, showAlertMock } =
  vi.hoisted(() => ({
    createNewsMock: vi.fn(),
    updateNewsMock: vi.fn(),
    navigateMock: vi.fn(),
    showAlertMock: vi.fn(),
  }));

vi.mock("@/store/api/apiNews", () => ({
  useCreateNewsMutation: () => [createNewsMock, { isLoading: false }],
  useUpdateNewsMutation: () => [updateNewsMock, { isLoading: false }],
}));

vi.mock("@/hooks/useUnsavedChanges", () => ({
  useUnsavedChanges: vi.fn(() => ({ markSaved: vi.fn() })),
}));

vi.mock("@/context/AlertContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/context/AlertContext")>();
  return { ...actual, useAlert: () => ({ showAlert: showAlertMock }) };
});

vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return { ...actual, useNavigate: () => navigateMock };
});

describe("NewsForm 元件", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("create 模式顯示標題與主要欄位", () => {
    render(<NewsForm />);

    expect(
      screen.getByRole("heading", { name: "新增公告" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /標題/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/發佈日期/)).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /內容/ })).toBeInTheDocument();
  });

  it("edit 模式顯示編輯標題與更新按鈕", () => {
    const news: NewsItem = {
      _id: "1",
      title: "測試",
      category: "促銷",
      date: "2025-01-01",
      content: "內容",
      imageUrl: "",
      createdAt: "2025-01-01T00:00:00.000Z",
      updatedAt: "2025-01-01T00:00:00.000Z",
    };

    render(<NewsForm news={news} />);

    expect(
      screen.getByRole("heading", { name: "編輯公告" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "更新" })).toBeInTheDocument();
  });

  it("點擊貼上測試資料後會填入預設內容", async () => {
    const { user } = render(<NewsForm />);

    await user.click(screen.getByRole("button", { name: "貼上測試資料" }));

    expect(screen.getByRole("textbox", { name: /標題/ })).toHaveValue(
      "中秋月餅禮盒預購開跑"
    );
    expect(
      (screen.getByRole("textbox", { name: /內容/ }) as HTMLTextAreaElement)
        .value
    ).toContain("早鳥 9 折優惠");
  });

  it("空白送出時顯示標題與日期與內容的驗證錯誤", async () => {
    const { container } = render(<NewsForm />);

    fireEvent.submit(container.querySelector("#news-form")!);

    expect(await screen.findByText("請輸入標題")).toBeInTheDocument();
    expect(screen.getByText("請選擇日期")).toBeInTheDocument();
    expect(screen.getAllByText("請輸入內容")).toHaveLength(1);
    expect(createNewsMock).not.toHaveBeenCalled();
  });

  it("create 成功後顯示成功提示並導向列表", async () => {
    createNewsMock.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });

    const { user } = render(<NewsForm />);

    await user.type(screen.getByRole("textbox", { name: /標題/ }), "測試標題");
    await user.selectOptions(screen.getByLabelText("分類"), "公告");
    await user.type(screen.getByRole("textbox", { name: /內容/ }), "測試內容");
    fireEvent.change(screen.getByLabelText(/發佈日期/), {
      target: { value: "2026-07-27" },
    });
    await user.click(screen.getByRole("button", { name: "新增" }));

    await vi.waitFor(() => {
      expect(createNewsMock).toHaveBeenCalled();
      expect(showAlertMock).toHaveBeenCalledWith({
        variant: "success",
        message: "新增成功",
      });
      expect(navigateMock).toHaveBeenCalledWith("/admin/news");
    });
  });

  it("API 錯誤時顯示錯誤提示", async () => {
    createNewsMock.mockReturnValue({
      unwrap: () => Promise.reject(new Error("fail")),
    });

    const { user } = render(<NewsForm />);

    await user.type(screen.getByRole("textbox", { name: /標題/ }), "測試標題");
    await user.selectOptions(screen.getByLabelText("分類"), "公告");
    await user.type(screen.getByRole("textbox", { name: /內容/ }), "測試內容");
    fireEvent.change(screen.getByLabelText(/發佈日期/), {
      target: { value: "2026-07-27" },
    });
    await user.click(screen.getByRole("button", { name: "新增" }));

    await vi.waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith({
        variant: "error",
        message: expect.any(String),
      });
    });
  });
});
