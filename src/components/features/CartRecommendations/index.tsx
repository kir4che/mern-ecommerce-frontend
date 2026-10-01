import { useRef } from "react";
import { Link } from "react-router";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import AddToCartBtn from "@/components/shared/AddToCartBtn";
import Button from "@/components/ui/Button";
import type { Product } from "@/types";
import { addComma } from "@/utils/addComma";
import { cn } from "@/utils/cn";

import ArrowLeftIcon from "@/assets/icons/nav-arrow-left.inline.svg?react";
import ArrowRightIcon from "@/assets/icons/nav-arrow-right.inline.svg?react";

interface CartRecommendationsProps {
  products: Product[];
}

const CartRecommendations = ({ products }: CartRecommendationsProps) => {
  const swiperRef = useRef<SwiperType | null>(null);

  if (!products.length) return null;

  return (
    <section>
      <div className="mb-6 flex-between">
        <h3 className="text-lg">推薦商品</h3>
        <div className="flex-between gap-1">
          <Button
            variant="icon"
            icon={ArrowLeftIcon}
            onClick={() => swiperRef.current?.slidePrev()}
          />
          <Button
            variant="icon"
            icon={ArrowRightIcon}
            onClick={() => swiperRef.current?.slideNext()}
          />
        </div>
      </div>
      <Swiper
        slidesPerView={3}
        breakpoints={{
          400: { slidesPerView: 2 },
          580: { slidesPerView: 3 },
          960: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        }}
        spaceBetween={16}
        loop={products.length > 5}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
      >
        {products.map((product) => {
          const isOutOfStock = (product.countInStock ?? 0) <= 0;

          return (
            <SwiperSlide key={product._id} className="flex h-auto flex-col">
              <Link
                to={`/products/${product._id}`}
                rel="noreferrer"
                className={cn(
                  "group flex flex-1 flex-col gap-2",
                  isOutOfStock && "pointer-events-none opacity-50"
                )}
                target="_blank"
              >
                <div className="aspect-square rounded bg-gray-200">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="size-full max-w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) =>
                      (e.currentTarget.src =
                        "https://placehold.co/144x144?text=No+Image")
                    }
                    loading="lazy"
                  />
                </div>
                <p className="mt-1 line-clamp-1 text-sm font-medium">
                  {product.title}
                </p>
              </Link>
              <p className="text-sm font-bold text-primary">
                NT$ {addComma(product.price)}
              </p>
              <AddToCartBtn
                btnType="text"
                product={product}
                quantity={1}
                className="mt-2 py-2 text-xs md:text-sm [&>svg]:hidden"
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default CartRecommendations;
