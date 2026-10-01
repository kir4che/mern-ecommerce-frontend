import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export const couponSchema = z.object({
  code: z.string().min(1, { message: "請輸入優惠碼" }),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.coerce.number().min(0.01, { message: "折扣值必須大於 0" }),
  minPurchaseAmount: z.coerce.number().min(0).optional().default(0),
  expiryDate: z.string().min(1, { message: "請選擇到期日" }),
  isActive: z.boolean().optional().default(true),
});

export type CouponFormInput = z.input<typeof couponSchema>;
export type CouponFormData = z.output<typeof couponSchema>;

export const INITIAL_FORM: CouponFormInput = {
  code: "",
  discountType: "percentage",
  discountValue: 0,
  minPurchaseAmount: 0,
  expiryDate: "",
  isActive: true,
};

// 建立 react-hook-form 的表單實例
export const buildCouponPayload = (values: CouponFormData) => {
  // 將到期日設為當天的 23:59:59
  const expiry = new Date(values.expiryDate);
  expiry.setHours(23, 59, 59, 999);

  return {
    code: values.code.trim().toUpperCase(),
    discountType: values.discountType,
    discountValue: values.discountValue,
    minPurchaseAmount: values.minPurchaseAmount ?? 0,
    expiryDate: expiry.toISOString(),
    isActive: true,
  };
};

interface CouponFormProps {
  form: ReturnType<typeof useForm<CouponFormInput, unknown, CouponFormData>>;
}

const CouponForm = ({ form }: CouponFormProps) => {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = form;
  // 監聽 discountType 變化，以便動態更新折扣值 label。
  const discountType = watch("discountType");

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Input
        label="優惠碼"
        {...register("code")}
        error={errors.code?.message}
        invalid={!!errors.code}
        placeholder="ex. MARCH10"
        required
      />
      <Controller
        name="discountType"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            label="折扣類型"
            options={[
              { label: "百分比", value: "percentage" },
              { label: "固定金額", value: "fixed" },
            ]}
            onChange={(_, value) => field.onChange(value)}
          />
        )}
      />
      <Input
        type="number"
        label={discountType === "percentage" ? "折扣 (%)" : "折扣金額"}
        {...register("discountValue")}
        error={errors.discountValue?.message}
        invalid={!!errors.discountValue}
        min={0}
        step={1}
        required
      />
      <Input
        type="number"
        label="最低消費金額"
        {...register("minPurchaseAmount")}
        min={0}
        step={5}
      />
      <Input
        type="date"
        label="到期日"
        {...register("expiryDate")}
        error={errors.expiryDate?.message}
        invalid={!!errors.expiryDate}
        className="md:col-span-2"
        required
      />
    </div>
  );
};

export default CouponForm;
