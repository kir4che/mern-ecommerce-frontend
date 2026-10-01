import type { BaseResponse } from "./common";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  imageUrl?: string;
  isActive: boolean;
  sortOrder: number;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryData {
  name: string;
  slug: string;
  imageUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export type UpdateCategoryData = Partial<CreateCategoryData>;

export interface CategoriesResponse extends BaseResponse {
  categories: Category[];
}

export interface CategoryDetailResponse extends BaseResponse {
  category: Category;
}
