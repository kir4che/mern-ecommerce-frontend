import { useAlert } from "@/context/AlertContext";
import { render, screen, waitForElementToBeRemoved } from "@/test/utils";

const TestComponent = () => {
  const { showAlert, hideAlert } = useAlert();

  return (
    <div>
      <button
        onClick={() => showAlert({ variant: "info", message: "Test Alert" })}
      >
        Show info alert
      </button>
      <button
        onClick={() =>
          showAlert({ variant: "success", message: "Test Success" })
        }
      >
        Show success alert
      </button>
      <button
        onClick={() => showAlert({ variant: "error", message: "Test Error" })}
      >
        Show error alert
      </button>
      <button onClick={hideAlert}>Hide alerts</button>
    </div>
  );
};

describe("AlertContext", () => {
  it("showAlert 後會顯示 toast", async () => {
    const { user } = render(<TestComponent />, { withToaster: true });

    await user.click(screen.getByRole("button", { name: "Show info alert" }));

    expect(await screen.findByText("Test Alert")).toBeInTheDocument();
  });

  it("hideAlert 會移除目前的 toast", async () => {
    const { user } = render(<TestComponent />, { withToaster: true });

    await user.click(screen.getByRole("button", { name: "Show info alert" }));
    expect(await screen.findByText("Test Alert")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Hide alerts" }));

    await waitForElementToBeRemoved(() => screen.queryByText("Test Alert"));
  });

  it("可以顯示不同 variant 的訊息", async () => {
    const { user } = render(<TestComponent />, { withToaster: true });

    await user.click(
      screen.getByRole("button", { name: "Show success alert" })
    );
    expect(await screen.findByText("Test Success")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Show error alert" }));
    expect(await screen.findByText("Test Error")).toBeInTheDocument();
  });
});
