import { apiSlice } from "./apiSlice";
import type {
  CategoriesResponse,
  CategoryDetailResponse,
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types";

const categoriesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => "/categories",
    }),
    getAllCategories: builder.query<CategoriesResponse, void>({
      query: () => "/categories/all",
      providesTags: ["Categories"],
    }),
    createCategory: builder.mutation<
      CategoryDetailResponse,
      CreateCategoryData
    >({
      query: (body) => ({ url: "/categories", method: "POST", body }),
      invalidatesTags: ["Categories"],
    }),
    updateCategory: builder.mutation<
      CategoryDetailResponse,
      { id: string; data: UpdateCategoryData }
    >({
      query: ({ id, data }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Categories"],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["Categories"],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
