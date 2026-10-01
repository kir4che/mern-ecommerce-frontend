import { RESPONSE_CODE_MAP } from "@/constants/responseCodes";
import { getErrorMessage, getErrorStatus } from "@/utils/getErrorMessage";

describe("getErrorMessage 函式", () => {
  it("code 在對照表中時回傳對應訊息", () => {
    const error = {
      status: 401,
      data: {
        code: "ACCESS_TOKEN_REQUIRED",
        message: "backend message",
      },
    };

    expect(getErrorMessage(error, "fallback")).toBe("請先登入後再繼續");
  });

  it("函式型 code 會依資料組出訊息", () => {
    const error = {
      status: 400,
      data: {
        code: "OUT_OF_STOCK",
        productTitle: "草莓蛋糕",
        availableQuantity: 2,
        requestedQuantity: 5,
      },
    };

    expect(getErrorMessage(error, "fallback")).toContain("草莓蛋糕");
    expect(getErrorMessage(error, "fallback")).toContain("目前僅剩 2 件");
  });

  it("未知 code 且不是 500 時優先用後端 message", () => {
    const error = {
      status: 400,
      data: {
        code: "UNKNOWN_CODE",
        message: "後端自訂訊息",
      },
    };

    expect(getErrorMessage(error, "fallback")).toBe("後端自訂訊息");
  });

  it("500 錯誤時回傳 fallback", () => {
    const error = {
      status: 500,
      data: {
        code: "UNKNOWN_CODE",
        message: "不直接顯示",
      },
    };

    expect(getErrorMessage(error, "系統忙碌中")).toBe("系統忙碌中");
  });

  it("code mapping 執行失敗時仍回傳 fallback", () => {
    const originalValue = RESPONSE_CODE_MAP.BROKEN_CODE;

    Object.assign(RESPONSE_CODE_MAP, {
      BROKEN_CODE: () => {
        throw new Error("mapping failed");
      },
    });

    const error = {
      status: 500,
      data: {
        code: "BROKEN_CODE",
        message: "不直接顯示",
      },
    };

    expect(getErrorMessage(error, "系統忙碌中")).toBe("系統忙碌中");

    if (originalValue === undefined) delete RESPONSE_CODE_MAP.BROKEN_CODE;
    else Object.assign(RESPONSE_CODE_MAP, { BROKEN_CODE: originalValue });
  });

  it("不是物件時回傳 fallback", () => {
    expect(getErrorMessage(null, "fallback")).toBe("fallback");
    expect(getErrorMessage("error", "fallback")).toBe("fallback");
  });
});

describe("getErrorStatus 函式", () => {
  it("有 status 時回傳數字", () => {
    expect(getErrorStatus({ status: 404 })).toBe(404);
  });

  it("沒有 status 時回傳 undefined", () => {
    expect(getErrorStatus({})).toBeUndefined();
    expect(getErrorStatus(null)).toBeUndefined();
  });
});
