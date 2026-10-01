import type { BaseResponse } from "./common";

export type UserRole = "admin" | "user";

export interface RegisterParams {
  name: string;
  email: string;
  password: string;
}

export interface LoginParams {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface ResetPasswordParams {
  email: string;
}

export interface ResetPasswordTokenParams {
  token: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export type AuthLoginResponse = BaseResponse & { user: AuthUser };

export type GetMeResponse = BaseResponse & { user: AuthUser | null };

export interface UserAddress {
  _id: string;
  label: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
}

export interface AddressInput {
  label: string;
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
}

export interface AddressListResponse extends BaseResponse {
  addresses: UserAddress[];
}

export interface AdminUser {
  _id: string;
  name?: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface UsersResponse extends BaseResponse {
  users: AdminUser[];
  total: number;
  page: number;
  totalPages: number;
}
