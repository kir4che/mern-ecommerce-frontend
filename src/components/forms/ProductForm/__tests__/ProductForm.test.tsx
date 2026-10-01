import { fireEvent } from "@testing-library/react";
import { vi } from "vitest";

import ProductForm from "@/components/forms/ProductForm";
import { makeMockProduct, render, screen } from "@/test/utils";

const { createProductMock, updateProductMock, navigateMock, showAlertMock } =
  vi.hoisted(() => ({
    createProductMock: vi.fn(),
    updateProductMock: vi.fn(),
    navigateMock: vi.fn(),
    showAlertMock: vi.fn(),
  }));

vi.mock("@/store/api/apiProducts", () => ({
  useCreateProductMutation: () => [createProductMock, { isLoading: false }],
  useUpdateProductMutation: () => [updateProductMock, { isLoading: false }],
}));

vi.mock("@/store/api/apiUpload", () => ({
  useUploadImageMutation: () => [vi.fn(), { isLoading: false }],
}));

vi.mock("@/store/api/apiCategories", () => ({
  useGetCategoriesQuery: () => ({ data: { categories: [] } }),
}));

vi.mock("@/store/api/apiTags", () => ({
  useGetTagsQuery: () => ({ data: { tags: [] } }),
}));

vi.mock("@/hooks/useUnsavedChanges", () => ({
  useUnsavedChanges: vi.fn(() => ({ markSaved: vi.fn() })),
}));

vi.mock("@/context/AlertContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/context/AlertContext")>();
  return { ...actual, useAlert: () => ({ showAlert: showAlertMock }) };
});

// 模擬 react-router 的 useNavigate
vi.mock("react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router")>();
  return { ...actual, useNavigate: () => navigateMock };
});

describe("ProductForm 元件", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("create 模式顯示標題與必要欄位", () => {
    render(<ProductForm />);

    expect(
      screen.getByRole("heading", { name: "新增商品" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /商品名稱/ })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("spinbutton", { name: /售價/ })
    ).toBeInTheDocument();
  });

  it("edit 模式顯示商品名稱", () => {
    render(<ProductForm product={makeMockProduct({ title: "蛋糕" })} />);

    expect(
      screen.getByRole("heading", { name: "編輯：蛋糕" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "更新" })).toBeInTheDocument();
  });

  it("點擊貼上測試資料後會填入主要欄位", async () => {
    const { user } = render(<ProductForm />);

    await user.click(screen.getByRole("button", { name: "貼上測試資料" }));

    expect(screen.getByRole("textbox", { name: /商品名稱/ })).toHaveValue(
      "經典紅豆麵包"
    );
    expect(screen.getByRole("spinbutton", { name: /售價/ })).toHaveValue(55);
    expect(screen.getByRole("textbox", { name: /內容物/ })).toHaveValue(
      "紅豆餡、麵粉、奶油、糖、鹽"
    );
  });

  it("空白送出時顯示驗證錯誤", async () => {
    const { container } = render(<ProductForm />);

    fireEvent.submit(container.querySelector("#product-form")!);

    expect(await screen.findByText("商品名稱為必填")).toBeInTheDocument();
    expect(screen.getByText("請輸入有效的售價")).toBeInTheDocument();
    expect(createProductMock).not.toHaveBeenCalled();
  });

  it("edit 成功後導向商品列表", async () => {
    updateProductMock.mockReturnValue({
      unwrap: () => Promise.resolve({}),
    });

    const { user } = render(<ProductForm product={makeMockProduct()} />);

    await user.click(screen.getByRole("button", { name: "更新" }));

    await vi.waitFor(() => {
      expect(updateProductMock).toHaveBeenCalled();
      expect(showAlertMock).toHaveBeenCalledWith({
        variant: "success",
        message: "商品已更新",
      });
      expect(navigateMock).toHaveBeenCalledWith("/admin/products");
    });
  });

  it("API 錯誤時顯示伺服器錯誤", async () => {
    updateProductMock.mockReturnValue({
      unwrap: () => Promise.reject(new Error("fail")),
    });

    const { user } = render(<ProductForm product={makeMockProduct()} />);

    await user.click(screen.getByRole("button", { name: "更新" }));

    await vi.waitFor(() => {
      expect(showAlertMock).toHaveBeenCalledWith({
        variant: "error",
        message: "儲存失敗",
      });
    });
  });
});
