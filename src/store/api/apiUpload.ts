import { apiSlice } from "./apiSlice";
import type { UploadImageResponse } from "@/types";

const uploadApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    uploadImage: builder.mutation<UploadImageResponse, FormData>({
      query: (formData) => ({
        url: "/upload/image",
        method: "POST",
        body: formData,
        prepareHeaders: (headers: Headers) => {
          headers.delete("Content-Type");
          return headers;
        },
      }),
    }),
  }),
});

export const { useUploadImageMutation } = uploadApi;
