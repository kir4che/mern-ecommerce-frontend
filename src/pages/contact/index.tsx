import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useAlert } from "@/context/AlertContext";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { getResponseMessage } from "@/utils/getResponseMessage";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";

const contactSchema = z.object({
  name: z.string().trim().min(1, "").max(100, "姓名不能超過 100 個字"),
  email: z
    .string()
    .trim()
    .email({ message: "請輸入有效的 Email 格式" })
    .max(254, "Email 不能超過 254 個字"),
  subject: z.string().trim().min(1, "").max(200, "主旨不能超過 200 個字"),
  message: z.string().trim().min(1, "").max(5000, "訊息內容不能超過 5000 個字"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        const requestError = new Error("發送失敗");
        Object.assign(requestError, { data: error, status: res.status });
        throw requestError;
      }

      const result = await res.json();

      reset();
      showAlert({
        variant: "success",
        message: getResponseMessage(result, "訊息已送出，我們會盡快回覆您。"),
        top: "top-28",
      });
    } catch (err: unknown) {
      showAlert({
        variant: "error",
        message: getErrorMessage(err, "發送訊息失敗，請稍後再試"),
        top: "top-28",
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 md:px-8">
      <div className="mb-8 space-y-4 text-center">
        <h2 className="text-3xl font-bold tracking-[0.2em]">聯繫我們</h2>
        <p className="mx-auto max-w-sm text-sm text-gray-500">
          關於訂單、商品細節或合作提案，歡迎填寫下表，我們將於 24
          小時內由專人與您聯繫。
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full space-y-4 bg-white p-4 tablet:border tablet:border-slate-100 tablet:p-8 tablet:shadow-sm md:p-12"
        noValidate
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Input
            {...register("name")}
            label="姓名"
            error={errors.name?.message}
            invalid={!!errors.name}
            disabled={isSubmitting}
          />
          <Input
            {...register("email")}
            label="Email"
            error={errors.email?.message}
            invalid={!!errors.email}
            disabled={isSubmitting}
          />
        </div>
        <Input
          {...register("subject")}
          label="主旨"
          error={errors.subject?.message}
          invalid={!!errors.subject}
          disabled={isSubmitting}
        />
        <Textarea
          {...register("message")}
          label="訊息內容"
          rows={5}
          disabled={isSubmitting}
          error={errors.message?.message}
          invalid={!!errors.message}
        />

        <div className="pt-4">
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting}
            className="mx-auto block w-full max-w-xs py-4 text-base tracking-widest uppercase"
          >
            {isSubmitting ? "傳送中..." : "傳送訊息"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Contact;
