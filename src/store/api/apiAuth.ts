import { apiSlice } from "./apiSlice";
import type {
  AuthLoginResponse,
  AuthUser,
  BaseResponse,
  GetMeResponse,
  LoginParams,
  RegisterParams,
  ResetPasswordParams,
  ResetPasswordTokenParams,
} from "@/types";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<BaseResponse, RegisterParams>({
      query: (body) => ({ url: "/user/register", method: "POST", body }),
    }),
    login: builder.mutation<AuthLoginResponse, LoginParams>({
      query: (body) => ({ url: "/user/login", method: "POST", body }),
    }),
    logout: builder.mutation<BaseResponse, void>({
      query: () => ({ url: "/user/logout", method: "POST" }),
    }),
    getMe: builder.query<GetMeResponse, void>({
      query: () => "/user/me",
    }),
    changePassword: builder.mutation<
      BaseResponse,
      { currentPassword: string; newPassword: string }
    >({
      query: (body) => ({ url: "/user/password", method: "PATCH", body }),
    }),
    resetPassword: builder.mutation<
      BaseResponse & { retryAfter?: number },
      ResetPasswordParams
    >({
      query: (body) => ({ url: "/user/reset-password", method: "POST", body }),
    }),
    resetPasswordToken: builder.mutation<
      BaseResponse,
      ResetPasswordTokenParams
    >({
      query: (body) => ({
        url: `/user/reset-password/${body.token}`,
        method: "PATCH",
        body: { password: body.password },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
  useLazyGetMeQuery,
  useChangePasswordMutation,
  useResetPasswordMutation,
  useResetPasswordTokenMutation,
} = authApi;

// 從 /user/me 或 /user/login 的回傳中取出 AuthUser
export const selectAuthUser = (data: AuthLoginResponse): AuthUser => data.user;
