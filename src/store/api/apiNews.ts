import { apiSlice } from "./apiSlice";
import type {
  BaseResponse,
  CreateNewsData,
  GetNewsParams,
  NewsDetailResponse,
  NewsResponse,
  UpdateNewsData,
  UpdateNewsResponse,
} from "@/types";

const newsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNews: builder.query<NewsResponse, GetNewsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.limit) searchParams.append("limit", params.limit.toString());
        return `/news?${searchParams.toString()}`;
      },
      providesTags: ["News"],
    }),
    getNewsById: builder.query<NewsDetailResponse, string>({
      query: (id) => `/news/${id}`,
      providesTags: (_result, _error, id) => [
        { type: "NewsItem" as const, id },
      ],
    }),
    createNews: builder.mutation<BaseResponse, CreateNewsData>({
      query: (body) => ({ url: "/news", method: "POST", body }),
      invalidatesTags: ["News"],
    }),
    updateNews: builder.mutation<
      UpdateNewsResponse,
      { id: string } & UpdateNewsData
    >({
      query: ({ id, ...body }) => ({
        url: `/news/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "News",
        { type: "NewsItem" as const, id },
      ],
    }),
    deleteNews: builder.mutation<void, string>({
      query: (id) => ({ url: `/news/${id}`, method: "DELETE" }),
      invalidatesTags: ["News"],
    }),
  }),
});

export const {
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
} = newsApi;
