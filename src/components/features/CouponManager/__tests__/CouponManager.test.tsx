import { http, HttpResponse } from "msw";

import CouponManager from "@/components/features/CouponManager";
import { server } from "@/mocks/server";
import { render, screen } from "@/test/utils";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const mockCoupons = [
  {
    _id: "1",
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    minPurchaseAmount: 500,
    expiryDate: "2099-12-31T00:00:00.000Z",
    isActive: true,
    createdAt: "2025-01-01T00:00:00.000Z",
  },
  {
    _id: "2",
    code: "FIXED50",
    discountType: "fixed",
    discountValue: 50,
    minPurchaseAmount: 0,
    expiryDate: "2020-01-01T00:00:00.000Z",
    isActive: true,
    createdAt: "2025-01-02T00:00:00.000Z",
  },
];

describe("CouponManager", () => {
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = vi.fn(function (
      this: HTMLDialogElement
    ) {
      this.setAttribute("open", "");
    });
    HTMLDialogElement.prototype.close = vi.fn(function (
      this: HTMLDialogElement
    ) {
      this.removeAttribute("open");
    });
  });

  it("API 成功後顯示優惠碼列表", async () => {
    server.use(
      http.get(`${BASE_URL}/coupons`, () =>
        HttpResponse.json({
          success: true,
          coupons: mockCoupons,
        })
      )
    );

    render(<CouponManager />);

    expect(await screen.findByText("SAVE10")).toBeInTheDocument();
    expect(screen.getByText("啟用中")).toBeInTheDocument();
    expect(screen.getByText("已過期")).toBeInTheDocument();
  });

  it("失敗後按重新載入會再次取得資料", async () => {
    let shouldFail = true;

    server.use(
      http.get(`${BASE_URL}/coupons`, () => {
        if (shouldFail) {
          shouldFail = false;
          return HttpResponse.json(
            { message: "server error" },
            { status: 500 }
          );
        }

        return HttpResponse.json({
          success: true,
          coupons: mockCoupons,
        });
      })
    );

    const { user } = render(<CouponManager />);

    expect(
      await screen.findByText("抱歉，暫時無法取得優惠碼資訊")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "重新載入" }));

    expect(await screen.findByText("SAVE10")).toBeInTheDocument();
  });

  it("編輯優惠碼時帶入該筆資料", async () => {
    server.use(
      http.get(`${BASE_URL}/coupons`, () =>
        HttpResponse.json({
          success: true,
          coupons: mockCoupons,
        })
      )
    );

    const { user } = render(<CouponManager />);

    await screen.findByText("SAVE10");
    await user.click(screen.getAllByRole("button", { name: "編輯優惠碼" })[1]);

    expect(
      await screen.findByRole("heading", { name: "編輯優惠碼" })
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /優惠碼/ })).toHaveValue(
      "FIXED50"
    );
    expect(screen.getByRole("combobox", { name: "折扣類型" })).toHaveValue(
      "fixed"
    );
    expect(screen.getByRole("spinbutton", { name: /折扣/ })).toHaveValue(50);
    expect(screen.getByLabelText(/到期日/)).toHaveValue("2020-01-01");
  });
});
