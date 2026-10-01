import { screen } from "@testing-library/react";
import { vi } from "vitest";

import Pagination from "@/components/shared/Pagination";
import { render } from "@/test/utils";

describe("Pagination 元件", () => {
  const handlePageChange = vi.fn();

  it("正確渲染頁碼", () => {
    render(
      <Pagination page={1} totalPages={3} handlePageChange={handlePageChange} />
    );

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("點擊下一頁按鈕時呼叫 handlePageChange", async () => {
    const { user } = render(
      <Pagination page={1} totalPages={3} handlePageChange={handlePageChange} />
    );

    await user.click(screen.getByRole("button", { name: /前往下一頁/i }));
    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it("點擊上一頁按鈕時呼叫 handlePageChange", async () => {
    const { user } = render(
      <Pagination page={2} totalPages={3} handlePageChange={handlePageChange} />
    );

    await user.click(screen.getByRole("button", { name: /返回上一頁/i }));
    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it("最後一頁時下一頁按鈕 disabled", () => {
    render(
      <Pagination page={3} totalPages={3} handlePageChange={handlePageChange} />
    );
    const nextButton = screen.getByRole("button", { name: /前往下一頁/i });
    expect(nextButton).toBeDisabled();
  });

  it("第一頁時上一頁按鈕 disabled", () => {
    render(
      <Pagination page={1} totalPages={3} handlePageChange={handlePageChange} />
    );
    const prevButton = screen.getByRole("button", { name: /返回上一頁/i });
    expect(prevButton).toBeDisabled();
  });
});
