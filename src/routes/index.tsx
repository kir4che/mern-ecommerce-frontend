import { type ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router";

import AdminPageSkeleton from "@/components/features/AdminPageSkeleton";
import AuthGate from "@/components/features/AuthGate";
import Loading from "@/components/ui/Loading";
import AdminLayout from "@/layouts/AdminLayout";
import AppLayout from "@/layouts/AppLayout";
import NotFound from "@/pages/notFound";

// 真的訪問到路由時才會去 import 對應的頁面，避免一開始就把所有頁面都打包進來。
const lazyRoute = (load: () => Promise<{ default: ComponentType }>) => ({
  lazy: async () => ({ Component: (await load()).default }),
});

export const router = createBrowserRouter([
  {
    path: "/admin",
    hydrateFallbackElement: <AdminPageSkeleton />,
    element: <AuthGate requireRole="admin" />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Navigate to="/admin/dashboard" replace /> },
          {
            path: "dashboard",
            ...lazyRoute(() => import("@/pages/admin/dashboard")),
          },
          {
            path: "orders",
            ...lazyRoute(() => import("@/pages/admin/orders")),
          },
          {
            path: "products",
            ...lazyRoute(() => import("@/pages/admin/products")),
          },
          {
            path: "products/new",
            ...lazyRoute(() => import("@/pages/admin/products/new")),
          },
          {
            path: "products/:id/edit",
            ...lazyRoute(() => import("@/pages/admin/products/[id]")),
          },
          { path: "news", ...lazyRoute(() => import("@/pages/admin/news")) },
          {
            path: "news/new",
            ...lazyRoute(() => import("@/pages/admin/news/new")),
          },
          {
            path: "news/:id/edit",
            ...lazyRoute(() => import("@/pages/admin/news/[id]")),
          },
          {
            path: "coupons",
            ...lazyRoute(() => import("@/pages/admin/coupons")),
          },
          { path: "users", ...lazyRoute(() => import("@/pages/admin/users")) },
          {
            path: "categories",
            ...lazyRoute(() => import("@/pages/admin/categories")),
          },
          { path: "tags", ...lazyRoute(() => import("@/pages/admin/tags")) },
          {
            path: "analytics",
            ...lazyRoute(() => import("@/pages/admin/analytics")),
          },
          { path: "*", element: <NotFound /> },
        ],
      },
    ],
  },
  {
    path: "/",
    hydrateFallbackElement: <Loading fullPage />,
    element: <AppLayout />,
    children: [
      { index: true, ...lazyRoute(() => import("@/App")) },
      { path: "about", ...lazyRoute(() => import("@/pages/about")) },
      { path: "news", ...lazyRoute(() => import("@/pages/news")) },
      {
        path: "news/:id",
        ...lazyRoute(() => import("@/pages/news/[id]")),
      },
      { path: "faq", ...lazyRoute(() => import("@/pages/faq")) },
      { path: "contact", ...lazyRoute(() => import("@/pages/contact")) },
      {
        path: "collections/:category",
        ...lazyRoute(() => import("@/pages/collections/[category]")),
      },
      {
        path: "products/:id",
        ...lazyRoute(() => import("@/pages/products/[id]")),
      },
      { path: "register", ...lazyRoute(() => import("@/pages/register")) },
      { path: "login", ...lazyRoute(() => import("@/pages/login")) },
      {
        path: "reset-password",
        ...lazyRoute(() => import("@/pages/reset-password")),
      },
      {
        path: "reset-password/:token",
        ...lazyRoute(() => import("@/pages/reset-password/[token]")),
      },
      { path: "cart", ...lazyRoute(() => import("@/pages/cart")) },
      {
        element: <AuthGate />,
        children: [
          {
            path: "checkout",
            ...lazyRoute(() => import("@/pages/checkout")),
          },
          {
            path: "checkout/:id",
            ...lazyRoute(() => import("@/pages/checkout")),
          },
          {
            path: "my-account",
            ...lazyRoute(() => import("@/pages/my-account")),
          },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
