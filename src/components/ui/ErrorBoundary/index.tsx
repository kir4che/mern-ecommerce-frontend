import { Component, type ErrorInfo, type ReactNode } from "react";

import Button from "@/components/ui/Button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  // constructor
  state: State = { hasError: false };

  // 子元件 throw error 時 React 呼叫，以更新 state 顯示 fallback UI。
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV)
      console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex-center min-h-[60vh] flex-col gap-4 p-8 text-center">
        <h2 className="text-xl font-bold text-red-600">頁面發生錯誤</h2>
        <p className="max-w-md text-gray-600">
          {import.meta.env.DEV && this.state.error?.message
            ? this.state.error.message
            : "請重整頁面或聯絡管理員"}
        </p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          重整頁面
        </Button>
      </div>
    );
  }
}

export default ErrorBoundary;
