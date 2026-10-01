import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { useResetPasswordMutation } from "@/store/api/apiAuth";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import MailIcon from "@/assets/icons/mail.inline.svg?react";

const resetPasswordSchema = z.object({
  email: z.email({ message: "請輸入有效的 Email 格式" }),
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordResponse {
  success: boolean;
  retryAfter?: number;
  message?: string;
  code?: string;
}

interface ResetPasswordError {
  data?: ResetPasswordResponse;
}

const RequestResetLink = () => {
  const { showAlert } = useAlert();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [countdown, setCountdown] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { email: "" },
  });

  // 避免使用者短時間內重複發送重設密碼連結
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [countdown]);

  const onSubmit = async ({ email }: ResetPasswordFormData) => {
    try {
      const res = (await resetPassword({
        email,
      }).unwrap()) as ResetPasswordResponse;
      showAlert({
        variant: "success",
        message: "如果這個 Email 已註冊，我們會將重設密碼連結寄到您的信箱。",
      });
      setCountdown(res.retryAfter ?? 60);
    } catch (err: unknown) {
      const error = err as ResetPasswordError;
      const retryAfter = error.data?.retryAfter;

      if (retryAfter) {
        setCountdown(retryAfter);
        showAlert({
          variant: "error",
          message: `請等待 ${retryAfter} 秒後再試。`,
        });
        return;
      }

      showAlert({
        variant: "error",
        message: "目前無法發送重設連結，請稍後再試。",
      });
    }
  };

  const isBtnDisabled = isLoading || isSubmitting || countdown > 0;

  return (
    <div className="m-auto w-full space-y-4 px-5 md:px-8">
      <h2 className="text-center">忘記密碼</h2>
      <p className="text-center text-sm text-gray-600">
        請輸入您註冊時使用的 Email，我們將發送重設密碼的連結給您。
      </p>
      <form
        className="mx-auto flex max-w-72 flex-col gap-8"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <Input
          {...register("email")}
          type="email"
          placeholder="請輸入您的 Email"
          icon={MailIcon}
          error={errors.email?.message}
          invalid={!!errors.email}
        />
        <Button
          type="submit"
          disabled={isBtnDisabled}
          aria-disabled={isBtnDisabled}
          className="py-2.5"
        >
          {countdown > 0
            ? `請等待 ${countdown} 秒後重試`
            : isLoading || isSubmitting
              ? "發送中"
              : "發送重設連結"}
        </Button>
      </form>
    </div>
  );
};

export default RequestResetLink;
