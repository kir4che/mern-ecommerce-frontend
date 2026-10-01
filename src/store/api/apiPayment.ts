import { apiSlice } from "./apiSlice";
import type { CreatePaymentData } from "@/types";

const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPayment: builder.mutation<
      { success: boolean; params: Record<string, unknown> },
      CreatePaymentData
    >({
      query: (body) => ({ url: "/payment", method: "POST", body }),
    }),
    devPayOrder: builder.mutation<
      { success: boolean; message: string },
      string
    >({
      query: (orderId) => ({
        url: `/payment/dev-pay/${orderId}`,
        method: "POST",
      }),
    }),
  }),
});

export const { useCreatePaymentMutation, useDevPayOrderMutation } = paymentApi;
