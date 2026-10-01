import { render, screen } from "@testing-library/react";

import ErrorBoundary from "@/components/ui/ErrorBoundary";

const ThrowError = ({ message }: { message: string }) => {
  throw new Error(message);
};

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("子元件 throw error 時顯示 fallback UI", () => {
    render(
      <ErrorBoundary>
        <ThrowError message="測試錯誤" />
      </ErrorBoundary>
    );

    expect(screen.getByText("頁面發生錯誤")).toBeInTheDocument();
    expect(screen.getByText("測試錯誤")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "重整頁面" })
    ).toBeInTheDocument();
  });
});
