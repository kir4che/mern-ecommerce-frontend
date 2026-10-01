import {
  render as rtlRender,
  type RenderOptions,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";
import { Toaster } from "sonner";

import { AlertProvider } from "@/context/AlertContext";
import { ConfirmDialogProvider } from "@/context/ConfirmDialogContext";
import { createAppStore, type AppStore } from "@/store";
import type { Product } from "@/types";

interface AppRenderOptions extends Omit<RenderOptions, "wrapper"> {
  route?: string;
  withToaster?: boolean;
}

const AppProviders = ({
  children,
  route,
  withToaster,
  store,
}: {
  children: React.ReactNode;
  route: string;
  withToaster: boolean;
  store: AppStore;
}) => (
  <Provider store={store}>
    <AlertProvider>
      <ConfirmDialogProvider>
        <MemoryRouter initialEntries={[route]}>
          {children}
          {withToaster ? <Toaster /> : null}
        </MemoryRouter>
      </ConfirmDialogProvider>
    </AlertProvider>
  </Provider>
);

const render = (
  ui: ReactElement,
  { route = "/", withToaster = false, ...options }: AppRenderOptions = {}
) => {
  const store = createAppStore();

  return {
    user: userEvent.setup(),
    store,
    ...rtlRender(ui, {
      wrapper: ({ children }) => (
        <AppProviders route={route} withToaster={withToaster} store={store}>
          {children}
        </AppProviders>
      ),
      ...options,
    }),
  };
};

export * from "@testing-library/react";
export { render };

const defaultProduct: Product = {
  _id: "test-id",
  title: "測試商品",
  tagline: "測試標語",
  categories: [],
  description: "測試描述",
  price: 100,
  content: "測試內容",
  expiryDate: "2030-12-31",
  allergens: [],
  delivery: "宅配",
  storage: "常溫",
  ingredients: "測試成分",
  nutrition: "測試營養",
  countInStock: 10,
  salesCount: 0,
  tags: [],
  imageUrl: "test.jpg",
};

// Partial<Product> 代表可以只提供部分欄位，再和預設商品合併。
export const makeMockProduct = (overrides?: Partial<Product>): Product => ({
  ...defaultProduct,
  ...overrides,
});
