import { apiSlice } from "./apiSlice";
import type { AddressInput, AddressListResponse } from "@/types";

const addressesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAddresses: builder.query<AddressListResponse, void>({
      query: () => "/user/addresses",
      providesTags: ["Addresses"],
    }),
    addAddress: builder.mutation<AddressListResponse, AddressInput>({
      query: (body) => ({ url: "/user/addresses", method: "POST", body }),
      invalidatesTags: ["Addresses"],
    }),
    updateAddress: builder.mutation<
      AddressListResponse,
      { addressId: string; data: Partial<AddressInput> }
    >({
      query: ({ addressId, data }) => ({
        url: `/user/addresses/${addressId}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Addresses"],
    }),
    deleteAddress: builder.mutation<AddressListResponse, string>({
      query: (addressId) => ({
        url: `/user/addresses/${addressId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Addresses"],
    }),
  }),
});

export const {
  useGetAddressesQuery,
  useAddAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;
