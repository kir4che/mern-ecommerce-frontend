import AddToCartBtn from "@/components/shared/AddToCartBtn";
import QuantityStepper from "@/components/shared/QuantityStepper";
import { useCart } from "@/hooks/useCart";
import type { Product } from "@/types";
import { useState } from "react";

interface ProductActionFormProps {
  product: Product;
  variant?: "card" | "detail";
}

const ProductActionForm = ({
  product,
  variant = "card",
}: ProductActionFormProps) => {
  const { cart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const existingItem = cart.find((item) => item.productId === product._id);
  const existingQuantity = existingItem?.quantity || 0;
  const availableStock = (product.countInStock || 0) - existingQuantity;

  if (variant === "card")
    return (
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2">
          <QuantityStepper
            variant="native"
            value={quantity}
            max={availableStock}
            onChange={setQuantity}
            className="w-15"
          />
          <AddToCartBtn
            product={product}
            quantity={quantity}
            onAddSuccess={() => setQuantity(1)}
          />
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-end gap-4">
      <QuantityStepper
        size="lg"
        value={quantity}
        max={availableStock}
        onChange={setQuantity}
      />
      <AddToCartBtn
        btnType="text"
        product={product}
        quantity={quantity}
        onAddSuccess={() => setQuantity(1)}
        className="w-52 rounded-full py-3"
      />
    </div>
  );
};

export default ProductActionForm;
