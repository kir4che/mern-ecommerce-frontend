import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { useRegisterMutation } from "@/store/api/apiAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getResponseMessage } from "@/utils/getResponseMessage";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

import LockIcon from "@/assets/icons/lock.inline.svg?react";
import MailIcon from "@/assets/icons/mail.inline.svg?react";

const registerSchema = z.object({
  email: z.email({ message: "請輸入有效的 Email 格式" }),
  password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message: "密碼需包含大小寫英文及數字，且至少 8 字元",
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const [registerApi, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async ({ email, password }: RegisterFormData) => {
    try {
      const result = await registerApi({
        name: email,
        email,
        password,
      }).unwrap();
      const successMessage = getResponseMessage(
        result,
        "註冊成功，請登入會員帳戶。"
      );

      showAlert({
        variant: "success",
        message: successMessage,
      });
      navigate("/login", {
        state: {
          email,
          message: successMessage,
        },
      });
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "註冊失敗，請稍後再試"),
      });
    }
  };

  return (
    <div className="m-auto w-full max-w-sm px-5 md:px-8">
      <h2 className="mb-8 text-center">註冊會員</h2>
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
          autoComplete="new-password"
          required
        />
        <Button
          type="submit"
          className="mx-auto mt-4 w-28 py-2"
          disabled={isLoading || isSubmitting}
        >
          {isLoading || isSubmitting ? "註冊中" : "註冊"}
        </Button>
        <p className="text-center">
          已經有帳號了？
          <Link to="/login" className="link underline-offset-4">
            點此登入
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
