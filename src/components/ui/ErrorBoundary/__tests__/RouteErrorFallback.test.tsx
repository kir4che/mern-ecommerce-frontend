import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import RouteErrorFallback from "../RouteErrorFallback";

vi.mock("react-router", () => ({
  useRouteError: () => new Error("Chunk load failed"),
  isRouteErrorResponse: () => false,
}));

describe("RouteErrorFallback", () => {
  it("renders error message and reload button", async () => {
    const user = userEvent.setup();
    const reloadMock = vi.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { reload: reloadMock },
    });

    render(<RouteErrorFallback />);

    expect(screen.getByText("頁面載入失敗")).toBeInTheDocument();
    const button = screen.getByRole("button", { name: "重整頁面" });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(reloadMock).toHaveBeenCalled();
  });
});
