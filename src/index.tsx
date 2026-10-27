import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router/dom";

import { AlertProvider } from "@/context/AlertContext";
import { ConfirmDialogProvider } from "@/context/ConfirmDialogContext";
import { useSessionCheck } from "@/hooks/useSessionCheck";
import { router } from "@/routes";
import { store } from "@/store";
import "swiper/css";
import "./styles.css";

// 監聽 Vite 動態分塊載入失敗
window.addEventListener("vite:preloadError", () => {
  const lastReload = sessionStorage.getItem("vite_preload_error_reload");
  const now = Date.now();
  if (!lastReload || now - Number(lastReload) > 10000) {
    sessionStorage.setItem("vite_preload_error_reload", String(now));
    window.location.reload();
  }
});

const RootApp = () => {
  useSessionCheck();

  return (
    <AlertProvider>
      <ConfirmDialogProvider>
        <RouterProvider router={router} />
      </ConfirmDialogProvider>
    </AlertProvider>
  );
};

createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <RootApp />
  </Provider>
);
