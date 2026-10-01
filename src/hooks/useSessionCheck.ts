import { useEffect } from "react";

import { useAppDispatch } from "@/store";
import { loginSuccess, setInitialized } from "@/store/slices/authSlice";
import { useLazyGetMeQuery } from "@/store/api/apiAuth";

// Session-based：頁面重新整理後，前端 Redux state 會重置為未登入。
// 這個 hook 在 App 初始化時呼叫 /user/me，若 session cookie 有效就還原登入狀態。
export const useSessionCheck = () => {
  const dispatch = useAppDispatch();
  const [trigger] = useLazyGetMeQuery();

  useEffect(() => {
    trigger(undefined, false)
      .unwrap()
      .then((data) => {
        if (data.user) dispatch(loginSuccess(data.user));
        else dispatch(setInitialized());
      })
      .catch(() => {
        // 未登入或網路錯誤，標記初始化已完成。
        dispatch(setInitialized());
      });
  }, [dispatch, trigger]);
};
