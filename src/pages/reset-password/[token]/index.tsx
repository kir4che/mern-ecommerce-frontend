import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { useResetPasswordTokenMutation } from "@/store/api/apiAuth";
import { getErrorMessage, getErrorStatus } from "@/utils/getErrorMessage";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const resetPasswordTokenSchema = z
  .object({
    password: z
      .string()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
        message: "密碼需包含大小寫英文及數字，且至少 8 字元",
      }),
    confirmPassword: z.string().min(1, { message: "請再次輸入密碼" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "兩次輸入的密碼不一致",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordTokenSchema>;

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { showAlert } = useAlert();
  const [resetPasswordToken, { isLoading }] = useResetPasswordTokenMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordTokenSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async ({ password }: ResetPasswordFormData) => {
    if (!token) {
      showAlert({ variant: "error", message: "無效的重設連結" });
      return;
    }

    try {
      await resetPasswordToken({ token, password }).unwrap();
      navigate("/login", {
        replace: true,
        state: { message: "密碼已重設，請用新密碼登入。" },
      });
    } catch (err: unknown) {
      if (getErrorStatus(err) === 400) {
        const isTokenError =
          (err as { data?: { code?: string } })?.data?.code ===
          "INVALID_RESET_TOKEN";
        showAlert({
          variant: "error",
          message: getErrorMessage(
            err,
            "連結無效或已過期，請重新申請重設密碼。"
          ),
          autoDismiss: isTokenError ? false : undefined,
          ...(isTokenError && {
            action: {
              label: "重新申請",
              onClick: () => navigate("/reset-password"),
            },
          }),
        });
      } else showAlert({ variant: "error", message: "發生錯誤，請稍後再試。" });
    }
  };

  const isBtnDisabled = isLoading || isSubmitting;

  return (
    <div className="m-auto w-full space-y-4 px-5 md:px-8">
      <h2 className="mb-8 text-center">設定新密碼</h2>
      <form
        className="mx-auto flex max-w-72 flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          {...register("password")}
          type="password"
          placeholder="請輸入新密碼"
          error={errors.password?.message}
          invalid={!!errors.password}
          autoComplete="new-password"
        />
        <Input
          {...register("confirmPassword")}
          type="password"
          placeholder="請再次輸入密碼"
          error={errors.confirmPassword?.message}
          invalid={!!errors.confirmPassword}
          autoComplete="new-password"
        />
        <Button
          type="submit"
          disabled={isBtnDisabled}
          aria-disabled={isBtnDisabled}
          className="mx-auto mt-6 w-full py-2.5"
        >
          {isBtnDisabled ? "處理中" : "確認重設"}
        </Button>
      </form>
    </div>
  );
};

export default ResetPassword;
