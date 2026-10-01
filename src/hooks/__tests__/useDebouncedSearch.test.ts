import { act, renderHook } from "@testing-library/react";
import { useDebouncedSearch } from "@/hooks/useDebouncedSearch";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe("useDebouncedSearch", () => {
  it("handleSearchChange 立即更新 inputKeyword", () => {
    const { result } = renderHook(() => useDebouncedSearch());
    act(() => result.current.handleSearchChange("蛋糕"));
    expect(result.current.inputKeyword).toBe("蛋糕");
  });

  it("handleSearchChange 延遲更新 search", () => {
    const { result } = renderHook(() => useDebouncedSearch(400));
    act(() => result.current.handleSearchChange("蛋糕"));
    expect(result.current.search).toBe("");
    act(() => vi.advanceTimersByTime(400));
    expect(result.current.search).toBe("蛋糕");
  });

  it("多次輸入只觸發最後一次", () => {
    const { result } = renderHook(() => useDebouncedSearch(300));
    act(() => result.current.handleSearchChange("A"));
    act(() => vi.advanceTimersByTime(100));
    act(() => result.current.handleSearchChange("AB"));
    act(() => vi.advanceTimersByTime(100));
    act(() => result.current.handleSearchChange("ABC"));
    act(() => vi.advanceTimersByTime(300));
    expect(result.current.search).toBe("ABC");
  });

  it("自訂 delay", () => {
    const { result } = renderHook(() => useDebouncedSearch(1000));
    act(() => result.current.handleSearchChange("慢"));
    act(() => vi.advanceTimersByTime(999));
    expect(result.current.search).toBe("");
    act(() => vi.advanceTimersByTime(1));
    expect(result.current.search).toBe("慢");
  });
});
