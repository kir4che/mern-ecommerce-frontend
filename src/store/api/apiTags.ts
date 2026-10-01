import { apiSlice } from "./apiSlice";
import type {
  CreateTagData,
  TagDetailResponse,
  TagsResponse,
  UpdateTagData,
} from "@/types";

const tagsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<TagsResponse, void>({
      query: () => "/tags",
    }),
    getAllTags: builder.query<TagsResponse, void>({
      query: () => "/tags/all",
      providesTags: ["Tags"],
    }),
    createTag: builder.mutation<TagDetailResponse, CreateTagData>({
      query: (body) => ({ url: "/tags", method: "POST", body }),
      invalidatesTags: ["Tags"],
    }),
    updateTag: builder.mutation<
      TagDetailResponse,
      { id: string; data: UpdateTagData }
    >({
      query: ({ id, data }) => ({
        url: `/tags/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Tags"],
    }),
    deleteTag: builder.mutation<void, string>({
      query: (id) => ({ url: `/tags/${id}`, method: "DELETE" }),
      invalidatesTags: ["Tags"],
    }),
  }),
});

export const {
  useGetTagsQuery,
  useGetAllTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
} = tagsApi;
