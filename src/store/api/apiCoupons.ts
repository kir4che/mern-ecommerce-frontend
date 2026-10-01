import { apiSlice } from "./apiSlice";
import type {
  CouponDetailResponse,
  CouponResponse,
  CouponsResponse,
  CreateCouponData,
  UpdateCouponData,
  ValidateCouponParams,
} from "@/types";

const couponsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    coupon: builder.mutation<CouponResponse, ValidateCouponParams>({
      query: (body) => ({ url: "/coupons/validate", method: "POST", body }),
    }),
    getCoupons: builder.query<CouponsResponse, void>({
      query: () => "/coupons",
      providesTags: ["Coupons"],
    }),
    getActiveCoupons: builder.query<CouponsResponse, void>({
      query: () => "/coupons/active",
      providesTags: ["Coupons"],
    }),
    createCoupon: builder.mutation<CouponDetailResponse, CreateCouponData>({
      query: (body) => ({ url: "/coupons", method: "POST", body }),
      invalidatesTags: ["Coupons"],
    }),
    updateCoupon: builder.mutation<
      CouponDetailResponse,
      { id: string; data: UpdateCouponData }
    >({
      query: ({ id, data }) => ({
        url: `/coupons/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),
    deactivateCoupon: builder.mutation<void, string>({
      query: (couponId) => ({ url: `/coupons/${couponId}`, method: "DELETE" }),
      invalidatesTags: ["Coupons"],
    }),
  }),
});

export const {
  useCouponMutation,
  useGetCouponsQuery,
  useGetActiveCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeactivateCouponMutation,
} = couponsApi;
