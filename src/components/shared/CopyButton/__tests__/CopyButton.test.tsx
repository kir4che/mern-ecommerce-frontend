import { vi } from "vitest";

import CopyButton from "@/components/shared/CopyButton";
import { useAlert } from "@/context/AlertContext";
import { render, screen } from "@/test/utils";

vi.mock("@/context/AlertContext", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@/context/AlertContext")>();
  return {
    ...actual,
    useAlert: vi.fn(),
  };
});

const mockShowAlert = vi.fn();

describe("CopyButton 元件", () => {
  beforeEach(() => {
    vi.mocked(useAlert).mockReturnValue({
      showAlert: mockShowAlert,
      hideAlert: vi.fn(),
    });
  });

  it("點擊後顯示成功提示", async () => {
    const { user } = render(<CopyButton text="ABC123" label="訂單編號" />);

    await user.click(screen.getByRole("button"));

    expect(mockShowAlert).toHaveBeenCalledWith({
      variant: "success",
      message: "已複製訂單編號！",
      dismissTimeout: 1500,
    });
  });
});
