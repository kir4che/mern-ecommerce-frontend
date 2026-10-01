import { createContext, use, useCallback, type ReactNode } from "react";
import { toast } from "sonner";

export interface Alert {
  variant: "info" | "success" | "error" | "warning";
  message: string;
  autoDismiss?: boolean;
  dismissTimeout?: number;
  floating?: boolean;
  top?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AlertContextType {
  showAlert: (alert: Alert) => void;
  hideAlert: () => void;
}

const AlertContext = createContext<AlertContextType | null>(null);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const showAlert = useCallback((newAlert: Alert) => {
    const { variant, message, action, dismissTimeout } = newAlert;
    const duration = dismissTimeout ?? 3000;

    const options: Parameters<typeof toast.success>[1] = {
      duration,
      position: "top-center",
      ...(action
        ? { action: { label: action.label, onClick: action.onClick } }
        : {}),
    };

    switch (variant) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "warning":
        toast.warning(message, options);
        break;
      case "info":
        toast.info(message, options);
        break;
    }
  }, []);

  const hideAlert = useCallback(() => {
    toast.dismiss();
  }, []);

  return (
    <AlertContext value={{ showAlert, hideAlert }}>{children}</AlertContext>
  );
};

export const useAlert = (): AlertContextType => {
  const context = use(AlertContext);
  if (context === null)
    throw new Error("useAlert 必須在 AlertProvider 內被使用！");
  return context;
};
