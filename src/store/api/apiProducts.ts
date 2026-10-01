import { apiSlice } from "./apiSlice";
import type {
  CreateProductData,
  CreateProductResponse,
  GetProductsParams,
  ProductDetailResponse,
  ProductsResponse,
  UpdateProductData,
} from "@/types";

type GetProductsInfiniteParams = Omit<GetProductsParams, "page">;

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        if (params.category) searchParams.append("category", params.category);
        if (params.tag) searchParams.append("tag", params.tag);
        if (params.limit) searchParams.append("limit", params.limit.toString());
        if (params.page) searchParams.append("page", params.page.toString());
        if (params.sortBy) searchParams.append("sortBy", params.sortBy);
        if (params.order) searchParams.append("order", params.order);
        if (params.search) searchParams.append("search", params.search);
        return `/products?${searchParams.toString()}`;
      },
      providesTags: ["Products"],
    }),
    getProductsPaged: builder.infiniteQuery<
      ProductsResponse,
      GetProductsInfiniteParams,
      number
    >({
      query: ({ queryArg, pageParam }) => {
        const searchParams = new URLSearchParams();
        if (queryArg.category)
          searchParams.append("category", queryArg.category);
        if (queryArg.tag) searchParams.append("tag", queryArg.tag);
        if (queryArg.sortBy) searchParams.append("sortBy", queryArg.sortBy);
        if (queryArg.order) searchParams.append("order", queryArg.order);
        if (queryArg.search) searchParams.append("search", queryArg.search);
        searchParams.append("limit", "10");
        searchParams.append("page", String(pageParam));
        return `/products?${searchParams.toString()}`;
      },
      infiniteQueryOptions: {
        initialPageParam: 1,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
          const fetchedSoFar = lastPageParam * 10;
          return fetchedSoFar < (lastPage.total ?? 0)
            ? lastPageParam + 1
            : undefined;
        },
      },
      providesTags: ["Products"],
    }),
    getProductById: builder.query<ProductDetailResponse, string>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Product" as const, id }],
    }),
    createProduct: builder.mutation<CreateProductResponse, CreateProductData>({
      query: (data) => ({ url: "/products", method: "POST", body: data }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation<
      ProductDetailResponse,
      { id: string; data: UpdateProductData }
    >({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        "Products",
        { type: "Product" as const, id },
      ],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductsPagedInfiniteQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
