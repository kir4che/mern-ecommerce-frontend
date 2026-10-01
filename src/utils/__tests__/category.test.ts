import type { Category } from "@/types";
import { buildCatNameMap } from "@/utils/category";

describe("buildCatNameMap 函式", () => {
  it("建立 slug 到中文名稱的對照表", () => {
    const categories = [
      {
        _id: "1",
        name: "蛋糕",
        slug: "cake",
        sortOrder: 1,
        isActive: true,
        createdAt: "",
        updatedAt: "",
      },
      {
        _id: "2",
        name: "餅乾",
        slug: "cookie",
        sortOrder: 2,
        isActive: true,
        createdAt: "",
        updatedAt: "",
      },
    ] satisfies Category[];

    expect(buildCatNameMap(categories)).toEqual({
      cake: "蛋糕",
      cookie: "餅乾",
    });
  });

  it("空陣列會回傳空物件", () => {
    expect(buildCatNameMap([])).toEqual({});
  });
});
