import { renderHook } from "@testing-library/react";
import { useShippingInfo } from "@/hooks/useShippingInfo";

describe("useShippingInfo", () => {
  it("小計 0 時未達免運", () => {
    const { result } = renderHook(() => useShippingInfo(0));
    expect(result.current.isFreeShipping).toBe(false);
    expect(result.current.shippingFee).toBe(60);
    expect(result.current.progress).toBe(0);
    expect(result.current.message).toContain("免運費");
  });

  it("小計達門檻時免運", () => {
    const { result } = renderHook(() => useShippingInfo(500));
    expect(result.current.isFreeShipping).toBe(true);
    expect(result.current.shippingFee).toBe(0);
    expect(result.current.progress).toBe(100);
    expect(result.current.message).toContain("已達");
  });

  it("小計未達門檻時顯示差額訊息", () => {
    const { result } = renderHook(() => useShippingInfo(300));
    expect(result.current.isFreeShipping).toBe(false);
    expect(result.current.shippingFee).toBe(60);
    expect(result.current.progress).toBe(60);
    expect(result.current.message).toContain("再湊");
    expect(result.current.message).toContain("200");
  });

  it("小計為負數時視為未達免運", () => {
    const { result } = renderHook(() => useShippingInfo(-100));
    expect(result.current.isFreeShipping).toBe(false);
    expect(result.current.shippingFee).toBe(60);
  });
});
