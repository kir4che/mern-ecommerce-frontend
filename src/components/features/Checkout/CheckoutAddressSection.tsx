import type { FieldErrors, UseFormRegister } from "react-hook-form";

import type { BuyerFormData } from "@/types";
import type { UserAddress } from "@/types";
import { cn } from "@/utils/cn";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

interface CheckoutAddressSectionProps {
  errors: FieldErrors<BuyerFormData>;
  isDisabled: boolean;
  isProcessing: boolean;
  register: UseFormRegister<BuyerFormData>;
  savedAddresses: UserAddress[];
  selectedAddressId: string | null;
  showManualAddressForm: boolean;
  useManualAddress: boolean;
  onSelectAddress: (address: UserAddress) => void;
  onToggleManualAddress: () => void;
}

export const CheckoutAddressSection = ({
  errors,
  isDisabled,
  isProcessing,
  register,
  savedAddresses,
  selectedAddressId,
  showManualAddressForm,
  useManualAddress,
  onSelectAddress,
  onToggleManualAddress,
}: CheckoutAddressSectionProps) => (
  <div className="mb-8 space-y-4">
    <h3 className="border-b border-slate-400 pb-2 text-base">收件資訊</h3>
    {savedAddresses.length > 0 && (
      <div className="space-y-2">
        {savedAddresses.map((address) => (
          <label
            key={address._id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded border p-3 transition-colors",
              selectedAddressId === address._id
                ? "border-primary bg-primary/5"
                : "hover:bg-gray-50"
            )}
          >
            <input
              type="radio"
              name="savedAddress"
              className="radio mt-0.5 radio-sm"
              checked={selectedAddressId === address._id}
              onChange={() => onSelectAddress(address)}
            />
            <div className="flex-1 text-sm">
              <p className="font-medium">
                {address.label}
                {address.isDefault && (
                  <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-xs text-white">
                    預設
                  </span>
                )}
              </p>
              <p className="mt-0.5 text-gray-600">
                {address.name} / {address.phone}
              </p>
              <p className="text-gray-500">{address.address}</p>
            </div>
          </label>
        ))}
        <Button
          onClick={onToggleManualAddress}
          className="ml-auto block text-sm"
        >
          {useManualAddress ? "取消新增" : "+ 使用其他收件資訊"}
        </Button>
      </div>
    )}
    {showManualAddressForm && (
      <div className="space-y-3 rounded border bg-gray-50 p-4">
        {savedAddresses.length === 0 && (
          <p className="text-sm text-gray-500">
            尚未儲存地址，請填寫收件資訊。
          </p>
        )}
        <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
          <Input
            {...register("name")}
            label="收件人姓名"
            error={errors.name?.message}
            invalid={!!errors.name}
            disabled={isDisabled}
          />
          <Input
            {...register("phone")}
            type="tel"
            label="聯絡電話"
            placeholder="0912345678"
            error={errors.phone?.message}
            invalid={!!errors.phone}
            disabled={isDisabled}
          />
        </div>
        <Input
          {...register("address")}
          label="配送地址"
          placeholder="請填寫完整地址"
          error={errors.address?.message}
          invalid={!!errors.address}
          disabled={isProcessing}
        />
      </div>
    )}
  </div>
);
