import { http, HttpResponse } from "msw";

import ProductSlider from "@/components/features/ProductSlider";
import { server } from "@/mocks/server";
import { makeMockProduct, render, screen } from "@/test/utils";

vi.mock("@/hooks/useProductCollections", () => ({
  useProductCollections: () => ({
    collections: [],
    linkToCategory: {},
    catNameMap: {},
    isValidCategory: () => true,
    findCollection: () => undefined,
  }),
}));

vi.mock("swiper/modules", () => ({ Autoplay: {}, Navigation: {} }));

vi.mock("swiper/react", () => ({
  Swiper: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SwiperSlide: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock("@/components/ui/ProductImg", () => ({
  default: ({ product }: { product: { title: string } }) => (
    <img alt={product.title} />
  ),
}));

vi.mock("@/components/shared/ProductActionForm", () => ({
  default: () => <div />,
}));

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

describe("ProductSlider 元件", () => {
  it("API 成功後顯示商品", async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () =>
        HttpResponse.json({
          success: true,
          products: [makeMockProduct({ title: "紅豆麵包" })],
          total: 1,
          pages: 1,
          page: 1,
        })
      )
    );

    render(<ProductSlider />);

    expect(
      await screen.findByRole("img", { name: "紅豆麵包" })
    ).toBeInTheDocument();
  });

  it("API 回空資料時顯示空狀態", async () => {
    server.use(
      http.get(`${BASE_URL}/products`, () =>
        HttpResponse.json({
          success: true,
          products: [],
          total: 0,
          pages: 0,
          page: 1,
        })
      )
    );

    render(<ProductSlider />);

    expect(
      await screen.findByText("目前沒有任何推薦的商品")
    ).toBeInTheDocument();
  });

  it("失敗後按重新載入會再次取得資料", async () => {
    let shouldFail = true;

    server.use(
      http.get(`${BASE_URL}/products`, () => {
        if (shouldFail) {
          shouldFail = false;
          return HttpResponse.json(
            { message: "server error" },
            { status: 500 }
          );
        }

        return HttpResponse.json({
          success: true,
          products: [makeMockProduct({ title: "重新載入成功" })],
          total: 1,
          pages: 1,
          page: 1,
        });
      })
    );

    const { user } = render(<ProductSlider />);

    expect(
      await screen.findByText("抱歉，暫時無法取得商品資訊。")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "重新載入" }));

    expect(
      await screen.findByRole("img", { name: "重新載入成功" })
    ).toBeInTheDocument();
  });
});
