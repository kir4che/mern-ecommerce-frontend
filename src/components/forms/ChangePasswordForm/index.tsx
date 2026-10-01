import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useAlert } from "@/context/AlertContext";
import { useAuth } from "@/hooks/useAuth";
import { useChangePasswordMutation } from "@/store/api/apiAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getResponseMessage } from "@/utils/getResponseMessage";

const formSchema = z
  .object({
    currentPassword: z.string().min(1, "請輸入目前密碼"),
    newPassword: z
      .string()
      .min(8, "新密碼至少需要 8 個字元")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/,
        "新密碼需包含大小寫英文及數字"
      ),
    confirmPassword: z.string().min(1, "請再次輸入新密碼"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "兩次輸入的新密碼不一致",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof formSchema>;

const ChangePasswordForm = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { logout } = useAuth();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();

      reset();
      showAlert({
        variant: "success",
        message: getResponseMessage(result, "密碼已更新，請重新登入。"),
        dismissTimeout: 3000,
      });

      // 強制登出並導回 /login
      logout();
      navigate("/login");
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "修改密碼失敗，請稍後再試。"),
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <Input
        {...register("currentPassword")}
        type="password"
        label="目前密碼"
        placeholder="請輸入目前密碼"
        error={errors.currentPassword?.message}
        invalid={!!errors.currentPassword}
        autoComplete="current-password"
      />
      <Input
        {...register("newPassword")}
        type="password"
        label="新密碼"
        placeholder="至少 8 字元，包含大小寫英文及數字"
        error={errors.newPassword?.message}
        invalid={!!errors.newPassword}
        autoComplete="new-password"
      />
      <Input
        {...register("confirmPassword")}
        type="password"
        label="確認新密碼"
        placeholder="再次輸入新密碼"
        error={errors.confirmPassword?.message}
        invalid={!!errors.confirmPassword}
        autoComplete="new-password"
      />
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "修改中..." : "修改密碼"}
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
