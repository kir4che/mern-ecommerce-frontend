import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Input from "@/components/ui/Input";

import LockIcon from "@/assets/icons/lock.inline.svg?react";
import MailIcon from "@/assets/icons/mail.inline.svg?react";

const loginSchema = z.object({
  email: z.email({ message: "請輸入有效的 Email 格式" }),
  password: z.string().min(1, { message: "請輸入密碼" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

type LoginLocationState = {
  from?: { pathname: string; search?: string };
  message?: string;
  email?: string;
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, isLoading } = useAuth();
  const { showAlert } = useAlert();

  const state = (location.state as LoginLocationState | null) ?? null;
  const successMessage = state?.message;
  const redirectPath = searchParams.get("from") ?? undefined;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: state?.email ?? "", password: "" },
  });

  const [rememberMe, setRememberMe] = useState(false);

  // 當註冊成功或重設密碼成功時跳轉到登入頁面，並顯示成功訊息（透過 navigate 傳來的）。
  useEffect(() => {
    if (!successMessage || typeof successMessage !== "string") return;
    showAlert({
      variant: "success",
      message: successMessage,
      dismissTimeout: 5000,
    });
  }, [successMessage, showAlert]);

  const onSubmit = async ({ email, password }: LoginFormData) => {
    try {
      await login(email, password, rememberMe);

      const fromState = state?.from; // 使用者登入前的頁面路徑（若有），可於登入後導回去。

      const isSafePath = (p?: string): p is string =>
        typeof p === "string" && p.startsWith("/") && !p.startsWith("//");

      const stateTarget = fromState?.pathname
        ? `${fromState.pathname}${fromState.search || ""}`
        : undefined;

      const target = isSafePath(redirectPath)
        ? redirectPath
        : isSafePath(stateTarget)
          ? stateTarget
          : "/";

      // 登入成功後導回原本的頁面，若沒有則導回首頁。
      // replace: true → 導回後瀏覽記錄不留登入頁面，避免返回登入頁。
      navigate(target, { replace: true });
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "登入失敗，請檢查帳號密碼"),
      });
    }
  };

  return (
    <div className="m-auto w-full max-w-sm px-5 md:px-8">
      <h2 className="mb-8 text-center">登入會員</h2>
      <form
        className="flex flex-col gap-4 md:text-sm"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          {...register("email")}
          type="email"
          placeholder="Email"
          icon={MailIcon}
          error={errors.email?.message}
          invalid={!!errors.email}
          autoComplete="email"
          required
        />
        <Input
          {...register("password")}
          type="password"
          placeholder="密碼"
          icon={LockIcon}
          error={errors.password?.message}
          invalid={!!errors.password}
          autoComplete="current-password"
          required
        />
        <div className="flex-between">
          <Checkbox
            id="rememberMe"
            label="記住我"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link
            to="/reset-password"
            className="text-sm text-primary hover:underline"
          >
            忘記密碼？
          </Link>
        </div>
        <Button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="mx-auto mt-4 w-28 py-2"
        >
          {isLoading || isSubmitting ? "登入中" : "登入"}
        </Button>
        <p className="text-center">
          還沒有帳號？
          <Link to="/register" className="link underline-offset-4">
            立即註冊
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
