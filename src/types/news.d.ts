import type { BaseResponse } from "./common";

export interface NewsItem {
  _id: string;
  title: string;
  category: string;
  date: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetNewsParams {
  page?: number;
  limit?: number;
}

export interface CreateNewsData {
  title: string;
  category: string;
  date: string;
  content: string;
  imageUrl?: string;
}

export type UpdateNewsData = Partial<CreateNewsData>;

export interface NewsResponse extends BaseResponse {
  news: NewsItem[];
  total: number;
  limit: number;
  page: number;
  totalPages: number;
}

export interface NewsDetailResponse extends BaseResponse {
  newsItem: NewsItem;
}

export interface UpdateNewsResponse extends BaseResponse {
  news: NewsItem;
}
