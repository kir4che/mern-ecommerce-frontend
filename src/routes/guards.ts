import { redirect, type LoaderFunctionArgs } from "react-router";

import { store } from "@/store";

export const getLoginRedirectPath = (from: string) => {
  const searchParams = new URLSearchParams({ from });
  return `/login?${searchParams.toString()}`;
};

// 導向 /login
export const redirectToLogin = ({ request }: LoaderFunctionArgs) => {
  const currentUrl = new URL(request.url);
  // 將當前頁面的路徑、查詢參數和 hash 記錄在 loginUrl 的 searchParams 中，方便登入後導回。
  const from = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`;

  throw redirect(getLoginRedirectPath(from));
};

// 驗證使用者是否已登入
export const requireAuthenticated = (args: LoaderFunctionArgs) => {
  if (!store.getState().auth.isAuthenticated) return redirectToLogin(args);
  return null;
};

// 驗證使用者是否為 admin
export const requireAdmin = (args: LoaderFunctionArgs) => {
  const { isAuthenticated, user } = store.getState().auth;

  if (!isAuthenticated || !user) return redirectToLogin(args);
  if (user.role !== "admin") throw redirect("/");

  return null;
};
