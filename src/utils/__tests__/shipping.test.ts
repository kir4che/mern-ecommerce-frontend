import {
  BASIC_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  calculateShippingFee,
  getRemainingForFreeShipping,
  getShippingProgress,
  isFreeShipping,
} from "@/utils/shipping";

describe("shipping utils", () => {
  it("未達免運門檻時回傳基本運費", () => {
    expect(calculateShippingFee(300)).toBe(BASIC_SHIPPING_FEE);
  });

  it("達到免運門檻時回傳 0", () => {
    expect(calculateShippingFee(FREE_SHIPPING_THRESHOLD)).toBe(0);
  });

  it("progress 會依金額計算百分比", () => {
    expect(getShippingProgress(250)).toBe(50);
  });

  it("progress 最多到 100", () => {
    expect(getShippingProgress(999)).toBe(100);
  });

  it("回傳距離免運還差多少金額", () => {
    expect(getRemainingForFreeShipping(200)).toBe(300);
  });

  it("已達免運時剩餘金額為 0", () => {
    expect(getRemainingForFreeShipping(600)).toBe(0);
  });

  it("可以判斷是否免運", () => {
    expect(isFreeShipping(500)).toBe(true);
    expect(isFreeShipping(499)).toBe(false);
  });

  it("負數金額時回傳未達免運的安全值", () => {
    expect(calculateShippingFee(-100)).toBe(BASIC_SHIPPING_FEE);
    expect(getRemainingForFreeShipping(-100)).toBe(600);
    expect(getShippingProgress(-100)).toBe(0);
    expect(isFreeShipping(-100)).toBe(false);
  });
});
