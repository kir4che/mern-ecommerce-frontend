import { http, HttpResponse } from "msw";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const mockProduct = {
  _id: "p1",
  title: "蛋糕",
  price: 300,
  imageUrl: "test.jpg",
  tagline: "",
  description: "",
  content: "",
  expiryDate: "",
  allergens: [],
  delivery: "",
  storage: "",
  ingredients: "",
  nutrition: "",
  countInStock: 10,
  salesCount: 0,
  tags: [],
  categories: ["cake"],
};

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
];

export const handlers = [
  http.get(`${BASE_URL}/products`, () =>
    HttpResponse.json({
      success: true,
      products: [mockProduct],
      total: 1,
      pages: 1,
      page: 1,
    })
  ),

  http.get(`${BASE_URL}/products/:id`, () =>
    HttpResponse.json({ success: true, product: mockProduct })
  ),

  http.get(`${BASE_URL}/coupons`, () =>
    HttpResponse.json({
      success: true,
      coupons: mockCoupons,
    })
  ),
];
