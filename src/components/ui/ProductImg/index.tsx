import { useState } from "react";

import BlurImage from "@/components/ui/BlurImage";
import type { Product } from "@/types";
import { cn } from "@/utils/cn";

const FALLBACK_IMG = "https://placehold.co/300x300?text=No+Image";

interface ProductImgProps {
  product: Partial<Product>;
  className?: string;
  onLoad?: () => void;
}

const ProductImg = ({ product, className, onLoad }: ProductImgProps) => {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <BlurImage
      src={hasError ? FALLBACK_IMG : (product.imageUrl ?? "")}
      alt={product.title || "商品圖片"}
      className={cn(
        "size-full object-cover object-center select-none",
        className
      )}
      onError={handleError}
      onLoad={onLoad}
    />
  );
};

export default ProductImg;
