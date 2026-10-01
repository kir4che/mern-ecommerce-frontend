import { addComma } from "@/utils/addComma";

describe("addComma 函式", () => {
  it("數字會加上千分位", () => {
    expect(addComma(1234567)).toBe("1,234,567");
  });

  it("字串數字也可以格式化", () => {
    expect(addComma("2500")).toBe("2,500");
  });

  it("0 會回傳 0", () => {
    expect(addComma(0)).toBe("0");
  });

  it("null 或 undefined 會回傳空字串", () => {
    expect(addComma(null)).toBe("");
    expect(addComma(undefined)).toBe("");
  });

  it("無法轉成數字的值會回傳空字串", () => {
    expect(addComma("abc")).toBe("");
  });
});
