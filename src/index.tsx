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
