import type { ReactNode } from "react";

import type { PaymentMethod } from "@/types";
import { cn } from "@/utils/cn";

import Button from "@/components/ui/Button";

import CheckIcon from "@/assets/icons/check-circle.inline.svg?react";
import JCBIcon from "@/assets/icons/jcb-logo.inline.svg?react";
import MasterCardIcon from "@/assets/icons/mastercard-logo.inline.svg?react";
import UncheckIcon from "@/assets/icons/uncheck-circle.inline.svg?react";
import VisaIcon from "@/assets/icons/visa-logo.inline.svg?react";

interface PaymentMethodOption {
  method: PaymentMethod;
  label: string;
  additionalIcons?: ReactNode[];
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  { method: "ATM", label: "ATM 虛擬帳號" },
  { method: "WebATM", label: "WebATM" },
  {
    method: "Credit",
    label: "信用卡",
    additionalIcons: [
      <VisaIcon key="visa" className="size-8" />,
      <MasterCardIcon key="mastercard" className="size-8" />,
      <JCBIcon key="jcb" className="size-6" />,
    ],
  },
];

interface CheckoutPaymentSectionProps {
  isDisabled: boolean;
  paymentMethod: PaymentMethod;
  onChangePaymentMethod: (method: PaymentMethod) => void;
}

export const CheckoutPaymentSection = ({
  isDisabled,
  paymentMethod,
  onChangePaymentMethod,
}: CheckoutPaymentSectionProps) => (
  <div className="mb-8 space-y-4">
    <h3 className="mb-4 border-b border-slate-400 pb-2 text-base">
      付款方式
      <span className="text-sm font-normal">
        （透過綠界金流提供安全的付款服務）
      </span>
    </h3>
    <div className="flex flex-wrap items-center gap-3">
      {PAYMENT_METHODS.map(({ method, label, additionalIcons }) => (
        <Button
          key={method}
          variant="secondary"
          className={cn(
            "h-12 rounded px-3 text-sm",
            paymentMethod === method ? "border-2" : ""
          )}
          type="button"
          disabled={isDisabled}
          onClick={() => onChangePaymentMethod(method)}
        >
          <span className="flex items-center gap-2 whitespace-nowrap">
            {paymentMethod === method ? (
              <CheckIcon className="shrink-0" />
            ) : (
              <UncheckIcon className="shrink-0" />
            )}
            <span>{label}</span>
            {additionalIcons && (
              <span className="ml-1 flex shrink-0 items-center gap-1">
                {additionalIcons.map((iconElement, index) => (
                  <span key={index} className="flex items-center">
                    {iconElement}
                  </span>
                ))}
              </span>
            )}
          </span>
        </Button>
      ))}
    </div>
  </div>
);
