import { useCallback, useEffect, useRef } from "react";
import { useBlocker } from "react-router";

import { useConfirmDialog } from "@/context/ConfirmDialogContext";

export const useUnsavedChanges = (isDirty: boolean) => {
  const allowNextNavigationRef = useRef(false);

  // 瀏覽器重整或關閉頁面時，阻止離開。
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // 阻止路由變更，除非使用者確認離開。
  const blocker = useBlocker(() => {
    if (allowNextNavigationRef.current) {
      allowNextNavigationRef.current = false;
      return false;
    }
    return isDirty;
  });

  const { open: openLeaveConfirm } = useConfirmDialog();

  const markSaved = useCallback(() => {
    allowNextNavigationRef.current = true;
  }, []);

  // 當路由變更被阻止時，顯示確認對話框。
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    openLeaveConfirm({
      title: "未儲存的變更",
      message: "你確定要離開嗎？尚未儲存的內容將會遺失。",
      confirmText: "離開",
      cancelText: "留在頁面",
      onConfirm: () => blocker.proceed(),
      onCancel: () => blocker.reset(),
    });

    // blocker 是 stable reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocker.state, openLeaveConfirm]);

  return { markSaved };
};
