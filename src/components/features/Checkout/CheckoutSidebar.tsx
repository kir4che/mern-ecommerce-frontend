import type { UseFormRegister } from "react-hook-form";

import type { BuyerFormData, CheckoutOrderItem } from "@/types";
import { addComma } from "@/utils/addComma";

import Textarea from "@/components/ui/Textarea";

interface CheckoutSidebarProps {
  isProcessing: boolean;
  orderItems: CheckoutOrderItem[];
  register: UseFormRegister<BuyerFormData>;
}

const OrderItemDisplay = ({
  imageUrl,
  title,
  price,
  quantity,
}: Omit<CheckoutOrderItem, "productId">) => {
  const amount = price * quantity;

  return (
    <li className="flex w-full gap-x-4">
      <img
        src={imageUrl || "https://placehold.co/144x144?text=No Image"}
        alt={title}
        className="aspect-square w-20 rounded object-cover"
        onError={(event) =>
          (event.currentTarget.src =
            "https://placehold.co/144x144?text=No Image")
        }
        loading="lazy"
      />
      <div className="flex w-full items-end justify-between">
        <div className="flex h-full flex-col justify-between">
          <p className="font-medium">{title}</p>
          <p className="text-sm leading-loose">
            NT$ {addComma(price)}
            <span className="ml-2">數量：{quantity}</span>
          </p>
        </div>
        <p className="text-base font-medium">NT$ {addComma(amount)}</p>
      </div>
    </li>
  );
};

export const CheckoutSidebar = ({
  isProcessing,
  orderItems,
  register,
}: CheckoutSidebarProps) => (
  <div className="order-1 flex w-full flex-1 flex-col lg:order-2">
    <ul className="mb-8 space-y-4">
      {orderItems.map((item) => (
        <OrderItemDisplay
          key={item.productId}
          imageUrl={item.imageUrl}
          title={item.title}
          price={item.price}
          quantity={item.quantity}
        />
      ))}
    </ul>
    <Textarea
      form="checkout-form"
      label="備註"
      {...register("note")}
      placeholder="有任何特殊需求或注意事項嗎？"
      rows={3}
      disabled={isProcessing}
    />
  </div>
);
