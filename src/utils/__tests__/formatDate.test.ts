import { formatDate } from "@/utils/formatDate";

describe("formatDate 函式", () => {
  it("日期字串會格式化成 yyyy/mm/dd", () => {
    expect(formatDate("2026-01-01T00:00:00.000Z")).toBe("2026/01/01");
  });

  it("Date 物件也可以格式化", () => {
    expect(formatDate(new Date("2026-01-01T00:00:00.000Z"))).toBe("2026/01/01");
  });

  it("空值會回傳空字串", () => {
    expect(formatDate("" as never)).toBe("");
  });

  it("無效日期會回傳空字串", () => {
    expect(formatDate("not-a-date")).toBe("");
  });
});
