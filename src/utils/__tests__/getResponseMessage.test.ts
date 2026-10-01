import { RESPONSE_CODE_MAP } from "@/constants/responseCodes";
import { getResponseMessage } from "@/utils/getResponseMessage";

describe("getResponseMessage 函式", () => {
  it("code 在對照表中時回傳對應訊息", () => {
    const response = {
      success: true,
      code: "PASSWORD_UPDATED",
      message: "Password updated. Please log in again.",
    };

    expect(getResponseMessage(response, "fallback")).toBe(
      "密碼已更新，請重新登入。"
    );
  });

  it("沒有 code 時回傳 fallback", () => {
    expect(getResponseMessage({ success: true }, "fallback")).toBe("fallback");
  });

  it("未知 code 時回傳 fallback", () => {
    expect(
      getResponseMessage(
        { success: true, code: "UNKNOWN_SUCCESS", message: "backend message" },
        "fallback"
      )
    ).toBe("fallback");
  });

  it("mapping 執行失敗時仍回傳 fallback", () => {
    const originalValue = RESPONSE_CODE_MAP.BROKEN_CODE;

    Object.assign(RESPONSE_CODE_MAP, {
      BROKEN_CODE: () => {
        throw new Error("mapping failed");
      },
    });

    expect(
      getResponseMessage({ success: true, code: "BROKEN_CODE" }, "fallback")
    ).toBe("fallback");

    if (originalValue === undefined) delete RESPONSE_CODE_MAP.BROKEN_CODE;
    else Object.assign(RESPONSE_CODE_MAP, { BROKEN_CODE: originalValue });
  });

  it("不是物件時回傳 fallback", () => {
    expect(getResponseMessage(null, "fallback")).toBe("fallback");
    expect(getResponseMessage("response", "fallback")).toBe("fallback");
  });
});
