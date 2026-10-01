import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import { useLoginMutation, useLogoutMutation } from "@/store/api/apiAuth";
import { logout as clearAuth, loginSuccess } from "@/store/slices/authSlice";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [loginMutation, loginState] = useLoginMutation();
  const [logoutMutation, logoutState] = useLogoutMutation();

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean) => {
      const payload = await loginMutation({
        email,
        password,
        rememberMe,
      }).unwrap(); // 用 unwrap() 來直接取得成功的 payload 或拋出錯誤
      dispatch(loginSuccess(payload.user));
      return payload;
    },
    [dispatch, loginMutation]
  );

  const logout = useCallback(async () => {
    await logoutMutation();
    dispatch(clearAuth());
  }, [dispatch, logoutMutation]);

  const isLoading = loginState.isLoading || logoutState.isLoading;
  const err = loginState.error ?? logoutState.error;
  const error = err
    ? ((err as { data?: { message?: string } }).data?.message ??
      "登入失敗，請稍後再試。")
    : null;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
};

export type AuthHookReturn = ReturnType<typeof useAuth>;
