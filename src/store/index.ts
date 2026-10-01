import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { cartListenerMiddleware } from "@/store/middleware/cartMiddleware";
import { apiSlice } from "@/store/api/apiSlice";
import authReducer from "@/store/slices/authSlice";
import guestCartReducer from "@/store/slices/guestCartSlice";
import { loadGuestCartItems } from "@/store/storage/cartStorage";

const reducer = combineReducers({
  auth: authReducer,
  guestCart: guestCartReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

type PreloadedState = Partial<ReturnType<typeof reducer>>;

const loadPreloadedState = (): PreloadedState => {
  // 還原訪客購物車，讓重新整理後仍能看到商品。
  const state: PreloadedState = {
    guestCart: {
      items: loadGuestCartItems(),
      hasShownLoginPrompt: false,
    },
  };

  return state;
};

export const createAppStore = (preloadedState?: PreloadedState) =>
  configureStore({
    reducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(
          // 優先執行
          cartListenerMiddleware.middleware
        )
        // RTK Query middleware 要加，query/mutation 才會正常運作。
        .concat(apiSlice.middleware),
    preloadedState,
  });

export const store = createAppStore(loadPreloadedState());

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
