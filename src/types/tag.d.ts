import type { BaseResponse } from "./common";

export interface Tag {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagData {
  name: string;
  slug: string;
  isActive?: boolean;
}

export type UpdateTagData = Partial<CreateTagData>;

export interface TagsResponse extends BaseResponse {
  tags: Tag[];
}

export interface TagDetailResponse extends BaseResponse {
  tag: Tag;
}
